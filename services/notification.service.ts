// services/notificationService.ts
import { getSecureApiClient } from '@/config/apiClient.config'
import { ApiResponse } from '@/types/api.type'
import { AppNotificationRequest } from '@/types/notification.type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  AuthorizationStatus, getInitialNotification, getMessaging, getToken,
  onMessage, onNotificationOpenedApp,
  onTokenRefresh, requestPermission,
  setBackgroundMessageHandler
} from '@react-native-firebase/messaging'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import deviceService from './device.service'

export interface StoredNotification {
  id: string
  title: string
  body: string
  data: {
    targetScreen?: string
    [key: string]: any
  }
  receivedAt: string
  hasRead: boolean
}


const FCM_TOKEN_STORAGE_KEY = '@fcm_token'

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

/**
 * Register for push notifications and get the FCM Token
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined

  // Set up notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  // Check if running on physical device
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications')
    return undefined
  }

  // Request permissions from Expo Notifications
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permission!')
    return undefined
  }

  // Request Firebase Messaging permission
  try {
    const authStatus = await requestPermission(getMessaging())
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL

    if (!enabled) {
      console.log('Firebase messaging permission not granted')
      return undefined
    }
  } catch (error) {
    console.error('Error requesting Firebase permission:', error)
    return undefined
  }

  // Get FCM token
  try {
    token = await getToken(getMessaging());
    
    const oldToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token)
    if (oldToken === token) {
      return token;
    }
    await sendTokenToServer(token)
    
  } catch (error) {
    console.error('Error getting FCM token:', error)
  }

  return token
}

/**
 * Setup token refresh listener
 */
export function setupTokenRefreshListener() {
  return onTokenRefresh(getMessaging(), async (newToken) => {
    console.log('FCM Token refreshed:', newToken)
    
    const oldToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, newToken)
    await refreshFcmToken(newToken, oldToken)
  })
}


async function refreshFcmToken(newToken: string, oldToken?: string | null): Promise<void> {
  try {
    const api = getSecureApiClient();
     const { deviceId, deviceName } = await deviceService.getDeviceInfo();
    const request: AppNotificationRequest = {
        deviceId,
        deviceName,
        token: newToken,
        osType: Platform.OS.toUpperCase()

    }

    await api.put("/notifications/tokens/refresh", request, {
      params: {
        oldToken
      }
    })
  } catch(error: any) {
    console.error("Error refresh FCM token", error);
  }
}


/**
 * Send FCM token to your backend
 */
async function sendTokenToServer(fcmToken: string): Promise<void> {
  try {
    
    const api = getSecureApiClient();

    const { deviceId, deviceName } = await deviceService.getDeviceInfo();
    const request: AppNotificationRequest = {
        deviceId,
        deviceName,
        token: fcmToken,
        osType: Platform.OS.toUpperCase()

    }
    
    
     await api.post<ApiResponse<any>>("/notifications/tokens/register", request);
   
    console.log('FCM token registered successfully')
  } catch (error) {
    console.error('Error sending token to server:', error)
  }
}

/**
 * Setup Firebase background message handler
 * This should be called outside of any component
 * NOTE: This runs when app is QUIT (completely closed)
 */
export function setupBackgroundMessageHandler() {
  setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
    console.log('📦 Message handled in background (app quit):', remoteMessage)
  })
}

/**
 * Setup Firebase foreground message handler
 * This handles messages when app is in foreground
 */
export function setupForegroundMessageHandler(
  onMessageReceived: (remoteMessage: any) => void
) {
  return onMessage(getMessaging(), async (remoteMessage) => {
    console.log('📨 FCM message received in foreground:', remoteMessage)
    
    // Call custom handler (e.g., to save to storage or update UI)
    onMessageReceived(remoteMessage)
    
    // ✅ ONLY show notification if it's a DATA-ONLY message
    // If remoteMessage.notification exists, FCM already showed it
    if (!remoteMessage.notification && remoteMessage.data) {
      // This is a data-only message, show it manually
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.data.title as string || 'Notification',
          body: remoteMessage.data.body as string || '',
          data: remoteMessage.data || {},
        },
        trigger: null, // Show immediately
      })
    }
  })
}



/**
 * Handle notification opened when app was in background/killed
 * Call this on app startup to check if app was opened from a notification
 */
export async function handleInitialNotification(): Promise<any | null> {
  try {
    const remoteMessage = await getInitialNotification(getMessaging());
    
    if (remoteMessage) {
      console.log('📬 App opened from notification (background/killed):', remoteMessage)
      
      return remoteMessage
    }
    
    return null
  } catch (error) {
    console.error('Error handling initial notification:', error)
    return null
  }
}

/**
 * Setup listener for notifications opened when app was in background
 */
export function setupNotificationOpenedListener(
  onNotificationOpened: (remoteMessage: any) => void
) {
  return onNotificationOpenedApp(getMessaging(), (remoteMessage) => {
    console.log('📬 App opened from notification (background):', remoteMessage)
    
    // Call custom handler (e.g., navigate to screen)
    onNotificationOpened(remoteMessage)
  })
}


