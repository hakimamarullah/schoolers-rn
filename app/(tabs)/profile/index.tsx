import { PageLayout } from "@/components/PageLayout";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

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
