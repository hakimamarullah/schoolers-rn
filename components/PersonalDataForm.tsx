import React, { useState, useCallback } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchableDropdown, { Option } from "./SearchableDropdown";
import PasswordInput from "./PasswordInput";
import InputGroup from "./InputGroup";
import ProfilePicker from "./ProfilePicker";
import SubmitButton from "./SubmitButton";

interface PersonalDataFormProps {
  onSubmit: (data: {
    fullName: string;
    nisn: string;
    gender: string;
    classroom: string;
    email: string;
    password: string;
    profilePicUri?: string;
  }) => void;
}

export default function PersonalDataForm({ onSubmit }: PersonalDataFormProps) {
  const [fullName, setFullName] = useState("");
  const [nisn, setNisn] = useState("");
  const [gender, setGender] = useState("");
  const [classroom, setClassroom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);

  const classroomOptions: Option[] = [
    { label: "Class A", value: "A" },
    { label: "Class B", value: "B" },
    { label: "Class C", value: "C" },
    { label: "Class D", value: "D" },
  ];

  const handleSubmit = useCallback(() => {
    onSubmit({
      fullName,
      nisn,
      gender,
      classroom,
      email,
      password,
      profilePicUri: profilePicUri || undefined,
    });
  }, [fullName, nisn, gender, classroom, email, password, profilePicUri, onSubmit]);

  const isFormValid =
    fullName.trim() !== "" &&
    nisn.trim() !== "" &&
    gender !== "" &&
    classroom !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  return (
    <View style={styles.container}>
      {/* Profile Picker */}
      <ProfilePicker onImagePicked={setProfilePicUri} />

      {/* Full Name */}
      <InputGroup label="Fullname" required>
        <TextInput
          style={styles.input}
          placeholder="e.g Steve Roger"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </InputGroup>

      {/* NISN */}
      <InputGroup label="NISN" required>
        <TextInput
          style={styles.input}
          placeholder="e.g 11335924"
          keyboardType="numeric"
          value={nisn}
          onChangeText={setNisn}
        />
      </InputGroup>

      {/* Gender */}
      <InputGroup label="Gender" required>
        <View style={styles.genderRow}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setGender("Female")}>
            <View style={[styles.radioCircle, gender === "Female" && styles.radioSelected]} />
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setGender("Male")}>
            <View style={[styles.radioCircle, gender === "Male" && styles.radioSelected]} />
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>
        </View>
      </InputGroup>

      {/* Classroom */}
      <SearchableDropdown
        label="Classroom"
        options={classroomOptions}
        onSelect={setClassroom}
      />

      {/* Email */}
      <InputGroup label="Email" required>
        <TextInput
          style={styles.input}
          placeholder="e.g steve@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
      </InputGroup>

      {/* Password */}
      <InputGroup label="Password" required>
        <PasswordInput label="" value={password} onChangeText={setPassword} />
      </InputGroup>

      {/* Submit Button */}
      <SubmitButton label="Submit" onPress={handleSubmit} disabled={!isFormValid}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: "#FFD800", paddingVertical: 8, fontSize: 16 },
  genderRow: { flexDirection: "row", marginTop: 4 },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: "#000", marginRight: 8 },
  radioSelected: { backgroundColor: "#FFB800" },
  radioText: { fontSize: 14, color: "#333" },
});
