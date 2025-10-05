import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { PageLayout } from '@/components/PageLayout';
import PersonalDataSummary from '@/components/PersonalDataSummary';

export default function PersonalDataScreen() {
  const router = useRouter();
  
  const userData = {
    fullName: "Steve Roger Nasution",
    nisn: "11335924",
    gender: "Male",
    classroom: "Class A",
    email: "steve@gmail.com",
    schoolName: "SMA Negeri 1 Jakarta"
  };

  return (
    <PageLayout title="Personal Data">
      <PersonalDataSummary 
        data={userData}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({})