import { Stack } from "expo-router";
import { createHeaderOptions } from "@/components/headerOptions";
import LogoutBtn from "@/components/LogoutBtn";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
      />
    </Stack>
  );
}
