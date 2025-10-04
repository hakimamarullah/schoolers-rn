import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

interface FinishedClassInfoProps {
  finished?: number;
  total?: number;
  style?: any;
}

const FinishedClassInfo = ({ finished = 0, total = 0, style }: FinishedClassInfoProps) => (
  <View style={[styles.container, style]}>
    <Text style={styles.finishedLabel}>Finished Class</Text>
    <Text style={styles.finishedCount}>{finished}/{total}</Text>
  </View>
);

export default memo(FinishedClassInfo);

const styles = StyleSheet.create({
  container: { 
    alignItems: "flex-start",
  },
  finishedLabel: { 
    fontSize: 12, 
    color: "#444",
    lineHeight: 16,
  },
  finishedCount: { 
    fontSize: 14, 
    fontWeight: "600",
    lineHeight: 18,
  },
});