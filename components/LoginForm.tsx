import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PasswordInput from "./PasswordInput";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useSession } from "@/hooks/useSession";
import { censorString } from "@/scripts/utils";
import authService from "@/services/auth.service";
import biometricService from "@/services/biometric.service";
import { useApp } from "@/hooks/useApp";

interface LoginFormProps {
  onSubmit: (password: string) => void;
  onBiometricSuccess?: () => void;
  onBiometricError?: (error: string) => void;
}

export default function LoginForm({ 
  onSubmit, 
  onBiometricSuccess,
  onBiometricError 
}: LoginFormProps) {
  const [password, setPassword] = useState("");
  const { isBiometricSupported, authenticate } = useBiometricAuth();
  const { loginId } = useSession();
  const app = useApp();

  const handleBiometricPress = async () => {
    if (!isBiometricSupported) {
      onBiometricError?.("Biometric authentication is not supported on this device");
      return;
    }

    const { isEnabled }= await biometricService.getBiometricInfo();

    if (!isEnabled) {
      app.showModal("Info", "Biometric login is disabled", undefined, false);
      return;
    }
    const result = await authenticate();
    
    if (result.success) {
      onBiometricSuccess?.();
    } else {
      onBiometricError?.(result.error || "Authentication failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* User info */}
      <Text style={styles.name}>{loginId?.fullName}</Text>
      <Text style={styles.account}>{censorString(loginId?.loginId)}</Text>

      {/* Password field */}
      <PasswordInput 
        label="Password"
        value={password} 
        onChangeText={setPassword}
      />

      <View style={styles.actionRow}>
        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => onSubmit(password)}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Fingerprint Button - Only show if supported */}
        {isBiometricSupported && (
          <TouchableOpacity
            style={styles.fpButton}
            onPress={handleBiometricPress}
          >
            <Ionicons name="finger-print-outline" size={26} color="#000" />
          </TouchableOpacity>
        )}
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
    textTransform: "uppercase"
  },
  account: {
    fontSize: 12,
    color: "#555",
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#FFB800",
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
    backgroundColor: "#FFB800",
    alignItems: "center",
    justifyContent: "center",
  },
});