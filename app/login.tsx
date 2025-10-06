import LoginForm from "@/components/LoginForm";
import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import { handleResponse } from "@/scripts/utils";
import authService from "@/services/auth.service";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const app = useApp();
  const { signIn, loginId } = useSession();

  const handlePasswordLogin = async (password: string) => {
    try {
      if (!password.trim()) {
        app.showModal("Error", "Please enter your password");
        return;
      }

      app.showOverlay("Logging in...");
      const response = await authService.login(loginId?.loginId ?? "", password);
      if (response.code === 401) {
        app.showModal("Failed Login", response.message, undefined, false);
        return;
      } else if (response.code === 429) {
        app.showModal("Failed Login", response.message, undefined, false);
        return;
      }

      if (handleResponse(response).ok) {
        signIn({session: response.data?.user, token: response.data.accessToken})
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      app.showModal("Error", "Login failed. Please try again later", undefined, false);
    }
    finally {
      app.hideOverlay();
    }
  };

  const handleBiometricSuccess = async () => {
   try {
     // Biometric verified by OS - now authenticate with backend
    app.showOverlay("Logging in...");
    const response = await authService.loginWithBiometric(loginId?.loginId ?? "");
    signIn({session: response?.user, token: response.accessToken});
   } catch(error: any) {
     app.showModal("Error", error.message, undefined, false);
   } finally {
    app.hideOverlay();
   }
    
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
    flex: 1,
  },
});
