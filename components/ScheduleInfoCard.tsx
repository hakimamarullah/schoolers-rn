import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

type ClassCardProps = {
  subject?: string;
  room?: string;
  teacher?: string;
  datetime?: string;
  attendance?: string;
};

const ScheduleInfoCard = ({
  subject = "N/A",
  room = "N/A",
  teacher = "N/A",
  datetime = "N/A",
  attendance,
}: ClassCardProps) => (
  <View style={styles.outerCard}>
    {/* Subject Title */}
    <Text style={styles.subject}>{subject}</Text>

    {/* Inner Info Container */}
    <View style={styles.infoContainer}>
      {/* Left Side */}
      <View style={styles.leftInfo}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Room</Text>
          <Text style={styles.value}>{room}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Datetime</Text>
          <Text style={[styles.value, styles.datetime]}>{datetime}</Text>
        </View>
        {attendance && (
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Attendance</Text>
            <Text style={styles.value}>{attendance}</Text>
          </View>
        )}
      </View>

      {/* Right Side: Teachers stacked */}
      <View style={styles.rightInfo}>
        <Text style={styles.label}>Teachers</Text>
        <Text style={styles.value}>{teacher}</Text>
      </View>
    </View>
  </View>
);

export default memo(ScheduleInfoCard);

const styles = StyleSheet.create({
  outerCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  subject: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#222",
    textTransform: "capitalize"
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFBE6",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFD800",
  },
  leftInfo: {
    flex: 1, // balanced to give adequate space for datetime
    paddingRight: 4,
  },
  rightInfo: {
    flex: 1, // increased to give more space for teachers
    justifyContent: "flex-start",
  },
  infoBlock: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 13,
    fontWeight: "500",
    color: "#222",
    marginTop: 2,
  },
  datetime: {
    textTransform: "capitalize"
  }
});