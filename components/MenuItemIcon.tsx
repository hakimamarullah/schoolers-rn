import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

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

export default function MenuItemIcon({
  iconName,
  title,
  onPress,
  iconColor = "#FFB800",
  bgColor = "#FFECC2",
  showBadge = false,
  badgeText = "NEW",
  style,
}: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        style,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.container}>
        {/* Icon section */}
        <View style={styles.iconSection}>
          {/* Diamond background */}
          <View
            style={[
              styles.iconBackground,
              { backgroundColor: bgColor },
            ]}
          />
          {/* Icon */}
          <Ionicons
            name={iconName}
            size={28}
            color={iconColor}
            style={styles.icon}
          />
        </View>
        
        {/* Badge - separate from icon, centered below it */}
        {showBadge && (
          <View style={styles.badgeWrapper}>
            <View style={styles.badge}>
              <Text style={styles.badgeText} allowFontScaling={false}>
                {badgeText}
              </Text>
            </View>
          </View>
        )}

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
    alignItems: "center",
    width: 80,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  iconSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 48,
    height: 48,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 14,
    transform: [{ rotate: "45deg" }],
    borderColor: "#ffd800",
    borderWidth: 0.3,
  },
  icon: {
    position: "absolute",
    transform: [{ rotate: "-20deg" }],
  },
  badgeWrapper: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  badge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#fff",
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: 13,
    maxWidth: 80,
    marginTop: 10,
  },
});