import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ClockInCard from "./ClockInCard";
import CurrentLocationMap from "./CurrentLocationMap";
import { MaterialIcons } from "@expo/vector-icons";
import { useSession } from "@/hooks/useSession";

interface ClockInFormProps {
  onSubmit: (location: { latitude: number; longitude: number, address?: string } | null) => void;
}

const ClockInForm: React.FC<ClockInFormProps> = ({ onSubmit }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number, address?: string } | null>(null);
  const { session } = useSession();

  return (
    <View>
      <ClockInCard
        fullName={session?.fullName ?? "-"}
        classroom={session?.className ?? "-"}
        grade={session?.grade ?? "-"}
        profilePicUri={session?.profilePictUri}
      />

      <CurrentLocationMap onLocationUpdate={setCurrentLocation} />

      <TouchableOpacity style={styles.clockInButton} onPress={() => onSubmit(currentLocation)}>
        <MaterialIcons name="access-time" size={20} color="#000" />
        <Text style={styles.clockInText}>Clock In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  clockInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD800",
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  clockInText: { fontSize: 16, fontWeight: "600", color: "#000", marginLeft: 8 },
});

export default ClockInForm;
