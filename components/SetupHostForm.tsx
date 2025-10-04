import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SetupHostFormProps {
  onSubmit: (host: string) => void;
  loading?: boolean;
}

export default function SetupHostForm({ onSubmit, loading = false }: SetupHostFormProps) {
  const [host, setHost] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = () => {
    if (loading || host.trim().length === 0) return;
    onSubmit(host.trim());
  };

  const disabled = loading || host.trim().length === 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Setup Host</Text>
      <Text style={styles.subtitle}>
        Please enter your backend host URL to continue
      </Text>

      {/* Host input field */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Host URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://your-server.com"
          value={host}
          onChangeText={setHost}
          autoCapitalize="none"
          keyboardType="url"
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelp(!showHelp)}
          disabled={loading}
        >
          <Ionicons
            name={showHelp ? "help-circle" : "help-circle-outline"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {showHelp && (
        <Text style={styles.helpText}>
          Example: https://api.schoolapp.com or http://192.168.1.10:8080
        </Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          disabled && { opacity: 0.6 },
        ]}
        onPress={handleSubmit}
        disabled={disabled}
      >
        <Text style={styles.submitText}>
          {loading ? "Checking..." : "Save & Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#555",
    marginBottom: 25,
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
  helpButton: {
    position: "absolute",
    right: 0,
    bottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#555",
    backgroundColor: "#FFF8CC",
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#FFB800",
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 12,
  },
  submitText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
});
