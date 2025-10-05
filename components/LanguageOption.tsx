import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface LanguageOptionProps {
  label: string;
  value: string;
  selectedValue: string;
  onPress: (value: string) => void;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({ 
  label, 
  value,
  selectedValue,
  onPress 
}) => {
  const isSelected = value === selectedValue;

  return (
    <Pressable 
      onPress={() => onPress(value)}
      style={styles.container}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View style={styles.radioContainer}>
        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  radioContainer: {
    marginRight: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  radioOuterSelected: {
    borderColor: "#007AFF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});

export default LanguageOption;