import LoginForm from "@/components/LoginForm";
import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import { handleResponse } from "@/scripts/utils";
import authService from "@/services/auth.service";
import biometricService from "@/services/biometric.service";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const app = useApp();
  const { signIn, loginId } = useSession();
  const { t } = useTranslation();

  const handlePasswordLogin = async (password: string) => {
    try {
      if (!password.trim()) {
        app.showModal("Error", t("login.Please enter your password"));
        return;
      }

      app.showOverlay("Logging in...");
      const response = await authService.login(
        loginId?.loginId ?? "",
        password
      );
      if (response.code === 401) {
        app.showModal(t('login.Failed Login'), response.message, undefined, false);
        return;
      } else if (response.code === 429) {
        app.showModal("login.Failed Login", response.message, undefined, false);
        return;
      }

      if (handleResponse(response).ok) {
        signIn({
          session: response.data?.user,
          token: response.data.accessToken,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      app.showModal(
        "Error",
        t("login.Login failed. Please try again later"),
        undefined,
        false
      );
    } finally {
      app.hideOverlay();
    }
  };

  const handleBiometricLogin = async () => {
    try {
    
      const authenticated = await biometricService.authenticate();
      if (!authenticated) {
        throw new Error('Biometric authentication was cancelled or failed');
      }
      app.showOverlay("Logging in...");
      const response = await authService.loginWithBiometric(
        loginId?.loginId ?? ""
      );
      
      if (response?.accessToken) {
         signIn({ session: response.user, token: response.accessToken });
         return;
      } else {
        throw new Error("Error login using biometric. no access token on response.");
      }
    } catch (error: any) {
      app.showModal("Error", t("biometric.signInFailed"), undefined, false);
      console.log(error.message);
    } finally {
      app.hideOverlay();
    }
  };

  return (
    <PageLayout title="Login">
      <View style={styles.container}>
        <LoginForm
          onSubmit={handlePasswordLogin}
          onBiometricLogin={handleBiometricLogin}
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
