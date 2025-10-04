import LoginForm from "@/components/LoginForm";
import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const app = useApp();
  const { signIn } = useSession();

  const handlePasswordLogin = (password: string) => {
    if (!password.trim()) {
      app.showModal("Error", "Please enter your password");
      return;
    }

    app.showOverlay("Logging in...");

    signIn({password});

    app.hideOverlay();
  };

  const handleBiometricSuccess = () => {
    // Biometric verified by OS - now authenticate with backend
    app.showOverlay("Logging in...");

    signIn( {password: "dummybiometric"})
    
    // Call your backend API here
    // Example: loginWithBiometric(userId)
    setTimeout(() => {
      app.hideOverlay();
      // router.push("/home");
    }, 1000);
  };

  const handleBiometricError = (error: string) => {
    app.showModal("Authentication Failed", error);
  };

  return (
    <PageLayout title="Login">
      <View style={styles.container}>
      <LoginForm
        onSubmit={handlePasswordLogin}
        onBiometricSuccess={handleBiometricSuccess}
        onBiometricError={handleBiometricError}
      />
    </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});