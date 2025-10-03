import React from "react";
import { StyleSheet, Text, Pressable, ViewStyle } from "react-native";

interface CheckInButtonProps {
  onPress: () => void;
}

export default function CheckInButton({ onPress }: CheckInButtonProps) {
  return (
    <Pressable
    android_ripple={{ color: "#e6e0b8" }}
      style={({ pressed }): ViewStyle[] => [
        styles.container,
        pressed ? { opacity: 0.9 } : {}, // subtle dim
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>Check-In</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF7CC", // tint background
    paddingVertical: 14,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
