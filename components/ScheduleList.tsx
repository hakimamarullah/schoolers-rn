import { ScrollView, StyleSheet } from 'react-native';
import { ScheduleCard } from './ScheduleCard';

interface Schedule {
  id: number;
  title: string;
  room: string;
  teachers: string;
  datetime: string;
}

interface ScheduleListProps {
  schedules: Schedule[];
  onSchedulePress?: (scheduleId: number) => void;
}

export function ScheduleList({ schedules, onSchedulePress }: ScheduleListProps) {
  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scheduleList}
      showsVerticalScrollIndicator={false}
    >
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          title={schedule.title}
          room={schedule.room}
          teachers={schedule.teachers}
          datetime={schedule.datetime}
          onPress={() => onSchedulePress?.(schedule.id)}
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