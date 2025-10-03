import TabBarIcon from '@/components/TabBarIcon';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          animation: "none",
          headerShown: false,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#806B00',
          tabBarStyle: {
            backgroundColor: '#FFD800',
            borderTopWidth: 0,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 }, // centered shadow
            shadowOpacity: 0.15,
            shadowRadius: 12,
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginBottom: insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? "home" : "home-outline"} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="schedules"
          options={{
            title: 'Schedules',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? "calendar" : "calendar-outline"} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="assignments"
          options={{
            title: 'Assignments',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? "book" : "book-outline"} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="info"
          options={{
            title: 'Info',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? "notifications-sharp" : "notifications-outline"} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name={focused ? "person" : "person-outline"} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
