import React, { forwardRef, useImperativeHandle, useState, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface LoadingOverlayRef {
  show: (message?: string) => void;
  hide: () => void;
}

const LoadingOverlay = forwardRef<LoadingOverlayRef, {}>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const opacity = useRef(new Animated.Value(0)).current;

  const fadeIn = () =>
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

  const fadeOut = (onEnd?: () => void) =>
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => onEnd && onEnd());

  useImperativeHandle(ref, () => ({
    show(msg?: string) {
      setMessage(msg || "Loading...");
      setVisible(true);
      requestAnimationFrame(() => fadeIn());
    },
    hide() {
      fadeOut(() => {
        setVisible(false);
        // Reset to default message after hiding
        setMessage("Loading...");
      });
    },
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#FFD800" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </Animated.View>
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
  },
  text: {
    color: "#555",
    fontSize: 14,
    marginTop: 8,
  },
});