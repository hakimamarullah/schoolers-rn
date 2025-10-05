import React from "react";
import { ScrollView, Alert, StyleSheet } from "react-native";
import ClockInForm from "../components/ClockInForm";
import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { format } from "date-fns";

const ClockInScreen = () => {
  const app = useApp();
  const studentData = {
    fullName: "Steve Rogers",
    classroom: "Class A",
    grade: "10",
    profilePicUri: "https://avatar.iran.liara.run/public/73",
  };


  const submitAttendance = (location : { latitude: number; longitude: number; address?: string}) => {
    app.showOverlay("Clocking you in...")

    const currentTime = format(new Date(), "EEEE, dd MMM yyyy HH:mm:ss");
    setTimeout(() => {
      app.hideOverlay();
      app.showModal(
      "Clocked In",
      `Your attendance has been recorded at address: ${location.address ?? "N/A"} on ${currentTime}`,
      undefined,
      false
    );
    }, 2000);
    
  }
  const handleClockIn = (
    location: { latitude: number; longitude: number, address?: string } | null
  ) => {
    if (!location) {
      app.showModal("Location not available", "Cannot clock in without location", undefined, false);
      return;
    }
    
    app.showModal("Clock In", "Clock in now?", () => submitAttendance(location));
  };

  return (
    <PageLayout title='Check In'>
      <ScrollView style={styles.container}>
        <ClockInForm data={studentData} onSubmit={handleClockIn} />
      </ScrollView>
    </PageLayout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ClockInScreen;
