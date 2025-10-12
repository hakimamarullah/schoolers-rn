// services/notificationService.ts
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

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

const NOTIFICATIONS_STORAGE_KEY = '@notifications_storage'

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
 * Register for push notifications and get the Expo Push Token
 */

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  // Set up notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  // Check if running on physical device
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return undefined;
  }

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return undefined;
  }

  // Request Firebase Messaging permission (Android 13+)
  if (Platform.OS === 'android') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Firebase messaging permission not granted');
    }
  }

  // Get FCM token
  try {
    token = await messaging().getToken();
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Error getting push token:', error);
  }

  return token;
}

/**
 * Save notification to local storage
 */
export async function saveNotificationToStorage(
  notification: Notifications.Notification
): Promise<void> {
  try {
    const storedNotif: StoredNotification = {
      id: notification.request.identifier,
      title: notification.request.content.title || 'Notification',
      body: notification.request.content.body || '',
      data: (notification.request.content.data as any) || {},
      receivedAt: new Date(notification.date).toISOString(),
      hasRead: false,
    }

    // Get existing notifications
    const existing = await getStoredNotifications()
    const updated = [storedNotif, ...existing]

    // Save to storage
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving notification to storage:', error)
  }
}

/**
 * Get all stored notifications
 */
export async function getStoredNotifications(): Promise<StoredNotification[]> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting stored notifications:', error)
    return []
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notifications = await getStoredNotifications()
    const updated = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, hasRead: true } : notif
    )
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

/**
 * Get notification by ID
 */
export async function getNotificationById(
  notificationId: string
): Promise<StoredNotification | null> {
  try {
    const notifications = await getStoredNotifications()
    return notifications.find(notif => notif.id === notificationId) || null
  } catch (error) {
    console.error('Error getting notification by ID:', error)
    return null
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing notifications:', error)
  }
}

/**
 * Delete specific notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const notifications = await getStoredNotifications()
    const filtered = notifications.filter(notif => notif.id !== notificationId)
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const notifications = await getStoredNotifications()
    return notifications.filter(notif => !notif.hasRead).length
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}