import { useDateLocale } from "@/hooks/useDateLocale";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const DateTimeDisplay = () => {
  const [now, setNow] = useState(new Date());
  const locale = useDateLocale();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [locale]);

  return (
    <View>
      <Text style={styles.dateText}>{format(now, "EEEE", { locale: locale })}</Text>
      <Text style={styles.dateText}>{format(now, "dd/MM/yyyy")}</Text>
      <Text style={styles.timeText}>{format(now, "HH:mm:ss")}</Text>
    </View>
  );
};

export default DateTimeDisplay;

const styles = StyleSheet.create({
  dateText: { fontSize: 12, color: "#333", lineHeight: 16 },
  timeText: { fontSize: 14, fontWeight: "600", lineHeight: 18 },
});