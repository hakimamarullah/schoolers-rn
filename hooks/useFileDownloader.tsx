import { useApp } from "@/hooks/useApp";
import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

/**
 * Downloads a file to device storage and allows user to save it.
 */
export function useFileDownloader() {
  const app = useApp();
  const { t } = useTranslation();

  const download = async (
    url: string,
    filename?: string,
    onError?: (err: any) => void
  ) => {
    let tempFile: File | null = null;

    try {
      app.showOverlay?.(t("fileDownloader.downloading"));

      const uniqueFilename = generateUniqueFilename(url, filename);
      const output = await performDownload(url, uniqueFilename);
      tempFile = output;

      app.hideOverlay();

      await handleFileSharing(output, uniqueFilename);

      console.log("✅ File location:", output.uri);
      return output.uri;
    } catch (error: any) {
      console.error("❌ Download failed:", error);
      await handleDownloadError(error, tempFile, onError);
    } finally {
      app.hideOverlay?.();
    }
  };

  const generateUniqueFilename = (url: string, filename?: string): string => {
    const timestamp = Date.now();
    const urlFilename =
      filename || url.split("/").pop()?.split("?")[0] || "download";
    return `${timestamp}_${urlFilename}`;
  };

  const performDownload = async (
    url: string,
    filename: string
  ): Promise<File> => {
    try {
      const isAndroid = Platform.OS === "android";
      const targetFile = new File(
        isAndroid ? Paths.cache : Paths.document,
        filename
      );

      const output = await File.downloadFileAsync(url, targetFile);

      if (!output?.exists) {
        throw new Error(t("fileDownloader.downloadFailed"));
      }
      app.hideOverlay();
      return output as File;
    } catch (error: any) {
      console.log({ err: error.message });
      throw new Error(t("fileDownloader.downloadFailed"));
    }
  };

  const handleFileSharing = async (
    file: File,
    filename: string
  ): Promise<void> => {
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      throw new Error(t("fileDownloader.sharingNotAvailable"));
    }

    try {
      await Sharing.shareAsync(file.uri, {
        mimeType: getMimeType(filename),
        dialogTitle:
          Platform.OS === "android"
            ? t("fileDownloader.saveFile")
            : t("fileDownloader.saveOrShareFile"),
      });

      const successMessage =
        Platform.OS === "android"
          ? t("fileDownloader.successAndroid")
          : t("fileDownloader.successIOS");

      //app.showModal?.(t("fileDownloader.successTitle"), successMessage);
    } catch (sharingError: any) {
      handleSharingError(sharingError);
    } finally {
      if (Platform.OS === "android") {
        await cleanupCacheFile(file);
      }
    }
  };

  // Handle sharing-specific errors
  const handleSharingError = (error: any): void => {
    const isCancelled =
      error.message?.includes("cancelled") ||
      error.message?.includes("canceled");

    if (isCancelled) {
      console.log("User cancelled sharing");
      app.showModal?.(
        t("fileDownloader.infoTitle"),
        Platform.OS === "android"
          ? t("fileDownloader.userCancelled")
          : t("fileDownloader.fileSavedSharingCancelled")
      );
    } else if (Platform.OS === "ios") {
      // On iOS, file is already saved, so show success anyway
      app.showModal?.(
        t("fileDownloader.successTitle"),
        t("fileDownloader.successIOS")
      );
    } else {
      throw error;
    }
  };

  // Handle download errors
  const handleDownloadError = async (
    error: any,
    tempFile: File | null,
    onError?: (err: any) => void
  ): Promise<void> => {
    app.hideOverlay?.();

    const errorMessage =
      error.message || t("fileDownloader.fileDownloadFailed");
    app.showModal(t("fileDownloader.errorTitle"), errorMessage, () =>
      onError?.(error)
    );
    console.log("DSIHDOSHDOSUDH");

    if (tempFile) {
      await cleanupCacheFile(tempFile);
    }
  };

  const cleanupCacheFile = async (file: File | null): Promise<void> => {
    if (!file) return;

    try {
      if (file.exists) {
        file.delete();
        console.log("🗑️", t("fileDownloader.cacheCleanedUp"));
      }
    } catch (error) {
      console.warn("⚠️", t("fileDownloader.couldNotDeleteCache"), error);
    }
  };

  const getMimeType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      txt: "text/plain",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  };

  return { download };
}
