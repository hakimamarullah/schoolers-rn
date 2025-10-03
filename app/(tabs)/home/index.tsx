import CheckInButton from "@/components/CheckInButton";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import FinishedClassInfo from "@/components/FinishedClassInfo";
import Greeting from "@/components/Greeting";
import LogoutBtn from "@/components/LogoutBtn";
import { PageLayout } from "@/components/PageLayout";
import ProfilePicture from "@/components/ProfilePicture";
import ScheduleSection from "@/components/ScheduleSection";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("Page refreshed");
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

  return (
    <PageLayout
      title="Schoolers"
      headerRight={<LogoutBtn handler={() => console.log("Logout")} />}
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
        <View style={styles.summaryCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.schoolName}>SMAN 1 Jakarta</Text>
            <Text style={styles.className}>XII IPA-2</Text>
          </View>

          {/* Row 2: Greeting + ProfilePic */}
          <View style={styles.rowBetween}>
            <Greeting name="Steve Roger" />
            <ProfilePicture uri="https://avatar.iran.liara.run/public/73" />
          </View>

          {/* Row 3: Date + FinishedInfo */}
          <View style={styles.rowTight}>
            <DateTimeDisplay />
            <FinishedClassInfo finished={1} total={5} />
          </View>

          {/* Check-In component (stays wrapped) */}
          <CheckInButton onPress={() => router.push("/home/checkin")} />
        </View>

        {/* Sections */}
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
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rowTight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8, // reduced spacing
  },
});
