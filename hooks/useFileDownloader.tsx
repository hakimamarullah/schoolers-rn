import { File, Paths } from "expo-file-system/next";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useApp } from "@/hooks/useApp";
import { useSafeTimeout } from "./useSafeTimeout";

/**
 * Downloads a file to cache, saves it into the user's Downloads/Schoolers folder,
 * and optionally opens the share sheet using Expo Sharing.
 */
export function useFileDownloader() {
  const app = useApp();
  const { setSafeTimeout } = useSafeTimeout();

  const downloadFile = async (url: string, filename?: string, openShare = false) => {
    try {
      app.showOverlay?.("Downloading file...");
      setSafeTimeout(() => app.hideOverlay(), 10000);

      // 1️⃣ Download file to cache first
      const output = await File.downloadFileAsync(url, Paths.cache);
      if (!output.exists) throw new Error("Download failed.");

      // 2️⃣ Request permissions for saving to user media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access media library was denied.");
      }

      // 3️⃣ Create a persistent copy in the "Downloads/Schoolers" folder
      const asset = await MediaLibrary.createAssetAsync(output.uri);
      let album = await MediaLibrary.getAlbumAsync("Schoolers");
      if (!album) {
        album = await MediaLibrary.createAlbumAsync("Schoolers", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      app.hideOverlay?.();

      const savedUri = asset.uri;
      console.log("✅ File saved to:", savedUri);

      app.showModal?.("Success", `File saved to:\n${savedUri}`);

      // 4️⃣ Optionally open share dialog
      if (openShare && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(savedUri);
      }

      return asset;
    } catch (error: any) {
      console.error("❌ Download failed:", error);
      app.hideOverlay?.();
      app.showModal?.("Error", error.message || "File download failed.");
      throw error;
    }
  };

  return { downloadFile };
}
