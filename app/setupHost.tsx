import React, { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { PageLayout } from "@/components/PageLayout";
import AppModal, { AppModalRef } from "@/components/AppModal";
import SetupHostForm from "@/components/SetupHostForm";
import { useSession } from "@/hooks/useSession";
import LoadingOverlay, { LoadingOverlayRef } from "@/components/LoadingOverlay";

export default function SetupHostScreen() {
  const { setHost } = useSession();
  const modalRef = useRef<AppModalRef>(null);
  const overlayRef = useRef<LoadingOverlayRef>(null);

  const handleSubmit = useCallback(
    async (host: string) => {
      try {
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(host)) {
          modalRef.current?.show(
            "Invalid URL",
            "Please enter a valid host URL (e.g., https://your-server.com)"
          );
          return;
        }

        overlayRef.current?.show("Validating host...");

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(`${host}`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error("Unreachable");
        }

        overlayRef.current?.hide();
        setHost(host);
      } catch (err) {
        console.warn("Host validation failed:", err);
        overlayRef.current?.hide();
        modalRef.current?.show(
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
        <AppModal ref={modalRef} />
        <SetupHostForm onSubmit={handleSubmit} />
        <LoadingOverlay ref={overlayRef} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
