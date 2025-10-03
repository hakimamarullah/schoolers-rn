import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { DaySelector } from "@/components/DaySelector";
import { PageLayout } from "@/components/PageLayout";
import { ScheduleList } from "@/components/ScheduleList";

export default function SchedulesScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const schedules = [
    {
      id: 1,
      title: "Ilmu Pengetahuan Alam",
      room: "XII IPA-2",
      teachers: "Kim Ji Won S.pd.\nSong Hye Kyo M.pd.",
      datetime: "Monday, 08.00-09.00",
    },
    {
      id: 2,
      title: "Biology",
      room: "XII IPA-2",
      teachers: "Kim Ji Won S.pd.\nSong Hye Kyo M.pd.",
      datetime: "Monday, 08.00-09.00",
    },
    {
      id: 3,
      title: "Sejarah Pengetahuan Islam",
      room: "XII IPA-2",
      teachers: "Kim Ji Won S.pd.\nSong Hye Kyo M.pd.",
      datetime: "Monday, 08.00-09.00",
    },
    {
      id: 4,
      title: "Matematika Dasar",
      room: "XII IPA-2",
      teachers: "Kim Ji Won S.pd.\nSong Hye Kyo M.pd.",
      datetime: "Monday, 08.00-09.00",
    },
  ].map((it) => ({ ...it, teachers: it.teachers.split("\n") }));

  const renderScene = SceneMap({
    0: () => <ScheduleList schedules={schedules} />,
    1: () => <ScheduleList schedules={schedules} />,
    2: () => <ScheduleList schedules={schedules} />,
    3: () => <ScheduleList schedules={schedules} />,
    4: () => <ScheduleList schedules={schedules} />,
    5: () => <ScheduleList schedules={schedules} />,
  });

  const routes = days.map((day, idx) => ({ key: idx.toString(), title: day }));

  return (
    <PageLayout title="Schedules">
      <View style={styles.container}>
        <DaySelector days={days} activeDay={index} onDayChange={setIndex} />

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={() => null}
          swipeEnabled={true}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
