import React from "react";
import { StyleSheet, View, DimensionValue } from "react-native";
import { SkeletonField } from "./SkeletonField";

interface SkeletonInfoBlockProps {
  labelWidth?: DimensionValue;
  valueWidth?: DimensionValue;
  marginBottom?: number;
}

export const SkeletonInfoBlock = ({
  labelWidth = 40,
  valueWidth = "80%",
  marginBottom = 8,
}: SkeletonInfoBlockProps) => (
  <View style={[styles.infoBlock, { marginBottom }]}>
    <SkeletonField width={labelWidth} height={11} marginBottom={4} />
    <SkeletonField width={valueWidth} height={13} />
  </View>
);

const styles = StyleSheet.create({
  infoBlock: {},
});