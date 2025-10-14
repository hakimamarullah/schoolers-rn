// app/info/index.tsx
import InformationCardSkeleton from '@/components/InformationCardSkeleton'
import InformationCard, { NotificationInfo } from '@/components/InformationCard'
import { PageLayout } from '@/components/PageLayout'
import { removeTime } from '@/scripts/utils'
import informationService from '@/services/information.service'
import { InformationSimpleResponse } from '@/types/information.type'
import { MaterialIcons } from '@expo/vector-icons'
import { RelativePathString, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useNotifications } from '@/hooks/UseNotification'

export default function InfoScreen() {
  const router = useRouter()
  const [informations, setInformations] = useState<InformationSimpleResponse[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const { t } = useTranslation()
  const { refreshUnreadCount } = useNotifications();

  const loadingRef = useRef(false)
  const PAGE_SIZE = 20

  const transformToNotificationInfo = (item: InformationSimpleResponse): NotificationInfo => {
    return {
      id: item.id,
      title: item.title,
      hasRead: item.hasRead,
      content: item.body,
      date: removeTime(item.createdAt),
    }
  }

  const fetchInformations = async (pageNum: number, isRefresh = false) => {
    if (loadingRef.current) return
    if (!isRefresh && !hasMore) return

    loadingRef.current = true

    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await informationService.getInformations(pageNum, PAGE_SIZE)
      if (response) {
        if (isRefresh) {
          setInformations(response.content || [])
          setPage(0)
        } else {
          setInformations((prev) => [...prev, ...(response.content || [])])
        }
        setHasMore(pageNum + 1 < response.totalPages)
      }
    } catch (error: any) {
      console.log({ err: error })
      setError(t('common.failedToLoadInformation'))
    } finally {
      setLoading(false)
      setRefreshing(false)
      setInitialLoad(false)
      loadingRef.current = false
    }
  }

  useEffect(() => {
    fetchInformations(0, true)
  }, [])

  const onRefresh = useCallback(() => {
    setHasMore(true)
    setPage(0)
    fetchInformations(0, true)
    refreshUnreadCount()
  }, [])

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || informations.length === 0) return

    const nextPage = page + 1
    setPage(nextPage)
    fetchInformations(nextPage)
  }, [hasMore, page, informations.length])

  const handleInfoPress = async (item: NotificationInfo) => {
  setInformations((prev) =>
    prev.map((info) =>
      info.id === item.id ? { ...info, hasRead: true } : info
    )
  );
  router.push(`/info/${item.id}` as RelativePathString);
};


  const transformedInformations = informations.map(transformToNotificationInfo)

  const renderFooter = () => {
    if (!loading) return null
    return (
      <View style={styles.footer}>
        <InformationCardSkeleton />
        <InformationCardSkeleton />
      </View>
    )
  }

  const renderEmptyState = () => {
    if (initialLoad) {
      return (
        <View>
          <InformationCardSkeleton />
          <InformationCardSkeleton />
          <InformationCardSkeleton />
          <InformationCardSkeleton />
          <InformationCardSkeleton />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color="#9CA3AF" />
          <Text style={styles.stateText}>{error}</Text>
          <Text style={styles.stateSubtext}>
            {t('common.Pull down to try again')}
          </Text>
        </View>
      )
    }

    if (informations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <MaterialIcons name="info-outline" size={48} color="#9CA3AF" />
          <Text style={styles.stateText}>{t('common.No notifications yet')}</Text>
          <Text style={styles.stateSubtext}>
            {t("common.You'll see your notifications here when you receive them")}
          </Text>
        </View>
      )
    }

    return null
  }
  return (
    <PageLayout title="Information">
      <View style={styles.container}>
        <FlatList
          data={transformedInformations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <InformationCard data={item} onPress={() => handleInfoPress(item)} />
          )}
          contentContainerStyle={
            transformedInformations.length === 0 ? styles.emptyContentContainer : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  footer: {
    paddingTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  stateText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  stateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
})