import { PageLayout } from "@/components/PageLayout";
import ProfileMenu from "@/components/ProfileMenu";
import ProfilePicture from "@/components/ProfilePicture";
import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";

import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useSession();
  const app = useApp();

  const handleLogout = () => {
      app.showModal("Logout","Are you sure want to sign out?", () => signOut());
  }

  return (
    <PageLayout title='Profile'>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.upperContainer}>
          <ProfilePicture size={90}/>
          <Text style={styles.userName}>John Doe</Text>
        </View>
        
        <View style={styles.lowerContainer}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View>
              <ProfileMenu 
                iconName="person" 
                label="Personal Data" 
                onPress={() => router.push('/personal-data')}
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
                onPress={() => router.push('/change-language')}
              />
              <ProfileMenu 
                iconName="edit" 
                label="Change classroom" 
                onPress={() => router.push('/change-classroom')}
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
  }
});