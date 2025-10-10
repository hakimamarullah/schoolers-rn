import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ClockInForm from "../components/ClockInForm";
import { SessionInfo } from "@/types/classroom.type";
import classroomService from "@/services/classroom.service";
import { useSession } from "@/hooks/useSession";

const ClockInScreen = () => {
  const app = useApp();
  const { session } = useSession();
  const [onGoingSession, setOnGoingSession] = useState<SessionInfo | null>(null);
 


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

  useEffect(() => {
    const fetchSession = async () => {
      const classroomId = session?.classroomId;
      if (classroomId) {
         const response = await classroomService.getClassroomOnGoingSession(classroomId);
         setOnGoingSession(response);
         console.log({response})
      }
      
    }
    fetchSession();
  }, [])

  return (
    <PageLayout title='Check In'>
      <ScrollView style={styles.container}>
        <ClockInForm onSubmit={handleClockIn} />
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
