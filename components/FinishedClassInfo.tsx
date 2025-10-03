import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

interface FinishedClassInfoProps {
  finished?: number;
  total?: number;
  style?: any; // optional extra style
}

const FinishedClassInfo = ({ finished = 0, total = 0, style }: FinishedClassInfoProps) => (
  <View style={[styles.container, style]}>
    <Text style={styles.finishedLabel}>Finished Class: </Text>
    <Text style={styles.finishedCount}>{finished}/{total}</Text>
  </View>
);

export default memo(FinishedClassInfo);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" }, // inline layout
  finishedLabel: { fontSize: 12, color: "#444" },
  finishedCount: { fontSize: 14, fontWeight: "600" },
});
