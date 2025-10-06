import { PageLayout } from "@/components/PageLayout";
import ProfileMenu from "@/components/ProfileMenu";
import ProfilePicture from "@/components/ProfilePicture";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import { handleResponse } from "@/scripts/utils";
import authService from "@/services/auth.service";
import biometricService from "@/services/biometric.service";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, session } = useSession();
  const app = useApp();
  const [enableBiometric, setEnableBiometric] = useState(false);

  const handleLogout = () => {
    app.showModal("Logout", "Are you sure want to sign out?", () => signOut());
  };

  const handleRegisterBiometric = async () => {
    try {
      const response  = await authService.registerBiometric();
      if (handleResponse(response).ok) {
        await authService.enableBiometric();
        return;
      }
      if (response.code === 400) {
        app.showModal("Error", response.message, undefined, false);
      } else {
        throw Error(response.message);
      }
    } catch (error: any) {
      app.showModal("Error", error.message, undefined, false);
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
      app.showModal("Failed", "Failed to disable biometric", undefined, false);
    }
  }
  const handleEnableBiometric = async (status: boolean) => {
    try {
      const isRegistered = await authService.isBiometricRegistered();
      if (status) {
        app.showModal(
          "Biometric",
          "Enable biometric authentication ?",
          isRegistered ? undefined : handleRegisterBiometric,
          false
        );
        return;
      }
    } catch (error: any) {
      app.showModal("Error", error.message, undefined, false);
      return;
    }
    app.showModal("Biometric", "Disable biometric ?", handleDisableBiometric);
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
            <Text style={styles.sectionTitle}>Account</Text>
            <View>
              <ProfileMenu
                iconName="person"
                label="Personal Data"
                onPress={() => router.push("/personal-data")}
              />
            </View>
          </View>

          {/* Personalization Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalization</Text>
            <View>
              <ProfileMenu
                iconName="language"
                label="Language"
                onPress={() => router.push("/change-language")}
              />
              <ProfileMenu
                iconName="edit"
                label="Change classroom"
                onPress={() => router.push("/change-classroom")}
                showBorder={true}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View>
              <ProfileMenu
                iconName="fingerprint"
                label="Biometric"
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
            <Text style={styles.sectionTitle}>Others</Text>
            <View>
              <ProfileMenu
                iconName="logout"
                label="Log out"
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
