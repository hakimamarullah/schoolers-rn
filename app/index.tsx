import { PageLayout } from "@/components/PageLayout";
import SetupHostForm from "@/components/SetupHostForm";
import { initializeApiClient } from "@/config/apiClient.config";
import { useApp } from "@/hooks/useApp";
import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import { useSession } from "@/hooks/useSession";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

export default function SetupHostScreen() {
  const { setHost } = useSession();
  const app  = useApp();

  const { setSafeTimeout } = useSafeTimeout();

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
        setSafeTimeout(() => controller.abort(), 4000);

        const response = await fetch(`${host}/api/info`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unreachable");
        }

        await response.json();
      
        app.hideOverlay();
        setHost(host);
        await initializeApiClient();
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
