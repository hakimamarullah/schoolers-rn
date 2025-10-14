import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { useFileDownloader } from "@/hooks/useFileDownloader";
import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import assignmentService from "@/services/assignment.service";
import { AssignmentResponse, ResourceType } from "@/types/assignments.type";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AssignmentDetails() {
  const { id } = useLocalSearchParams();
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const app = useApp();
  const router = useRouter();
  const { download } = useFileDownloader();
  const { t } = useTranslation();


  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAssignmentDetails(Number(id));
        setAssignment(data);
      } catch (error: any) {
        app.showModal("Info", error.message, () => router.back(), false);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const openUri = (uri: string, onError?: (error: any) => void) => {
    Linking.openURL(uri).catch((err) => onError?.(err));
  };

  const handleFilePress = async (uri: string) => {
    try {
      app.showModal(
        "Info",
        t("common.confirmDowloadFile", { file: uri }),
        async () => await download(uri, undefined, () => openUri(uri)),
        true
      );
    } catch (error: any) {}
  };

  const handleUrlPress = (url: string) => {
    app.showModal(
      "Info",
      t("common.confirmOpenUrl", { uri: url }),
      () => openUri(url),
      true
    );
  };

  const fileResources = assignment?.resources?.filter(
    (r) => r.resourceType === ResourceType.FILE
  );
  const urlResources = assignment?.resources?.filter(
    (r) => r.resourceType === ResourceType.URL
  );

  const submitMarkAsDone = async () => {
    try {
      const response = await assignmentService.updateAssignmentStatus(
        Number(id),
        "SUBMITTED"
      );
      app.showModal("Info", response, undefined, false);
    } catch (error: any) {
      app.showModal("Info", error.message, undefined, false);
    }
  };
  const handleMarkAsDone = () => {
    app.showModal("Info", t("common.confirmMarkAsDone"), submitMarkAsDone);
  };

  if (isLoading) {
    return (
      <PageLayout title="Information">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </PageLayout>
    );
  }
  return (
    <PageLayout title="Assignment Details">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="description" size={25} color="#A67C00" />
          </View>

          {/* Subject Name */}
          <View style={styles.subjectNameContainer}>
            <Text style={styles.subjectName}>{assignment?.subjectName}</Text>
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={styles.label}>{t("assignmentDetails.duedate")}</Text>
          <Text style={styles.value}>{assignment?.dueDate}</Text>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>{t("assignmentDetails.title")}</Text>
          <Text style={styles.value}>{assignment?.title}</Text>
        </View>

        {/* Description */}
        {assignment?.description && (
          <View style={styles.section}>
            <Text style={styles.label}>
              {t("assignmentDetails.description")}
            </Text>
            <Text style={styles.value}>{assignment.description}</Text>
          </View>
        )}

        {/* Files */}
        {fileResources && fileResources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>{t("assignmentDetails.files")}</Text>
            {fileResources?.map((file) => (
              <Pressable
                key={file.id}
                style={styles.fileItem}
                onPress={() => handleFilePress(file.resourcePath)}
              >
                <MaterialIcons
                  name="insert-drive-file"
                  size={20}
                  color="#6366f1"
                />
                <Text style={styles.fileText}>{file.resourceName}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* URLs */}
        {urlResources && urlResources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>{t("assignmentDetails.url")}</Text>
            {urlResources.map((url) => (
              <Pressable
                key={url.id}
                style={styles.urlItem}
                onPress={() => handleUrlPress(url.resourcePath)}
              >
                <Text style={styles.urlText}>{url.resourceName}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Remaining Time */}
        {assignment?.remainingTimeBadgeText && (
          <View style={styles.section}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {assignment.remainingTimeBadgeText}
            </Text>
          </View>
        )}

        {/* Mark as Done Button */}
        {!assignment?.isSubmitted && (
          <Pressable onPress={handleMarkAsDone} style={styles.button}>
            <Text style={styles.buttonText}>
              {t("assignmentDetails.markAsDone")}
            </Text>
          </Pressable>
        )}

        {/* Submitted Badge */}
        {assignment?.isSubmitted && (
          <View style={styles.submittedBadge}>
            <MaterialIcons name="check-circle" size={20} color="#15803D" />
            <Text style={styles.submittedText}>
              {t("assignmentDetails.submitted")}
            </Text>
          </View>
        )}
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#FFE78A",
    width: 40,
    height: 40,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  subjectNameContainer: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    flexWrap: "wrap",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
    textAlign: "justify",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  fileText: {
    fontSize: 16,
    color: "#6366f1",
    textDecorationLine: "underline",
  },
  urlItem: {
    paddingVertical: 8,
  },
  urlText: {
    fontSize: 16,
    color: "#6366f1",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#FDE047",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  submittedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#DCFCE7",
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    marginHorizontal: 10,
  },
  submittedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#15803D",
  },
});
