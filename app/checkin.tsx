import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import ClockInForm from "../components/ClockInForm";
import { SessionInfo } from "@/types/classroom.type";
import classroomService from "@/services/classroom.service";
import { useSession } from "@/hooks/useSession";
import { useTranslation } from "react-i18next";
import { useDateLocale } from "@/hooks/useDateLocale";
import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import attendanceService from "@/services/attendance.service";
import { handleResponse } from "@/scripts/utils";

const ClockInScreen = () => {
  const app = useApp();
  const { session } = useSession();
  const [onGoingSession, setOnGoingSession] = useState<SessionInfo | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { t } = useTranslation();
  const dateLocale = useDateLocale();
  const [refreshing, setRefreshing] = useState(false);
  const { setSafeTimeout } = useSafeTimeout();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setSafeTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [setSafeTimeout]);

  const submitAttendance = async (data: {
    latitude: number;
    longitude: number;
    address?: string;
    sessionId: number;
  }) => {
    try {
      app.showOverlay("Clocking you in...");

      const response = await attendanceService.clockIn(
        data.sessionId,
        String(data.latitude),
        String(data.longitude)
      );
      if (!handleResponse(response).ok) {
          throw new Error(response.message);
      }
      const currentTime = format(new Date(), "EEEE, dd MMM yyyy HH:mm:ss", {
        locale: dateLocale,
      });

      app.showModal(
        "Info",
        t("checkin.clockInSuccess", {
          address: data?.address ?? "-",
          datetime: response?.data?.clockInTime ?? currentTime,
        }),
        undefined,
        false
      );
    } catch (error: any) {
      app.showModal("Info", error.message, undefined, false);
    } finally {
      app.hideOverlay();
    }
  };

  const handleClockIn = (data: {
    latitude: number;
    longitude: number;
    address?: string;
    sessionId: number;
  }) => {
    if (!data || (!data?.latitude || !data?.longitude)) {
      app.showModal(
        t("checkin.Location not available"),
        t("checkin.Cannot clock in without location"),
        undefined,
        false
      );
      return;
    }

    app.showModal("Clock In", t("checkin.Clock in now?"), () =>
      submitAttendance(data)
    );
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (session?.classroomId) {
          const response = await classroomService.getClassroomOnGoingSession(
            session.classroomId
          );
          const result = handleResponse(response);
          if (result.serverError) {
            throw new Error(t("common.systemUnavailable"))
          } else if (!result.ok) {
            throw new Error(result.message);
          }
          setOnGoingSession(response.data);
        } 
      } catch (error: any) {
        app.showModal(
          "Info",
          error.message ?? t("checkin.Failed to get ongoing session info."),
          undefined,
          false
        );
      }
    };

    fetchSession();
  }, [refreshTrigger, session?.classroomId]);

  return (
    <PageLayout title='Check In'>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ClockInForm sessionData={onGoingSession} onSubmit={handleClockIn} />
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

export default ClockInScreen;
