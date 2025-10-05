import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ClockInCard from "./ClockInCard";
import CurrentLocationMap from "./CurrentLocationMap";
import { MaterialIcons } from "@expo/vector-icons";

interface ClockInFormProps {
  data: {
    fullName: string;
    classroom: string;
    grade?: string;
    profilePicUri?: string;
  };
  onSubmit: (location: { latitude: number; longitude: number, address?: string } | null) => void;
}

const ClockInForm: React.FC<ClockInFormProps> = ({ data, onSubmit }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number, address?: string } | null>(null);

  return (
    <View>
      <ClockInCard
        fullName={data.fullName}
        classroom={data.classroom}
        grade={data.grade}
        profilePicUri={data.profilePicUri}
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
