import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScheduleInfoCard from "./ScheduleInfoCard";

type SectionProps = {
  title: string;
  data: any[];
};

const ScheduleSection = ({ title, data }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.map((item, idx) => (
      <ScheduleInfoCard key={idx} {...item} />
    ))}
  </View>
);

export default memo(ScheduleSection);

const styles = StyleSheet.create({
  section: { marginVertical: 8, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 18 },
});
