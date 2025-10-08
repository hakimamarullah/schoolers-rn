import { ScrollView, StyleSheet, View, Text } from "react-native";
import ScheduleInfoCard from "./ScheduleInfoCard";
import ScheduleInfoCardSkeleton from "./ScheduleInfoCardSkeleton";
import { Ionicons } from "@expo/vector-icons";

interface Schedule {
  id: number;
  title?: string;
  room?: string;
  teacher?: string;
  datetime?: string;
}

interface ScheduleListProps {
  schedules: Schedule[];
  isLoading?: boolean;
}

export function ScheduleList({
  schedules,
  isLoading = false,
}: ScheduleListProps) {
  // Show skeleton while loading
  if (isLoading) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scheduleList}
        showsVerticalScrollIndicator={false}
      >
        <ScheduleInfoCardSkeleton />
        <ScheduleInfoCardSkeleton />
        <ScheduleInfoCardSkeleton />
      </ScrollView>
    );
  }

  // Show empty state when no schedules
  if (schedules.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        showsVerticalScrollIndicator={false}
      >
        <Ionicons name="calendar-outline" size={64} color="#CCC" />
        <Text style={styles.emptyText}>No Schedule</Text>
        <Text style={styles.emptySubtext}>
          There are no subjects scheduled for this day
        </Text>
      </ScrollView>
    );
  }

  // Show actual schedules
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scheduleList}
      showsVerticalScrollIndicator={false}
    >
      {schedules.map((schedule) => (
        <ScheduleInfoCard
          key={schedule.id}
          subject={schedule.title}
          room={schedule.room}
          teacher={schedule.teacher}
          datetime={schedule.datetime}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scheduleList: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 8,
    textAlign: "center",
  },
});
