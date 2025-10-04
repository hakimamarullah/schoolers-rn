import NotificationCard, { NotificationInfo } from '@/components/NotificationCard'
import { PageLayout } from '@/components/PageLayout'
import { RelativePathString, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet, FlatList } from 'react-native'

export default function InfoScreen() {
  const router = useRouter()

  // 20 mock notifications
  const info: NotificationInfo[] = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Notification ${i + 1}: ${
          i % 2 === 0
            ? 'Check new assignment for biology that you might have missed last week'
            : 'Important update from the school administration regarding upcoming exams and activities'
        }`,
        hasRead: i % 3 === 0, // some read, some unread
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${
          i % 2 === 0
            ? 'Quisque faucibus ex sapien. Lorem ipsum dolor sit amet consectetur adipiscing elit.'
            : 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
        }`,
        date: `${i + 10} Jan 2025`,
      })),
    []
  )

  return (
    <PageLayout title="Information">
      <FlatList
        data={info}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationCard
            data={item}
            onPress={() =>
              router.push(`/info/${item?.id}` as RelativePathString)
            }
          />
        )}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true} // improves performance
        initialNumToRender={10} // render first 10 items initially
        maxToRenderPerBatch={5} // batch rendering
        windowSize={5} // number of items rendered outside viewport
      />
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
})
