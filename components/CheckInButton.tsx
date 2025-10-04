import React from "react";
import { StyleSheet, Text, Pressable, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CheckInButtonProps {
  onPress: () => void;
}

export default function CheckInButton({ onPress }: CheckInButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: "#e6e0b8" }}
      style={({ pressed }): ViewStyle[] => [
        styles.pressable,
        pressed ? { opacity: 0.9 } : {},
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#FFD800", "#FFB800"]} // gradient from bright to darker yellow
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <Text style={styles.text}>Check-In</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  container: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
