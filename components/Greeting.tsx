import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

interface GreetingProps {
  name?: string;
}

const getGreetingText = (hour: number) => {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
};

const Greeting = ({ name = 'Kid' }: GreetingProps) => {
  const hour = new Date().getHours();
  const greetingText = getGreetingText(hour);

  return (
    <View>
      <Text style={styles.greeting}>{greetingText}</Text>
      <Text style={styles.greetingName}>{name}</Text>
    </View>
  );
};

export default memo(Greeting);

const styles = StyleSheet.create({
  greeting: { fontSize: 14, color: "#444" },
  greetingName: { fontSize: 16, fontWeight: "600" },
});
