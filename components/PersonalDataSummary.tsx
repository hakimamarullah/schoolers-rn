import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { captureRef } from "react-native-view-shot";
import ProfilePicture from "./ProfilePicture";
import { useTranslation } from "react-i18next";



const PersonalDataSummary: React.FC = () => {
  const cardRef = useRef<View>(null);
  const app = useApp();
  const { session } = useSession();
  const { t } = useTranslation();

  const handleSaveImage = async () => {
    try {
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        app.showModal(
          "Info",
          t("common.cannotSaveImageWithoutPermission"),
          undefined,
          false
        );
        return;
      }

      
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
      });

     
      await MediaLibrary.saveToLibraryAsync(uri);
    
      app.showModal(
        t("common.success"),
        t("personalDataSum.Personal data card saved to gallery!"),
        undefined,
        false
      );
    } catch (error) {
      console.error("Error saving image:", error);
      app.showModal("Error", t("personalDataSum.Failed to save image"), undefined, false);
    }
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardContainer}>
        {/* Card with ref for screenshot */}
        <View ref={cardRef} style={styles.card} collapsable={false}>
          {/* Card Header with Profile */}
          <View style={styles.cardHeader}>
            <View style={styles.headerContent}>
              <ProfilePicture uri={session?.profilePictUri} size={60} />
              <View style={styles.headerText}>
                <Text style={styles.cardTitle}>
                  {session?.schoolName}
                </Text>
                <Text style={styles.profileName}>{session?.fullName}</Text>
              </View>
            </View>
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailLabel}>{t("common.fullname")}</Text>
                <Text style={styles.detailValue}>{session?.fullName}</Text>

                <Text style={[styles.detailLabel, styles.marginTop]}>{t("common.nisn")}</Text>
                <Text style={styles.detailValue}>{session?.loginId}</Text>

                <Text style={[styles.detailLabel, styles.marginTop]}>
                  {t("common.gender")}
                </Text>
                <Text style={styles.detailValue}>{session?.gender}</Text>
              </View>

              <View style={styles.detailColumn}>
                <Text style={[styles.detailLabel]}>{t("common.Classroom")}</Text>
                <Text style={styles.detailValue}>{session?.className}</Text>

                <Text style={[styles.detailLabel, styles.marginTop]}>
                  {t("common.grade")}
                </Text>
                <Text style={styles.detailValue}>{session?.grade ?? "-"}</Text>

                <Text style={[styles.detailLabel, styles.marginTop]}>
                  {t("common.email")}
                </Text>
                <Text style={styles.detailValue}>{session?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveImage}
          activeOpacity={0.7}
        >
          <MaterialIcons name="file-download" size={20} color="#000" />
          <Text style={styles.saveButtonText}>{t("personalDataSum.saveAsImage")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardContent: {
    backgroundColor: "#FFFBEA",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    fontWeight: "500",
  },
  marginTop: {
    marginTop: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD800",
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
});

export default PersonalDataSummary;
