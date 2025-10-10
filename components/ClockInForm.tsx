import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ClockInCard from "./ClockInCard";
import CurrentLocationMap from "./CurrentLocationMap";
import { MaterialIcons } from "@expo/vector-icons";
import { useSession } from "@/hooks/useSession";
import { SessionInfo } from "@/types/classroom.type";


export interface ClockInData {
  latitude: number;
  longitude: number;
  address?: string;
  sessionId: number;
}
interface ClockInFormProps {
  onSubmit: (data: ClockInData) => void;
  sessionData?: SessionInfo;
}

const ClockInForm: React.FC<ClockInFormProps> = ({ onSubmit, sessionData }) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  }>();
  const { session } = useSession();

  const handleClockIn = () => {
    if (!currentLocation || !sessionData) return;

    onSubmit({
      ...currentLocation,
      sessionId: sessionData.sessionId,
    });
  };

  return (
    <View>
      <ClockInCard
        sessionData={sessionData}
        fullName={session?.fullName ?? "-"}
        classroom={session?.className ?? "-"}
        grade={session?.grade ?? "-"}
        profilePicUri={session?.profilePictUri}
      />

      <CurrentLocationMap onLocationUpdate={setCurrentLocation} />

      <TouchableOpacity
        disabled={!sessionData || !currentLocation}
        style={[
          styles.clockInButton,
          (!sessionData || !currentLocation) && styles.clockInButtonDisabled,
        ]}
        onPress={handleClockIn}
      >
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
  clockInButtonDisabled: {
    opacity: 0.5,
  },
  clockInText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
});

export default ClockInForm;
