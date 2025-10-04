import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  useRef,
} from "react";
import {
  Animated,
  Modal,
  View,
  Text,
  Pressable,
  StatusBar,
  StyleSheet,
} from "react-native";

export type AppModalRef = {
  show: (title: string, message: string) => void;
  hide: () => void;
};

const AppModal = forwardRef<AppModalRef, {}>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
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

  useImperativeHandle(
    ref,
    () => ({
      show: (t, m) => {
        setTitle(t);
        setMessage(m);
        setVisible(true);
        // Start fade in after modal is visible
        requestAnimationFrame(() => fadeIn());
      },
      hide: () => fadeOut(() => {
        setVisible(false);
        setTitle("");
        setMessage("");
      }),
    }),
    [opacity]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => fadeOut(() => setVisible(false))}
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => fadeOut(() => setVisible(false))} />
        <View style={styles.contentBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            style={styles.button}
            onPress={() => fadeOut(() => setVisible(false))}
          >
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