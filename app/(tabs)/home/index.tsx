import { StyleSheet } from 'react-native'
import React from 'react'
import { PageLayout } from '@/components/PageLayout'
import LogoutBtn from '@/components/LogoutBtn'

export default function HomeScreen() {
  return (
   <PageLayout title='Schoolers' headerRight={<LogoutBtn handler={() => console.log("Logout")}/>}>

   </PageLayout>
  )
}

const styles = StyleSheet.create({})