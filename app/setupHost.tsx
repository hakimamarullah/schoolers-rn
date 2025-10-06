import { PageLayout } from "@/components/PageLayout";
import SetupHostForm from "@/components/SetupHostForm";
import { getApiClient, initializeApiClient, setSignOutCallback } from "@/config/apiClient.config";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import storageService from "@/services/storage.service";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

export default function SetupHostScreen() {
  const { setHost, signOut } = useSession();
  const app  = useApp();


  const handleSubmit = useCallback(
    async (host: string) => {
      try {
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(host)) {
          app.showModal(
            "Invalid URL",
            "Please enter a valid host URL (e.g., https://your-server.com)"
          );
          return;
        }

        app.showOverlay("Validating host...");

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(`${host}/api/info`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error("Unreachable");
        }

        await response.json();
      
        app.hideOverlay();
        setHost(host);
        await initializeApiClient();
        setSignOutCallback(signOut);
      } catch (err) {
        console.warn("Host validation failed:", err);
        app.hideOverlay();
        app.showModal(
          "Invalid Host",
          "The server could not be reached. Please check your host URL and try again."
        );
      }
    },
    [setHost]
  );

  return (
    <PageLayout title="Setup Host">
      <View style={styles.container}>
        <SetupHostForm onSubmit={handleSubmit} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
