import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, DimensionValue } from "react-native";

interface SkeletonFieldProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
}

export const SkeletonField = ({
  width = "100%",
  height = 16,
  borderRadius = 4,
  marginBottom = 0,
}: SkeletonFieldProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          marginBottom,
          opacity,
        },
      ]}
    />
  );
};


const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E0E0E0",
  },
});
