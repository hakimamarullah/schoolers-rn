import React from "react";
import { Pressable, Text, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  iconColor?: string;
  bgColor?: string;
  showBadge?: boolean;
  badgeText?: string;
  style?: ViewStyle;
}

export default function MenuItem({ 
  iconName, 
  title, 
  onPress, 
  iconColor = "#FFB800",
  bgColor = "#FFF6DC",
  showBadge = false,
  badgeText = "NEW",
  style 
}: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        style,
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.container}>
        {/* Icon container with rounded square background */}
        <View style={styles.iconWrapperContainer}>
          <View style={[styles.iconWrapper, { backgroundColor: bgColor, transform: [{ rotate: '45deg' }] }]} />
          {/* Optional badge */}
          {showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          )}
          <View style={styles.iconAbsolute}>
            <Ionicons name={iconName} size={28} color={iconColor} style={{ transform: [{ rotate: '-20deg'}]}} />
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 60,
  },
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconWrapperContainer: {
    width: 48,
    height: 48,
    position: "relative",
    marginBottom: 4,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    position: "absolute",
    transform: [{ rotate: '45deg' }],
  },
  iconAbsolute: {
    position: "absolute",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: -7,
    left: "50%",
    marginLeft: -17,
    backgroundColor: "#FF9800",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 10,
    fontWeight: "400",
    color: "#333",
    textAlign: "center",
    lineHeight: 12,
    maxWidth: 60,
  },
});