import { SessionInfo } from "@/types/classroom.type";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import SessionInfoCard from "./SessionInfoCard";
import { Ionicons } from "@expo/vector-icons";

type SectionProps = {
  title: string;
  data: SessionInfo[];
};

const SessionInfoSection = ({ title, data }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.length > 0 ? (
      data.map((item, idx) => <SessionInfoCard key={idx} data={item} />)
    ) : (
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
        <Text style={styles.emptyText}>No sessions available</Text>
      </View>
    )}
  </View>
);

export default memo(SessionInfoSection);

const styles = StyleSheet.create({
  section: { marginTop: 50, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 18,
    paddingBottom: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
});