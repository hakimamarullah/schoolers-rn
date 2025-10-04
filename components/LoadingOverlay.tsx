import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface LoadingOverlayRef {
  show: (message?: string) => void;
  hide: () => void;
}

const LoadingOverlay = forwardRef<LoadingOverlayRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("Loading...");

  useImperativeHandle(ref, () => ({
    show(msg?: string) {
      if (msg) setMessage(msg);
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#FFD800" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
});

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: "#555",
    fontSize: 14,
    marginTop: 8,
  },
});
