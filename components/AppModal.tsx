import { useSafeTimeout } from "@/hooks/useSafeTimeout";
import { MaterialIcons } from "@expo/vector-icons";
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

export type AppModalRef = {
  show: (
    title: string,
    message: string,
    onConfirm?: () => void,
    closable?: boolean
  ) => Promise<void>;
  hide: () => Promise<void>;
};

const AppModal = forwardRef<AppModalRef, {}>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const onConfirmRef = useRef<(() => void) | undefined>(undefined);
  const [dismissable, setDismissable] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const { setSafeTimeout } = useSafeTimeout();

  const fadeIn = () =>
    new Promise<void>((resolve) => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => resolve());
    });

  const fadeOut = () =>
    new Promise<void>((resolve) => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => resolve());
    });

  const handleClose = async () => {
    await fadeOut();
    setVisible(false);
    setTitle("");
    setMessage("");
    onConfirmRef.current = undefined;
    setDismissable(true);
  };

  const handleConfirm = async () => {
    const callback = onConfirmRef.current;
    onConfirmRef.current = undefined; 
    await handleClose();
    if (callback) {
      try {
        callback();
      } catch (error) {
        console.error("Error in modal confirm callback:", error);
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      show: async (t, m, callback, closable) => {
        if (visible) {
          await handleClose();
          await new Promise((r) => setSafeTimeout(r, 100));
        }

        setTitle(t);
        setMessage(m);
        onConfirmRef.current = callback;
        setDismissable(closable ?? true);
        setVisible(true);

        // Wait a tick so the Modal mounts before fade-in
        requestAnimationFrame(() => fadeIn());
      },
      hide: handleClose,
    }),
    [visible]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissable ? handleClose : undefined}
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissable ? handleClose : undefined}
        />
        <View style={styles.contentBox}>
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
