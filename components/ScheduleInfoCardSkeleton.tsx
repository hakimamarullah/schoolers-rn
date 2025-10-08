import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { SkeletonField } from "./SkeletonField";
import { SkeletonInfoBlock } from "./ScheduleInfoBlock";


const ScheduleInfoCardSkeleton = () => (
  <View style={styles.outerCard}>
    {/* Subject Title Skeleton */}
    <SkeletonField width="60%" height={18} borderRadius={4} marginBottom={14} />

    {/* Inner Info Container */}
    <View style={styles.infoContainer}>
      {/* Left Side */}
      <View style={styles.leftInfo}>
        <SkeletonInfoBlock labelWidth={35} valueWidth="70%" />
        <SkeletonInfoBlock labelWidth={55} valueWidth="90%" />
      </View>

      {/* Right Side */}
      <View style={styles.rightInfo}>
        <SkeletonInfoBlock labelWidth={50} valueWidth="85%" marginBottom={0} />
      </View>
    </View>
  </View>
);

export default memo(ScheduleInfoCardSkeleton);

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
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  leftInfo: {
    flex: 1.3,
    paddingRight: 4,
  },
  rightInfo: {
    flex: 1.6,
    justifyContent: "flex-start",
  },
});