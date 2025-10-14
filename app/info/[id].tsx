// app/info/[id].tsx
import { PageLayout } from '@/components/PageLayout'
import NotificationIcon from '@/components/NotificationIcon'
import informationService from '@/services/information.service'
import { InformationSimpleResponse } from '@/types/information.type'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Image } from 'react-native'
import { useNotifications } from '@/hooks/UseNotification'

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [info, setInfo] = useState<InformationSimpleResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { refreshUnreadCount } = useNotifications();

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      try {
        setLoading(true)
        const response = await informationService.getInformationById(Number(id))
        setInfo(response)
        await informationService.markAsRead(Number(id));
        await refreshUnreadCount();
      } catch (error) {
        console.error('Error fetching notification:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNotificationDetail()
    }
  }, [id])

  if (loading) {
    return (
      <PageLayout title="Information">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </PageLayout>
    )
  }

  if (!info) {
    return (
      <PageLayout title="Information">
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Information not found</Text>
        </View>
      </PageLayout>
    )
  }
 
  return (
    <PageLayout title="Information">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header with Icon and Title */}
          <View style={styles.headerSection}>
            <NotificationIcon hasRead={info.hasRead} size={30} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{info.title}</Text>
            </View>
          </View>

          {/* Created Date */}
          <Text style={styles.date}>{info.createdAt}</Text>

          {/* Banner Image - Only show if bannerUri exists */}
          {info.bannerUri && (
            <View style={styles.bannerContainer}>
              <Image
                source={{ uri: info.bannerUri }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Title (repeated after banner as shown in the image) */}
          <Text style={styles.contentTitle}>{info.title}</Text>

          {/* Body Content */}
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>{info.body}</Text>
          </View>

          {/* Author Information */}
          {info.author?.name && (
            <View style={styles.authorContainer}>
              <Text style={styles.authorLabel}>Posted by:</Text>
              <Text style={styles.authorName}>{info.author.name}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight: 22,
    textTransform: "capitalize"
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
    marginLeft: 52,
  },
  bannerContainer: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    lineHeight: 26,
    textAlign: "center"
  },
  bodyContainer: {
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4b5563',
    textAlign: 'justify',
  },
  authorContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  errorText: {
    fontSize: 16,
    color: '#9ca3af',
  },
})