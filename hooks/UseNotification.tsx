// providers/NotificationProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { 
  StoredNotification, 
  getStoredNotifications, 
  markNotificationAsRead, 
  registerForPushNotificationsAsync, 
  saveFCMMessageToStorage,
  setupTokenRefreshListener,
  setupForegroundMessageHandler,
  handleInitialNotification,
  setupNotificationOpenedListener
} from '@/services/notification.service'
import { useSafeTimeout } from './useSafeTimeout'

interface NotificationContextType {
  devicePushToken: string | undefined
  notifications: StoredNotification[]
  refreshNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [devicePushToken, setDevicePushToken] = useState<string | undefined>()
  const [notifications, setNotifications] = useState<StoredNotification[]>([])
  const router = useRouter()
  const { setSafeTimeout } = useSafeTimeout()

  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null)
  const tokenRefreshUnsubscribe = useRef<(() => void) | null>(null)
  const foregroundMessageUnsubscribe = useRef<(() => void) | null>(null)
  const notificationOpenedUnsubscribe = useRef<(() => void) | null>(null)

  // Load stored notifications
  const refreshNotifications = async () => {
    const stored = await getStoredNotifications()
    setNotifications(stored)
  }

  // Mark notification as read
  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    await refreshNotifications()
  }

  // Navigate to target screen from notification data
  const navigateToTarget = (data: any) => {
    if (data?.targetScreen) {
      const targetScreen = data.targetScreen as string
      setSafeTimeout(() => {
        router.push(targetScreen as any)
      }, 100)
    }
  }

  useEffect(() => {
    // Register for push notifications and get FCM token
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setDevicePushToken(token)
          console.log('✅ FCM Token registered:', token)
        }
      })
      .catch((error) => console.error('❌ Error registering for push notifications:', error))

    // Load initial notifications
    refreshNotifications()

    // Check if app was opened from a notification (when app was killed)
    handleInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('🚀 App launched from notification:', remoteMessage)
        refreshNotifications()
        navigateToTarget(remoteMessage.data)
      }
    })

    // Setup FCM token refresh listener
    tokenRefreshUnsubscribe.current = setupTokenRefreshListener()

    // Setup Firebase foreground message handler
    // This receives FCM messages when app is in FOREGROUND
    foregroundMessageUnsubscribe.current = setupForegroundMessageHandler(
      async (remoteMessage) => {
        console.log('📨 FCM message (foreground):', remoteMessage)
        
        // Save FCM message to storage
        await saveFCMMessageToStorage(remoteMessage)
        await refreshNotifications()
      }
    )

    // Setup listener for when app opens from notification (background state)
    notificationOpenedUnsubscribe.current = setupNotificationOpenedListener(
      async (remoteMessage) => {
        console.log('📬 Notification opened (background):', remoteMessage)
        
        // Refresh notifications to show the new one
        await refreshNotifications()
        
        // Navigate to target screen
        navigateToTarget(remoteMessage.data)
      }
    )

    // Listener for when user taps on notification (local or foreground)
    // This handles taps when app is already in FOREGROUND
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        console.log('👆 Notification tapped (foreground):', response)

        const notificationId = response.notification.request.identifier
        const data = response.notification.request.content.data

        // Mark as read
        await markNotificationAsRead(notificationId)
        await refreshNotifications()

        // Navigate to target screen
        navigateToTarget(data)
      }
    )

    // Cleanup
    return () => {
      if (responseListener.current) {
        responseListener.current.remove()
      }
      if (tokenRefreshUnsubscribe.current) {
        tokenRefreshUnsubscribe.current()
      }
      if (foregroundMessageUnsubscribe.current) {
        foregroundMessageUnsubscribe.current()
      }
      if (notificationOpenedUnsubscribe.current) {
        notificationOpenedUnsubscribe.current()
      }
    }
  }, [router])

  return (
    <NotificationContext.Provider
      value={{
        devicePushToken,
        notifications,
        refreshNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}