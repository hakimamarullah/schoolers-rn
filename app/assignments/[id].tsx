import { PageLayout } from "@/components/PageLayout";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AssignmentDetails() {
 const { id } = useLocalSearchParams();
 
  return (
    <PageLayout title="Assignment Details">
      <View style={styles.container}>
        <Text>{id}</Text>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
