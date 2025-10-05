import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type AppModalRef = {
  show: (
    title: string,
    message: string,
    onConfirm?: () => void,
    closable?: boolean
  ) => void;
  hide: () => void;
};

const AppModal = forwardRef<AppModalRef, {}>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();
  const [dismissable, setDismissable] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;

  const fadeIn = () =>
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

  const fadeOut = (onEnd?: () => void) =>
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => onEnd && onEnd());

  const handleClose = () => {
    fadeOut(() => {
      setVisible(false);
      setTitle("");
      setMessage("");
      setOnConfirm(undefined);
      setDismissable(true);
    });
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      show: (t, m, callback, closable) => {
        setTitle(t);
        setMessage(m);
        setOnConfirm(() => callback);
        setVisible(true);
        setDismissable(closable ?? true);
        requestAnimationFrame(() => fadeIn());
      },
      hide: handleClose,
    }),
    [opacity]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.contentBox}>
          {/* Close Button */}
          {dismissable && (
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
});

export default memo(AppModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: "85%",
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#002244",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#FFD800",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  buttonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
});
