import AssignmentList, { Assignment } from "@/components/AssignmentList";
import { PageLayout } from "@/components/PageLayout";
import { RelativePathString, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AssignmentsScreen() {
  const router = useRouter();
  const assignments: Assignment[] = [
    {
      id: 1,
      date: 4,
      month: "Oct",
      year: 2025,
      timeLeft: "2h 4m left",
      title: "Math Homework",
      description:
        "Complete exercises 1–10 on page 42. Complete exercises 1–10 on page 42 Complete exercises 1–10 on page 42 Complete exercises 1–10 on page 42",
      isUrgent: true,
    },
    {
      id: 2,
      date: 5,
      month: "Oct",
      year: 2025,
      timeLeft: "1d left",
      title: "Science Project",
      description: "Prepare slides for the presentation",
      isUrgent: false,
    },
    {
      id: 3,
      date: 6,
      month: "Oct",
      year: 2025,
      timeLeft: "3d left",
      title: "History Essay",
      description: "Write about the Industrial Revolution",
      isUrgent: false,
    },
    {
      id: 4,
      date: 4,
      month: "Oct",
      year: 2025,
      timeLeft: "30m left",
      title: "English Reading",
      description: "Read chapters 5–6 and summarize",
      isUrgent: true,
    },
    {
      id: 5,
      date: 7,
      month: "Oct",
      year: 2025,
      timeLeft: "2d left",
      title: "Art Assignment",
      description: "Sketch your favorite object",
      isUrgent: false,
    },
    {
      id: 6,
      date: 7,
      month: "Oct",
      year: 2025,
      timeLeft: "2d left",
      title: "Art Assignment",
      description: "Sketch your favorite object",
      isUrgent: false,
    },
    {
      id: 7,
      date: 7,
      month: "Oct",
      year: 2025,
      timeLeft: "2d left",
      title: "Art Assignment",
      description: "Sketch your favorite object",
      isUrgent: false,
    },
    {
      id: 8,
      date: 7,
      month: "Oct",
      year: 2025,
      timeLeft: "2d left",
      title: "Art Assignment",
      description: "Sketch your favorite object",
      isUrgent: false,
    },
  ];
  return (
    <PageLayout title="Assignments">
      <View style={styles.container}>
        <AssignmentList assignments={assignments} onItemPress={it => router.push(`/assignments/${it.id}` as RelativePathString)} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
