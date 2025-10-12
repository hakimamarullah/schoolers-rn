// providers/NotificationProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { StoredNotification, getStoredNotifications, markNotificationAsRead, registerForPushNotificationsAsync, saveNotificationToStorage } from '@/services/notification.service'
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

  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null)
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null)

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

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync()
      .then((token: React.SetStateAction<string | undefined>) => setDevicePushToken(token))
      .catch((error: any) => console.error('Error registering for push notifications:', error))

    // Load initial notifications
    refreshNotifications()

    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      async notification => {
        console.log('📬 Notification received:', notification)
        
        // Save to local storage
        await saveNotificationToStorage(notification)
        await refreshNotifications()
      }
    )

    // Listener for when user taps on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async response => {
        console.log('👆 Notification tapped:', response)

        const notificationId = response.notification.request.identifier
        const data = response.notification.request.content.data

        // Mark as read
        await markNotificationAsRead(notificationId)
        await refreshNotifications()

        // Navigate to target screen if specified
        if (data?.targetScreen) {
          const targetScreen = data.targetScreen as string
          
          // Small delay to ensure navigation works properly
          setSafeTimeout(() => {
            router.push(targetScreen as any)
          }, 100)
        } else {
          // Default: navigate to notification detail screen
          router.push(`/info/${notificationId}` as any)
        }
      }
    )

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
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