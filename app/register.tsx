import { PageLayout } from "@/components/PageLayout";
import PersonalDataForm from "@/components/PersonalDataForm";
import { useApp } from "@/hooks/useApp";
import { useFieldErrors } from "@/hooks/useFieldErros";
import { useSession } from "@/hooks/useSession";
import { handleResponse } from "@/scripts/utils";
import authService from "@/services/auth.service";
import { RegistrationRequest, RegistrationResponse } from "@/types/auth.type";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";

export default function RegisterScreen() {
  const app = useApp();
  const router = useRouter();
  const { setLoginId } = useSession();
  const { fieldErrors, applyErrors, clearErrors } = useFieldErrors();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleSetLoginId = async (data: RegistrationResponse) => {
    setLoginId({
      loginId: data.loginId,
      fullName: data.fullName,
    });
  };

  const handleSubmit = async (data: RegistrationRequest) => {
    try {
      app.showOverlay();
      clearErrors();

      const response = await authService.register(data);
      const result = handleResponse(response);

      if (result.ok) {
        await handleSetLoginId(response.data);
        app.hideOverlay();
        router.replace("/login");
        return;
      }

      if (result.fieldErrors) {
        applyErrors(result.fieldErrors);
      } else if (result.code === 409) {
        app.showModal("Info", result.message ?? "Account already exists", undefined, false);
      } else {
        throw Error(result.message);
      }
    } catch (error) {
      app.showModal("Error", "Failed to register account. Please try again later.", undefined, false);
    } finally {
      app.hideOverlay();
    }
  };

  /**
   * Handle pull-to-refresh (reset form & reload any dropdown data)
   */
  const performRefresh = () => {
    setRefreshing(true);
    clearErrors();
    setRefreshSignal(prev => prev + 1);
    setRefreshing(false);
  }

  const onRefresh = useCallback(async () => {
    try {
      app.showModal("Info", "Reset form?", performRefresh);
    } finally {
      setRefreshing(false);
    }
  }, [clearErrors]);

  return (
    <PageLayout title="Personal Data">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PersonalDataForm 
            key={refreshSignal} 
            onSubmit={handleSubmit} 
            fieldErrors={fieldErrors} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
});