import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Option } from "@/components/SearchableDropdown";
import ChangeClassroomForm from "@/components/ChangeClassroomForm";
import { PageLayout } from "@/components/PageLayout";
import { useApp } from "@/hooks/useApp";
import * as SecureStore from "expo-secure-store";
import { CLASSROOM_KEY } from "@/constants/common";



export default function ChangeClassroomScreen() {
  const [defaultClassroom, setDefaultClassroom] = useState<string>("");
  const app = useApp();

  const classroomOptions: Option[] = [
    { label: "Class A", value: "A" },
    { label: "Class B", value: "B" },
    { label: "Class C", value: "C" },
    { label: "Class D", value: "D" },
  ];

  useEffect(() => {
    const loadClassroom = async () => {
    try {
      app.showOverlay("Loading...");
      const savedClassroom = await SecureStore.getItemAsync(CLASSROOM_KEY);
      if (savedClassroom) {
        setDefaultClassroom(savedClassroom);
      }
    } catch (error: any) {
      app.showModal("Error", "Failed to load classroom", undefined, false);
    } finally {
      app.hideOverlay();
    }
  };
    loadClassroom();
  }, []);

  

  const handleSubmit = async (value: string) => {
    try {
      app.showOverlay("Saving...");
      await SecureStore.setItemAsync(CLASSROOM_KEY, value);
      app.hideOverlay();
      app.showModal("Success", "Classroom updated successfully", undefined, false);
    } catch (error: any) {
      app.hideOverlay();
      app.showModal("Error", "Failed to save classroom", undefined, false);
    }
  };

  return (
    <PageLayout title="Change Classroom">
      <View style={styles.container}>
        <ChangeClassroomForm
          options={classroomOptions}
          defaultValue={defaultClassroom}
          onSubmit={handleSubmit}
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