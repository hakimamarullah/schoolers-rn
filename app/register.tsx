import { PageLayout } from "@/components/PageLayout";
import PersonalDataForm from "@/components/PersonalDataForm";
import { useApp } from "@/hooks/useApp";
import React from "react";
import { 
  KeyboardAvoidingView, 
  ScrollView, 
  StyleSheet, 
  Platform 
} from "react-native";

export default function RegisterScreen() {
  const app = useApp();
  
  const handleSubmit = (data: any) => {
    app.showOverlay();
    console.log({data});
    setTimeout(() => app.hideOverlay(), 3000);
  };

  return (
    <PageLayout title="Personal Data">
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PersonalDataForm onSubmit={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});