import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfilePicture from "./ProfilePicture";
import { format } from "date-fns";
import { getGreetingText } from "@/scripts/utils";
import { useTranslation } from "react-i18next";
import { useDateLocale } from "@/hooks/useDateLocale";
import { SessionInfo } from "@/types/classroom.type";

interface ClockInCardProps {
  fullName: string;
  classroom: string;
  grade?: string;
  profilePicUri?: string;
  sessionData?: SessionInfo;
}

const ClockInCard: React.FC<ClockInCardProps> = ({
  fullName,
  classroom,
  grade,
  profilePicUri,
  sessionData,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useTranslation();
  const dateLocale = useDateLocale();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ProfilePicture uri={profilePicUri} size={60} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>
            {t(`greeting.${getGreetingText(new Date().getHours())}`)}
          </Text>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.classInfo}>
            {classroom} {grade ? `(${grade})` : ""}
          </Text>
        </View>
      </View>
      {!sessionData && (
        <View style={[styles.sessionContainer, styles.sessionEmptyContainer]}>
          <Text style={{ color: "grey" }}>
            {t("common.No Ongoing Session")}
          </Text>
        </View>
      )}
      {sessionData && (
        <View style={styles.sessionContainer}>
          <View style={styles.leftInfo}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>{t("common.dateLabel")}</Text>
              <Text style={styles.value}>{sessionData?.displayDate}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>{t("common.timeLabel")}</Text>
              <Text style={styles.value}>{sessionData?.displayTime}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>{t("common.room")}</Text>
              <Text style={styles.value}>{sessionData?.room}</Text>
            </View>
          </View>
          <View style={styles.flexContainer}>
            <View style={styles.middleInfo}>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>{t("common.subjectName")}</Text>
                <Text style={styles.value}>
                  {sessionData?.subjectName}
                </Text>
              </View>
            </View>
            <View style={styles.rightInfo}>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>{t("common.topic")}</Text>
                <Text style={styles.value}>
                  {sessionData?.topic ?? "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <Text style={styles.timeText}>
        {format(currentTime, "EEEE, dd-MM-yyyy HH:mm:ss", {
          locale: dateLocale,
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  headerText: { marginLeft: 12 },
  greeting: { fontSize: 14, color: "#666" },
  name: { fontSize: 18, fontWeight: "600", color: "#333" },
  classInfo: { fontSize: 13, color: "#999", marginTop: 2 },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    alignSelf: "center",
    marginTop: 10,
  },
  sessionContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFBE6",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFD800",
    columnGap: 8,
  },
  sessionEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  leftInfo: {
    flex: 0,
    minWidth: 100,
  },
  flexContainer: {
    flex: 1,
    flexDirection: "row",
    columnGap: 8,
  },
  middleInfo: {
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 80,
  },
  rightInfo: {
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 80,
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
  infoBlock: {
    marginBottom: 8,
  },
});

export default ClockInCard;