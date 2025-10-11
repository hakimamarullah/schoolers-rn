import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface AssignmentCardProps {
  date?: string | number;
  month?: string;
  year?: string | number;
  timeLeft?: string;
  title?: string;
  description?: string;
  isUrgent?: boolean;
  onPress?: () => void;
}

export default function AssignmentCard({
  date,
  month,
  year,
  timeLeft,
  title,
  description,
  isUrgent = false,
  onPress,
}: AssignmentCardProps) {
  const [flashAnim] = useState(() => new Animated.Value(0));
  

  const handlePressIn = () => {
    Animated.timing(flashAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const flashStyle = {
    opacity: flashAnim,
  };

  return (
    <View style={styles.card}>
      {/* Date */}
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.monthText}>{month}</Text>
        <Text style={styles.yearText}>{year}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
        {timeLeft && (
          <Text
            style={[styles.timeLeft, isUrgent ? styles.urgent : styles.normal]}
          >
            {timeLeft}
          </Text>
        )}
      </View>

      {/* Right-end pressable with soft flash */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.endPressable}
      >
        <Animated.View style={[styles.flashOverlay, flashStyle]} />
        <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dateBox: {
    alignItems: "center",
    minWidth: 50,
    paddingVertical: 10,
  },
  dateText: { fontSize: 28, fontWeight: "300", color: "#9CA3AF" },
  monthText: { fontSize: 14, color: "#9CA3AF" },
  yearText: { fontSize: 10, color: "#9CA3AF" },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
    marginLeft: 8,
  },
  endPressable: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 12,
    overflow: "hidden", 
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    borderRadius: 12,
    opacity: 0,
  },
  timeLeft: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
  },
  urgent: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
  normal: { backgroundColor: "#DCFCE7", color: "#15803D" },
  title: { fontSize: 14, fontWeight: "500", color: "#111827" },
  description: { fontSize: 11, color: "#6B7280" },
});
