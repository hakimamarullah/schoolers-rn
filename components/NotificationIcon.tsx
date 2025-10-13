import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface NotificationIconProp {
  hasRead?: boolean;
  size?: number;
}

export default function NotificationIcon({ hasRead, size = 23}: NotificationIconProp) {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications" size={size} color={"#A67C00"} />
      {!hasRead && <View style={styles.badge} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF9E0",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", 
  },
  badge: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF9D00",
    borderWidth: 1,
    borderColor: "#FFF9E0",
  },
});
