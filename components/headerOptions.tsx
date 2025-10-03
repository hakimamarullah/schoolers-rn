import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { ReactNode } from "react";
import { View } from "react-native";

export const createHeaderOptions = (
  title: string,
  rightComponents?: ReactNode[]
) =>
  ({
    title,
    headerTintColor: "#000",
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: "600",
    },
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: "#FFD800", // ✅ faster, no flicker
    },
    headerRight: () =>
      rightComponents && rightComponents.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginRight: 12,
          }}
        >
          {rightComponents.map((Comp, idx) => (
            <View key={idx}>{Comp}</View>
          ))}
        </View>
      ) : null,
  }) as ExtendedStackNavigationOptions;
