import React, { useState, forwardRef, useImperativeHandle, memo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

export type AppModalRef = {
  show: (title: string, message: string) => void;
  hide: () => void;
};

const AppModal = forwardRef<AppModalRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Expose functions without causing re-renders in parent
  useImperativeHandle(ref, () => ({
    show: (t, m) => {
      setTitle(t);
      setMessage(m);
      setVisible(true);
    },
    hide: () => setVisible(false),
  }), []);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <Pressable style={styles.button} onPress={() => setVisible(false)}>
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

// `memo` ensures the modal itself doesn’t cause parent to re-render
export default memo(AppModal);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 5,
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
