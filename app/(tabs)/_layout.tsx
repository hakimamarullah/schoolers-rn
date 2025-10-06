import TabBarIcon from "@/components/TabBarIcon";
import { useSession } from "@/hooks/useSession";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const { session, isHostSet } = useSession();
  return (
    <Tabs
      screenOptions={{
        animation: "none",
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#806B00",
        tabBarStyle: {
          backgroundColor: "#FFB800",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Protected guard={isHostSet && !!session}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="schedules"
          options={{
            title: "Schedules",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "calendar" : "calendar-outline"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="assignments"
          options={{
            title: "Assignments",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "book" : "book-outline"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="info"
          options={{
            title: "Info",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "notifications-sharp" : "notifications-outline"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
