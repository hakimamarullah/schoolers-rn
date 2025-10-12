// app/info/index.tsx
import NotificationCard, { NotificationInfo } from '@/components/NotificationCard'
import { PageLayout } from '@/components/PageLayout'
import { useNotifications } from '@/hooks/UseNotification'
import { RelativePathString, useRouter, useFocusEffect } from 'expo-router'
import React, { useCallback } from 'react'
import { StyleSheet, FlatList, View, Text, RefreshControl } from 'react-native'

export default function InfoScreen() {
  const router = useRouter()
  const { notifications, refreshNotifications, markAsRead } = useNotifications()
  const [refreshing, setRefreshing] = React.useState(false)

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshNotifications()
    }, [])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshNotifications()
    setRefreshing(false)
  }, [])

  // Convert stored notifications to NotificationInfo format
  const notificationList: NotificationInfo[] = notifications.map((notif, index) => ({
    id: notif.id,
    title: notif.title,
    hasRead: notif.hasRead,
    content: notif.body,
    date: new Date(notif.receivedAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }))

  const handleNotificationPress = async (item: NotificationInfo) => {
    // Mark as read
    await markAsRead(item.id as string)

    // Navigate to detail screen
    router.push(`/info/${item.id}` as RelativePathString)
  }

  return (
    <PageLayout title="Information">
      {notificationList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            You'll see your notifications here when you receive them
          </Text>
        </View>
      ) : (
        <FlatList
          data={notificationList}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationCard data={item} onPress={() => handleNotificationPress(item)} />
          )}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})