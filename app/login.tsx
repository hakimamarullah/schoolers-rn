import LoginForm from '@/components/LoginForm';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/hooks/useSession';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const { signIn } = useSession();
  return (
    <PageLayout title='Login'>
      <View style={styles.container}>
       <LoginForm onSubmit={async (password) => signIn({ password })} onFingerprintPress={it => console.log({it})}/>
    </View>
    </PageLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})