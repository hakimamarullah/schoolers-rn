import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface LogoutBtnProps {
  handler: () => void; // simple click handler type
}
export default function LogoutBtn({ handler } : LogoutBtnProps) {
  return (
    <TouchableOpacity
      key="logout"
      onPress={handler}
    >
      <Ionicons name="log-out-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}

