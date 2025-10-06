import DateTimeDisplay from "@/components/DateTimeDisplay";
import FinishedClassInfo from "@/components/FinishedClassInfo";
import Greeting from "@/components/Greeting";
import LogoutBtn from "@/components/LogoutBtn";
import MenuSection from "@/components/MenuSection";
import { PageLayout } from "@/components/PageLayout";
import ProfilePicture from "@/components/ProfilePicture";
import ScheduleSection from "@/components/ScheduleSection";
import { MAIN_MENU } from "@/constants/menuConfig";
import { useSession } from "@/hooks/useSession";
import sessionService from "@/services/session.service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
  const { signOut, session } = useSession();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const ongoing = [
    {
      subject: "Ilmu Pengetahuan Alam",
      room: "XII IPA-2",
      teachers: ["Kim Ji Won S.pd.", "Song Hye Kyo M.pd."],
      datetime: "Monday, 08.00-09.00",
      attendance: "2/2",
    },
  ];

  const upcoming = Array.from({ length: 6 }).map(() => ({
    subject: "Sejarah Pengetahuan Islam",
    room: "XII IPA-2",
    teachers: ["Kim Ji Won S.pd.", "Song Hye Kyo M.pd."],
    datetime: "Monday, 08.00-09.00",
    attendance: "2/2",
  }));

  const cancelled = [
    {
      subject: "Matematika Dasar",
      room: "XII IPA-2",
      teachers: ["N/A"],
      datetime: "Cancelled",
      attendance: "-",
    },
  ];

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
  }

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
          colors={["#FFD800", "#FFB800"]} // gradient from bright to darker yellow
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
              <FinishedClassInfo finished={1} total={5} />
            </View>
          </View>
        </LinearGradient>
        <MenuSection title="Main Menu" data={mainMenu} />

        <ScheduleSection title="Ongoing" data={ongoing} />
        <ScheduleSection title="Upcoming" data={upcoming} />
        <ScheduleSection title="Cancelled" data={cancelled} />
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
    backgroundColor: "#FFD800", // brand yellow
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden", // ensures check-in wraps properly
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
