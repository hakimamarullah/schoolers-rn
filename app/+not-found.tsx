import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { PageLayout } from "@/components/PageLayout";
import { useSession } from "@/hooks/useSession";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function NotFoundScreen() {
  const { session, isHostSet, loginId } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  const handleRecovery = () => {
    if (!isHostSet) return router.replace("/");
    if (isHostSet && !session && !!loginId) return router.replace("/login");
    if (isHostSet && !loginId && !session) return router.replace("/register");
    if (isHostSet && !!session) return router.replace("/home");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PageLayout title="Oops">
        <View style={styles.container}>
       
          <MaterialIcons
            name="error-outline"
            size={64}
            color="#9e9e9e" 
            style={styles.icon}
          />

          <Text style={styles.title}>{t("common.screenNotFound")}</Text>

          <TouchableOpacity style={styles.link} onPress={handleRecovery}>
            <Text style={styles.linkText}>{t("common.bringMeBack")}</Text>
          </TouchableOpacity>
        </View>
      </PageLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#9e9e9e"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
