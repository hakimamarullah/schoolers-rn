import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { PageLayout } from "@/components/PageLayout";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <PageLayout title='Profile'>
      <Text>Profile Tab</Text>
      <Button
        title="Go to Personal Data"
        onPress={() => router.push("/profile/personal-data")}
      />
    </PageLayout>
  );
}
