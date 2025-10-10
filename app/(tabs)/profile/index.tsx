import { PageLayout } from "@/components/PageLayout";
import ProfileMenu from "@/components/ProfileMenu";
import ProfilePicture from "@/components/ProfilePicture";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import { handleResponse } from "@/scripts/utils";
import authService from "@/services/auth.service";
import biometricService from "@/services/biometric.service";
import storageService from "@/services/storage.service";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, session } = useSession();
  const app = useApp();
  const [enableBiometric, setEnableBiometric] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    app.showModal(t("common.Logout"), t("common.Sign out now?"), () => signOut());
  };

  const handleRegisterBiometric = async () => {
    try {
      const isRegistered = await authService.isBiometricRegistered();
      if (isRegistered) {
          await authService.enableBiometric();
          setEnableBiometric(true);
          return;
        }

      const response  = await authService.registerBiometric();
      if (handleResponse(response).ok) {
        await authService.enableBiometric();
        setEnableBiometric(true);
        app.showModal("Info", response.message, undefined, false);
        return;
      }
      if (response.code === 400 || response.code === 409) {
        app.showModal("Error", response.message, undefined, false);
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      await storageService.clearBiometricCredentials();
      app.showModal("Error", error.message ?? "Failed to register biometric", undefined, false);
    }
  };

  const handleDisableBiometric = async () => {
    try {
      const authenticated = await biometricService.authenticate("Authenticate to disable biometric");
      if (authenticated) {
        setEnableBiometric(false);
        await authService.disableBiometric();
      }
    } catch (error: any) {
      console.log(error.message)
      app.showModal("Failed", "Failed to disable biometric", undefined, false);
    }
  }
  const handleEnableBiometric = async (status: boolean) => {
    try {
      if (status) {
        app.showModal(
          t("common.Biometric"),
          t("common.Enable biometric authentication?"),
          handleRegisterBiometric,
          true
        );
        return;
      }
    } catch (error: any) {
      app.showModal("Error", error.message ?? "Failed to enable biometric.", undefined, false);
      console.log(error.message)
      return;
    }
    app.showModal("Biometric", "Disable biometric?", handleDisableBiometric);
  };
  useEffect(() => {
    const getBiometricStatus = async () => {
      try {
        const { isEnabled } = await biometricService.getBiometricInfo();
        setEnableBiometric(isEnabled);
      } catch (error) {}
    };
    getBiometricStatus();
  }, []);

  return (
    <PageLayout title="Profile">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.upperContainer}>
          <ProfilePicture uri={session?.profilePictUri} size={90} />
          <Text style={styles.userName}>{session?.fullName}</Text>
        </View>

        <View style={styles.lowerContainer}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.sections.Account")}</Text>
            <View>
              <ProfileMenu
                iconName="person"
                label={t("profile.menuItem.Personal Data")}
                onPress={() => router.push("/personal-data")}
              />
            </View>
          </View>

          {/* Personalization Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.sections.Personalization")}</Text>
            <View>
              <ProfileMenu
                iconName="language"
                label={t("profile.menuItem.Language")}
                onPress={() => router.push("/change-language")}
              />
              <ProfileMenu
                iconName="edit"
                label={t("profile.menuItem.Change Classroom")}
                onPress={() => router.push("/change-classroom")}
                showBorder={true}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.sections.Security")}</Text>
            <View>
              <ProfileMenu
                iconName="fingerprint"
                label={t("profile.menuItem.Biometric")}
                rightComponent={
                  <Switch
                    value={enableBiometric}
                    onValueChange={handleEnableBiometric}
                  />
                }
                showBorder={true}
              />
            </View>
          </View>

          {/* Others Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.sections.Others")}</Text>
            <View>
              <ProfileMenu
                iconName="logout"
                label={t("profile.menuItem.Log Out")}
                onPress={handleLogout}
                showBorder={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperContainer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  lowerContainer: {
    flex: 1,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 16,
    paddingBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
