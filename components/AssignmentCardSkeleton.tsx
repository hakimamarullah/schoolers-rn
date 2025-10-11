import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

export default function AssignmentCardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      {/* Date Box Skeleton */}
      <View style={styles.dateBox}>
        <Animated.View style={[styles.dateSkeleton, { opacity }]} />
        <Animated.View style={[styles.monthSkeleton, { opacity }]} />
        <Animated.View style={[styles.yearSkeleton, { opacity }]} />
      </View>

      {/* Content Skeleton */}
      <View style={styles.content}>
        <Animated.View style={[styles.titleSkeleton, { opacity }]} />
        <Animated.View style={[styles.descriptionSkeleton, { opacity }]} />
        <Animated.View style={[styles.descriptionShortSkeleton, { opacity }]} />
        <Animated.View style={[styles.badgeSkeleton, { opacity }]} />
      </View>

      {/* Right Icon Skeleton */}
      <View style={styles.endPressable}>
        <Animated.View style={[styles.iconSkeleton, { opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 10,
  },
  dateBox: {
    alignItems: "center",
    minWidth: 50,
    justifyContent: "center",
    gap: 4,
  },
  dateSkeleton: {
    width: 36,
    height: 32,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  monthSkeleton: {
    width: 28,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  yearSkeleton: {
    width: 32,
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 8,
    gap: 6,
  },
  titleSkeleton: {
    width: "60%",
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  descriptionSkeleton: {
    width: "90%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  descriptionShortSkeleton: {
    width: "70%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  badgeSkeleton: {
    width: 60,
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 4,
  },
  endPressable: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconSkeleton: {
    width: 24,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
  },
});