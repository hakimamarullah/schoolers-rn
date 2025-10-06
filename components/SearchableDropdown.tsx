import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Option {
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export default function SearchableDropdown({
  label,
  placeholder = "Select option",
  options,
  selectedValue,
  onSelect,
}: SearchableDropdownProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  // Update selected when selectedValue prop changes
  useEffect(() => {
    if (selectedValue) {
      setSelected(selectedValue);
    }
  }, [selectedValue]);

  const selectedLabel =
    options.find((opt) => opt.value === selected)?.label || "";

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    setVisible(false);
    setSearch("");
    setSelected(value);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Dropdown selector */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color="#777"
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={"padding"}
              style={styles.keyboardAvoid}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{label || "Select Option"}</Text>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={search}
                  onChangeText={setSearch}
                />

                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleSelect(item.value)}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No results found</Text>
                  }
                />

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 6, fontSize: 14, color: "#333" },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD800",
    paddingVertical: 8,
  },
  placeholder: { color: "#999", fontSize: 16 },
  value: { color: "#000", fontSize: 16 },
  icon: { marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  keyboardAvoid: { flex: 1, justifyContent: "center" },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#FFD800",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16, color: "#333" },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 14,
  },
  cancelButton: { marginTop: 10, alignSelf: "flex-end" },
  cancelText: { color: "#FFB800", fontWeight: "bold" },
});