// app/info/[id].tsx
import { PageLayout } from '@/components/PageLayout'
import { useNotifications } from '@/hooks/UseNotification'
import { StoredNotification, getNotificationById } from '@/services/notification.service'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native'

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { markAsRead } = useNotifications()
  const [notification, setNotification] = useState<StoredNotification | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotification() {
      if (id) {
        const notif = await getNotificationById(id)
        setNotification(notif)
        
        // Mark as read when viewing
        if (notif && !notif.hasRead) {
          await markAsRead(id)
        }
        
        setLoading(false)
      }
    }

    loadNotification()
  }, [id])

  if (loading) {
    return (
      <PageLayout title="Notification">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </PageLayout>
    )
  }

  if (!notification) {
    return (
      <PageLayout title="Notification">
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Notification not found</Text>
        </View>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={notification.title}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.date}>
            {new Date(notification.receivedAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.bodyText}>{notification.body}</Text>
        </View>

        {/* Display additional data if available */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Additional Information:</Text>
            {Object.entries(notification.data).map(([key, value]) => {
              // Skip targetScreen as it's internal
              if (key === 'targetScreen') return null
              
              return (
                <View key={key} style={styles.dataItem}>
                  <Text style={styles.dataKey}>{key}:</Text>
                  <Text style={styles.dataValue}>
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </Text>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  body: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  dataItem: {
    marginBottom: 8,
  },
  dataKey: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
})