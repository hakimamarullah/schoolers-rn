// app/_layout.tsx
import { SplashScreenController } from "@/components/SplashScreenController";
import { AppProvider } from "@/hooks/useApp";
import { SessionProvider, useSession } from "@/hooks/useSession";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Root() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <AppProvider>
          <SplashScreenController />
          <RootNavigator />
        </AppProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { session, isHostSet, isLoading } = useSession();

  if (isLoading) return null; // or a SplashScreen component

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        navigationBarHidden: true,
      }}
    >
      {/* ✅ 1. Host not set yet → show setupHost */}
      <Stack.Protected guard={!isHostSet}>
        <Stack.Screen name="setupHost" />
      </Stack.Protected>

      {/* ✅ 2. Host is set but not logged in → show login */}
      <Stack.Protected guard={isHostSet && !session}>
        <Stack.Screen name="login" options={{ navigationBarHidden: false }}/>
        <Stack.Screen name="register" options={{ navigationBarHidden: false }}/>
      </Stack.Protected>

      {/* ✅ 3. Host set & logged in → main app */}
      <Stack.Protected guard={isHostSet && !!session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="home/checkin" />
        <Stack.Screen name="assignments/[id]" />
        <Stack.Screen name="info/[id]" />
      </Stack.Protected>
    </Stack>
  );
}
