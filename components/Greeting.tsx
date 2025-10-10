import { getGreetingText } from "@/scripts/utils";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

interface GreetingProps {
  name?: string;
}


const Greeting = ({ name = 'Kid' }: GreetingProps) => {
  const hour = new Date().getHours();
  const greetingText = getGreetingText(hour);
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.greeting}>{t(`greeting.${greetingText}`)}</Text>
      <Text style={styles.greetingName}>{name}</Text>
    </View>
  );
};

export default memo(Greeting);

const styles = StyleSheet.create({
  greeting: { fontSize: 14, color: "#444" },
  greetingName: { fontSize: 16, fontWeight: "600" },
});
