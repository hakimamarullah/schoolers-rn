import React, { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface InputGroupProps {
  label: string;
  children: ReactNode;
  style?: ViewStyle;
  required?: boolean;
}

export default function InputGroup({
  label,
  children,
  style,
  required = false,
}: InputGroupProps) {
  return (
    <View style={[styles.fieldGroup, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 25,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
  },
  required: {
    color: "#FF0000",
  },
});