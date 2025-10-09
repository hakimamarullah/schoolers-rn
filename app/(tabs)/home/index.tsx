import DateTimeDisplay from "@/components/DateTimeDisplay";
import FinishedClassInfo from "@/components/FinishedClassInfo";
import Greeting from "@/components/Greeting";
import LogoutBtn from "@/components/LogoutBtn";
import MenuSection from "@/components/MenuSection";
import { PageLayout } from "@/components/PageLayout";
import ProfilePicture from "@/components/ProfilePicture";
import SessionInfoSection from "@/components/ScheduleSection";
import { MAIN_MENU } from "@/constants/menuConfig";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import homepageInfoService from "@/services/homepageInfo.service";
import sessionService from "@/services/session.service";
import { AttendanceStats, SessionInfo } from "@/types/classroom.type";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this
  const { signOut, session } = useSession();
  const [ongoingSessions, setOngoingSessions] = useState<SessionInfo[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionInfo[]>([]);
  const [cancelledSessions, setCancelledSessions] = useState<SessionInfo[]>([]);
  const [sessionStats, setSessionStats] = useState<AttendanceStats | undefined>(undefined);
  const [finishedSession, setFinishedSession] = useState<SessionInfo[]>([]);
  const app = useApp();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1); // Trigger data refetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const mainMenu = useMemo(
    () =>
      MAIN_MENU.map((it) => ({
        ...it,
        onPress: () => {
          if (it.route) {
            router.push(it.route);
          } else {
            it.onPress;
          }
        },
      })),
    [router]
  );

  const handleLogout = () => {
    sessionService.setSignOutCallback(() => {});
    signOut();
  };

  useEffect(() => {
    const fetchHomepageInfo = async () => {
      try {
        const data = await homepageInfoService.getHomepageInfo();
        setSessionStats(data?.attendanceStats);
        setOngoingSessions(data?.ongoingSessions);
        setUpcomingSessions(data?.upcomingSessions);
        setCancelledSessions(data?.cancelledSessions);
        setFinishedSession(data?.finishedSessions);
      } catch (error: any) {
        console.log({ error: error.message });
        app.showModal(
          "Info",
          "Oops can't get sessions info :(",
          undefined,
          false
        );
      }
    };

    fetchHomepageInfo();
  }, [refreshTrigger]); // Changed dependency

  return (
    <PageLayout
      title="Schoolers"
      headerRight={<LogoutBtn handler={handleLogout} />}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Summary Card */}
        <LinearGradient
          colors={["#FFD800", "#FFB800"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.summaryCard}
        >
          <View style={styles.header}>
            <Text style={styles.schoolName}>{session?.schoolName}</Text>
            <Text style={styles.className}>{session?.className}</Text>
          </View>

          {/* Row 2: Greeting + ProfilePic */}
          <View style={styles.rowBetween}>
            <Greeting name={session?.fullName} />
            <ProfilePicture uri={session?.profilePictUri} />
          </View>

          {/* Row 3: Date + FinishedInfo */}
          <View style={styles.rowTight}>
            <View style={styles.bottomInfo}>
              <DateTimeDisplay />
              <FinishedClassInfo 
                finished={sessionStats?.finishedClasses ?? 0} 
                total={sessionStats?.totalClasses ?? 0} 
              />
            </View>
          </View>
        </LinearGradient>
        <MenuSection title="Main Menu" data={mainMenu} />

        <SessionInfoSection title="Ongoing" data={ongoingSessions} />
        <SessionInfoSection title="Upcoming" data={upcomingSessions} />
        <SessionInfoSection title="Cancelled" data={cancelledSessions} />
        <SessionInfoSection title="Finished" data={finishedSession} />
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#FFD800",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
    marginTop: 12,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  className: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rowTight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 1,
    borderColor: "red",
    flex: 1,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
});