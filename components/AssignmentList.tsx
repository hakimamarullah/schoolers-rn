import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import AssignmentCard from "./AssignmentCard";

export interface Assignment {
  id: number;
  date: string | number;
  month: string;
  year: string | number;
  timeLeft: string;
  title: string;
  description: string;
  isUrgent?: boolean;
}

interface AssignmentListProps {
  assignments: Assignment[];
  onItemPress: (item : Assignment) => void;
}

export default function AssignmentList({ assignments, onItemPress }: AssignmentListProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          date={assignment.date}
          month={assignment.month}
          year={assignment.year}
          timeLeft={assignment.timeLeft}
          title={assignment.title}
          description={assignment.description}
          isUrgent={assignment.isUrgent}
          onPress={() => onItemPress(assignment)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90, // spacing for bottom tab bar or safe area
  },
});
