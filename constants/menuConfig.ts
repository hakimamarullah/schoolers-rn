import { RelativePathString } from "expo-router";

export type MenuItemConfig = {
  id: string;
  iconName: string;
  title: string;
  iconColor?: string;
  bgColor?: string;
  showBadge?: boolean;
  badgeText?: string;
  route?: RelativePathString; // for navigation
  onPress?: () => void; // for custom actions
  isEnabled?: boolean; // optional: for feature flags
};

export type MenuSectionConfig = {
  id: string;
  title: string;
  items: MenuItemConfig[];
  order?: number; // for section ordering
};

// Define your menus here
export const MAIN_MENU: MenuItemConfig[] = [
  {
    id: "check-in",
    iconName: "time",
    title: "Check In",
    route: "/home/checkin" as RelativePathString,
  }
];