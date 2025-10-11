import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { useFileDownloader } from "@/hooks/useFileDownloader";
import assignmentService from "@/services/assignment.service";
import { AssignmentResponse, ResourceType } from "@/types/assignments.type";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
  const app = useApp();
  const router = useRouter();
  const { downloadFile } = useFileDownloader();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getAssignmentDetails(Number(id));
        setAssignment(data);
      } catch (error: any) {
        app.showModal("Info", error.message, () => router.back(), false);
      }
    };

    fetchAssignment();
  }, [id]);

  const openUri = (uri: string, onError?: (error: any) => void) => {
    Linking.openURL(uri).catch((err) => onError?.(err));
  };
  const handleFilePress = async (url: string) => {
    try {
      // await downloadFile(url); Disable for now

      app.showModal(
        "Info",
        t("common.confirmDowloadFile", { file: url }),
        () => openUri(url),
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

  const handleMarkAsDone = () => {
    app.showModal("Info", t("common.confirmMarkAsDone"), () => console.log("Marked"));
  }

  return (
    <PageLayout title="Assignment Details">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="description" size={48} color="#9CA3AF" />
        </View>

        {/* Subject Name */}
        <Text style={styles.subjectName}>{assignment?.subjectName}</Text>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.value}>{assignment?.dueDate}</Text>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{assignment?.title}</Text>
        </View>

        {/* Description */}
        {assignment?.description && (
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{assignment.description}</Text>
          </View>
        )}

        {/* Files */}
        {fileResources && fileResources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Files</Text>
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
            <Text style={styles.label}>URL</Text>
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
            <Text style={styles.label}>Remaining time</Text>
            <Text style={styles.value}>
              {assignment.remainingTimeBadgeText}
            </Text>
          </View>
        )}

        {/* Mark as Done Button */}
        {!assignment?.isSubmitted && (
          <Pressable onPress={handleMarkAsDone} style={styles.button}>
            <Text style={styles.buttonText}>Mark as done</Text>
          </Pressable>
        )}

        {/* Submitted Badge */}
        {assignment?.isSubmitted && (
          <View style={styles.submittedBadge}>
            <MaterialIcons name="check-circle" size={20} color="#15803D" />
            <Text style={styles.submittedText}>Submitted</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
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
  },
  submittedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#15803D",
  },
});
