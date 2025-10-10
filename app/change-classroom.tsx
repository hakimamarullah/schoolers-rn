import ChangeClassroomForm from "@/components/ChangeClassroomForm";
import { PageLayout } from "@/components/PageLayout";
import { Option } from "@/components/SearchableDropdown";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import classroomService from "@/services/classroom.service";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function ChangeClassroomScreen() {
  const [defaultClassroom, setDefaultClassroom] = useState<string>("");
  const [classroomOptions, setClassroomOptions] = useState<Option[]>([]);
  const app = useApp();
  const { session, signOut } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    const loadClassroom = async () => {
      try {
        app.showOverlay("Loading...");
        if (session?.classroomId) {
          setDefaultClassroom(String(session?.classroomId));
        }
      } catch (error: any) {
        app.showModal("Error", "Failed to load classroom", undefined, false);
      } finally {
        app.hideOverlay();
      }
    };

    const fetchClassrooms = async () => {
      try {
        const response = await classroomService.getClassrooms();
        const options: Option[] = response?.map((it) => ({
          label: it.name,
          value: String(it.id),
        }));
        setClassroomOptions(options);
      } catch (error) {
        console.error(error);
        app.showModal(
          "Error",
          "Failed to get classroom info",
          undefined,
          false
        );
      }
    };
    fetchClassrooms();
    loadClassroom();
  }, []);


 
  const handleSubmit = async (value: string) => {
    try {
      await classroomService.changeClassroom(Number(value));
      app.showModal(
        "Success",
        "Classroom updated successfully. You will be signed out now.",
        undefined,
        false
      );
      setTimeout( () => {
        app.hideModal();
        signOut();
      }, 2000);
    } catch (error: any) {
      app.showModal("Error", "Failed to save classroom. Please try again later", undefined, false);
      console.log(error.message);
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
