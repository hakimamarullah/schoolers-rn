import { PageLayout } from '@/components/PageLayout';
import PersonalDataSummary from '@/components/PersonalDataSummary';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function PersonalDataScreen() {
  return (
    <PageLayout title="Personal Data">
      <PersonalDataSummary />
    </PageLayout>
  );
}

const styles = StyleSheet.create({})