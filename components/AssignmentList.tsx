import React from "react";
import { FlatList, FlatListProps, StyleSheet } from "react-native";
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

interface AssignmentListProps extends Partial<FlatListProps<Assignment>> {
  assignments: Assignment[];
  onItemPress: (item: Assignment) => void;
}

export default function AssignmentList({ 
  assignments, 
  onItemPress,
  ...flatListProps 
}: AssignmentListProps) {
  
  const renderItem = ({ item }: { item: Assignment }) => (
    <AssignmentCard
      date={item.date}
      month={item.month}
      year={item.year}
      timeLeft={item.timeLeft}
      title={item.title}
      description={item.description}
      isUrgent={item.isUrgent}
      onPress={() => onItemPress(item)}
    />
  );

  const keyExtractor = (item: Assignment) => item.id.toString();

  const getItemLayout = (_: any, index: number) => ({
    length: 100, 
    offset: 100 * index,
    index,
  });

  return (
    <FlatList
      data={assignments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      initialNumToRender={15}
      windowSize={5}
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 90, // spacing for bottom tab bar or safe area
    flexGrow: 1,
  },
});