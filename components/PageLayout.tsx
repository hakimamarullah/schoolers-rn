import { useApp } from "@/hooks/useApp";
import { useSession } from "@/hooks/useSession";
import authService from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageLayoutProps {
  title?: string;
  children?: React.ReactNode;
  headerRight?: React.ReactNode | React.ReactNode[];
  containerStyle?: ViewStyle;
  showHeader?: boolean;
}

export function PageLayout({
  title,
  children,
  headerRight,
  containerStyle,
  showHeader = true,
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();
  const app = useApp();
  const { session } = useSession();

  // figure out if we are at the root of a tab stack
  const parent = segments[segments.length - 2];
  const isTabRoot = parent?.startsWith("(");

  const canGoBack = !isTabRoot && router.canGoBack();
  const { t } = useTranslation();

  const rights = Array.isArray(headerRight)
    ? headerRight
    : headerRight
    ? [headerRight]
    : [];

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (session) {
           await authService.validateSession((message) => app.showModal("Info", message, undefined, false));
        }
        
      } catch(error: any) {
        console.log({error: error.message});
      }
    }
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      {/* Yellow background fills whole screen */}
      <View style={styles.headerBackground} />

      <LinearGradient
        colors={["#FFD800", "#FFB800"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      {showHeader && (
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerLeft}>
            {canGoBack && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
            )}
            {title && <Text style={styles.headerTitle}>{t(`tabItem.${title}`)}</Text>}
          </View>

          <View style={styles.headerRight}>
            {rights.map((comp, i) => (
              <View key={i} style={{ marginLeft: i > 0 ? 12 : 0 }}>
                {comp}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* White rounded content */}
      <View style={[styles.pageContainer, containerStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD800", // fallback / behind everything
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFD800",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12, // tighter spacing
    paddingBottom: 12,
    zIndex: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 4, // closer to left
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
});
