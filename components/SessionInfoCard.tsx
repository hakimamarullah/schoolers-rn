import { SessionInfo } from "@/types/classroom.type";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";


type SessionInfoCardProps = {
  data?: SessionInfo
}

const SessionInfoCard = ({ data }: SessionInfoCardProps) => {
  const { t } = useTranslation();
   return (
  <View style={styles.outerCard}>
    {/* Subject Title */}
    <Text style={styles.subject}>{data?.subjectName}</Text>

    {/* Inner Info Container */}
    <View style={styles.infoContainer}>
      {/* Left Side */}
      <View style={styles.leftInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>{t("common.room")}</Text>
          <Text style={styles.value}>{data?.room}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>{t("common.datetime")}</Text>
          <Text style={[styles.value, styles.datetime]}>{data?.datetime}</Text>
        </View>
       
          <View style={styles.infoBlock}>
            <Text style={styles.label}>{t("common.attendance")}</Text>
            <Text style={styles.value}>{`${data?.attendanceInfo?.attendedSessions}/${data?.attendanceInfo?.totalSessions}`}</Text>
          </View>
      
      </View>

      {/* Right Side: Teachers stacked */}
      <View style={styles.rightInfo}>
        <View style={styles.infoBlock}>
            <Text style={styles.label}>{t("common.teacher")}</Text>
            <Text style={styles.value}>{data?.teacherName}</Text>
          </View>
        <View style={styles.infoBlock}>
            <Text style={styles.label}>{t("common.topic")}</Text>
            <Text style={styles.value}>{data?.topic ?? "-"}</Text>
          </View>
      </View>
    </View>
  </View>
);
}

export default memo(SessionInfoCard);

const styles = StyleSheet.create({
  outerCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  subject: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#222",
    textTransform: "capitalize"
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFBE6",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFD800",
    columnGap: 3, // Smaller gap
  },
  leftInfo: {
    flex: 0.48, // Reduced flex
  },
  rightInfo: {
    flex: 0.48, // Reduced flex
    justifyContent: "flex-start",
  },
  infoBlock: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 13,
    fontWeight: "500",
    color: "#222",
    marginTop: 2,
  },
  datetime: {
    textTransform: "capitalize"
  }
});