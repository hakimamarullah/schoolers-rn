import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { PageLayout } from '@/components/PageLayout';

export default function InfoDetails() {
  const { id } = useLocalSearchParams();
  return (
    <PageLayout title='Information'>
      <View>
      <Text> {id} </Text>
    </View>
    </PageLayout>
  )
}

const styles = StyleSheet.create({})