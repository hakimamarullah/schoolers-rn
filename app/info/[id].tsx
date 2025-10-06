import { PageLayout } from '@/components/PageLayout';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

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
