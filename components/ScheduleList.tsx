import { ScrollView, StyleSheet } from "react-native";
import ScheduleInfoCard from "./ScheduleInfoCard";

interface Schedule {
  id: number;
  title: string;
  room: string;
  teachers: string[];
  datetime: string;
}

interface ScheduleListProps {
  schedules: Schedule[];
}

export function ScheduleList({ schedules }: ScheduleListProps) {
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
          teachers={schedule.teachers}
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
    paddingBottom: 90,
  },
});
