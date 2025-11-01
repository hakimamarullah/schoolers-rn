import { MenuItem } from "@/types/classroom.type";
import { useRouter } from "expo-router";
import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MenuItemIcon from "./MenuItemIcon";

type MenuSectionProps = {
  title: string;
  menuItems: MenuItem[];
};

const MenuSection = ({ title, menuItems }: MenuSectionProps) => {
  const router = useRouter();
  const items = useMemo(
    () =>
      menuItems.map((it) => ({
        ...it,
        onPress: () => {
          if (it.route && it.isEnabled) {
            router.push(it.route);
          }
        },
      })),
    [router, menuItems]
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuGrid}>
        {items.map((item, _) => (
          <MenuItemIcon
            key={item.id}
            iconName={item.iconName as any}
            title={item.title}
            iconColor={item.iconColor}
            showBadge={!!item.badgeText}
            badgeText={item.badgeText}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  );
};

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
    paddingBottom: 6,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
});
