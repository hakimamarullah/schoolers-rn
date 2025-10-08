// hooks/useSetupLocationInterceptor.ts
import { useEffect } from "react";
import * as Location from "expo-location";

export function useSetupLocationPermission() {
  const [foregroundStatus, requestForegroundPermission] = Location.useForegroundPermissions();
  const [backgroundStatus, requestBackgroundPermission] = Location.useBackgroundPermissions();

  useEffect(() => {
    const setupPermissions = async () => {
      try {
        // Ask for foreground permission first
        const fg = await requestForegroundPermission();
        if (fg.status !== "granted") return;

        // Ask for background permission if foreground granted
        const bg = await requestBackgroundPermission();
        if (bg.status !== "granted") {
          console.warn("Background location not granted");
        }
      } catch (error) {
        console.error("Error requesting location permissions:", error);
      }
    };

    setupPermissions();
  }, []);
}
