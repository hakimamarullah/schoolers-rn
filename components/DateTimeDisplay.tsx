import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";

const DateTimeDisplay = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <Text style={styles.dateText}>{format(now, "EEEE")}</Text>
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