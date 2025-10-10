import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfilePicture from "./ProfilePicture";
import { format } from "date-fns";
import { getGreetingText } from "@/scripts/utils";
import { useTranslation } from "react-i18next";

interface ClockInCardProps {
  fullName: string;
  classroom: string;
  grade?: string;
  profilePicUri?: string;
}

const ClockInCard: React.FC<ClockInCardProps> = ({ fullName, classroom, grade, profilePicUri }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ProfilePicture uri={profilePicUri} size={60} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{t(`greeting.${getGreetingText(new Date().getHours())}`)}</Text>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.classInfo}>
            {classroom} {grade ? `- Grade ${grade}` : ""}
          </Text>
        </View>
      </View>
      <Text style={styles.timeText}>
        {format(currentTime, "EEEE, dd MMM yyyy HH:mm:ss")}
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
  timeText: { fontSize: 16, fontWeight: "500", color: "#333", alignSelf: "center" },
});

export default ClockInCard;
