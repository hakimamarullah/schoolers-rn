import { useEffect, useState, useCallback } from "react";
import { StyleSheet, useWindowDimensions, View, RefreshControl, ScrollView } from "react-native";
import { TabView } from "react-native-tab-view";
import { DaySelector } from "@/components/DaySelector";
import { PageLayout } from "@/components/PageLayout";
import { ScheduleList } from "@/components/ScheduleList";
import { useSession } from "@/hooks/useSession";
import classroomService from "@/services/classroom.service";
import { ClassroomSchedulesInfo } from "@/types/classroom.type";
import { useApp } from "@/hooks/useApp";
import { useTranslation } from "react-i18next";

export default function SchedulesScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { session } = useSession();
  const app = useApp();
  const [data, setData] = useState<ClassroomSchedulesInfo | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const dayShorts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(it => t(`day.${it.toLowerCase()}`))

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await classroomService.getClassroomSchedules(session?.classroomId ?? -1);
      if (response.code !== 200) {
        app.showModal("Error", response.message, undefined, false);
        return;
      }

      setData(response.data);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.classroomId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSchedules();
  }, [fetchSchedules]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    const schedules = data?.schedules[route.key] || [];

    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScheduleList
          schedules={schedules.map((it) => ({
            id: it.id,
            title: it.subjectName?.toLowerCase(),
            room: data?.classroomName,
            teacher: it.teacherName,
            datetime: `${it.displayDay.toLowerCase()}, ${it.startTime} - ${it.endTime}`,
          }))}
          isLoading={isLoading}
        />
      </ScrollView>
    );
  };

  const routes = days.map((day, idx) => ({
    key: day,
    title: dayShorts[idx],
  }));

  return (
    <PageLayout title="Schedules">
      <View style={styles.container}>
        <DaySelector days={dayShorts} activeDay={index} onDayChange={setIndex} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => null}
          swipeEnabled
          lazy
          lazyPreloadDistance={1}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
