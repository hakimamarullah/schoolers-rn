import TabBarIcon from "@/components/TabBarIcon";
import { useNotifications } from "@/hooks/UseNotification";
import { useSession } from "@/hooks/useSession";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

export default function TabsLayout() {
  const { session, isHostSet } = useSession();
  const { notifications } = useNotifications();
  const { t } = useTranslation();
  
  
  const unreadCount = notifications.filter(notif => !notif.hasRead).length;

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
            title: t("tabItem.Home"),
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
            title: t("tabItem.Schedules"),
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
            title: t("tabItem.Assignments"),
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
            title: t("tabItem.Info"),
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <TabBarIcon
                  name={focused ? "notifications-sharp" : "notifications-outline"}
                  focused={focused}
                />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: t("tabItem.Profile"),
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

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFB800',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});