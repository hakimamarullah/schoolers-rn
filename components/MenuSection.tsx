import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MenuItem from "./MenuItem";

type MenuItemData = {
  iconName: string;
  title: string;
  iconColor?: string;
  bgColor?: string;
  showBadge?: boolean;
  badgeText?: string;
  onPress: () => void;
};

type MenuSectionProps = {
  title: string;
  data: MenuItemData[];
};

const MenuSection = ({ title, data }: MenuSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.menuGrid}>
      {data.map((item, idx) => (
        <MenuItem
          key={idx}
          iconName={item.iconName as any}
          title={item.title}
          iconColor={item.iconColor}
          bgColor={item.bgColor}
          showBadge={item.showBadge}
          badgeText={item.badgeText}
          onPress={item.onPress}
        />
      ))}
    </View>
  </View>
);

export default memo(MenuSection);

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 18,
    paddingBottom: 6
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
});
