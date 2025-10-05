import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ProfileMenuProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  showBorder?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  iconName, 
  label, 
  onPress,
  showBorder = true 
}) => {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        showBorder && styles.borderBottom,
        pressed && styles.pressed
      ]}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={iconName} size={22} color="#333" />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <MaterialIcons name="chevron-right" size={22} color="#999" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  pressed: {
    backgroundColor: "#f5f5f5",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
  },
});

export default ProfileMenu;