import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface NotificationIconProp {
  hasRead?: boolean;
}

export default function NotificationIcon({ hasRead }: NotificationIconProp) {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications" size={23} color={"#A67C00"} />
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
    position: "relative", // needed for badge positioning
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
    borderColor: "#FFF9E0", // border matches container
  },
});
