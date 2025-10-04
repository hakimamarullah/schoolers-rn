import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface LoginFormProps {
  onSubmit: (password: string) => void;
  onFingerprintPress?: (fingerprint: any) => void;
}

export default function LoginForm({ onSubmit, onFingerprintPress }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* User info */}
      <Text style={styles.name}>STEVE ROGER</Text>
      <Text style={styles.account}>11*****24</Text>

      {/* Password field */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => onSubmit(password)}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Fingerprint Button */}
        <TouchableOpacity
          style={styles.fpButton}
          onPress={() => onFingerprintPress?.("test")}
        >
          <Ionicons name="finger-print-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },
  account: {
    fontSize: 12,
    color: "#555",
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD800",
  },
  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    paddingVertical: 6,
    fontSize: 14,
    paddingRight: 30,
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    bottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#FFD800",
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 12,
    marginRight: 10,
  },
  loginText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
  fpButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFD800",
    alignItems: "center",
    justifyContent: "center",
  },
});
