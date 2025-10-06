import React, { useState, useCallback, useEffect, memo } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchableDropdown, { Option } from "./SearchableDropdown";
import PasswordInput from "./PasswordInput";
import InputGroup from "./InputGroup";
import ProfilePicker from "./ProfilePicker";
import SubmitButton from "./SubmitButton";
import { RegistrationRequest } from "@/types/auth.type";
import classroomService from "@/services/classroom.service";
import { useApp } from "@/hooks/useApp";
import { initializeApiClient } from "@/config/apiClient.config";

interface PersonalDataFormProps {
  onSubmit: (data: RegistrationRequest) => void;
  fieldErrors: Record<string, string>;
}

function PersonalDataForm({ onSubmit, fieldErrors }: PersonalDataFormProps) {
  const app = useApp();
  const [fullName, setFullName] = useState("");
  const [nisn, setNisn] = useState("");
  const [gender, setGender] = useState("");
  const [classroom, setClassroom] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicUri, setProfilePicUri] = useState<string>("");
  const [classroomOptions, setClassroomOptions] = useState<Option[]>([]);

  const handleSubmit = useCallback(() => {
    onSubmit({
      fullName,
      studentNumber: nisn,
      gender,
      classroomId: classroom,
      email,
      password,
      profilePicture: profilePicUri,
    });
  }, [fullName, nisn, gender, classroom, email, password, profilePicUri, onSubmit]);


  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        await initializeApiClient();
        const response = await classroomService.getClassrooms();
        const options: Option[] = response?.map(it => ({ label: it.name, value: String(it.id) }));
        setClassroomOptions(options);
      } catch (error) {
        console.error(error);
        app.showModal("Error", "Failed to get classroom info", undefined, false);
      }
    };
    fetchClassrooms();
  }, []);

  const isFormValid =
    fullName.trim() !== "" &&
    nisn.trim() !== "" &&
    gender !== "" &&
    classroom !== 0 &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    profilePicUri

  return (
    <View style={styles.container}>
      <ProfilePicker onImagePicked={setProfilePicUri} />

      <InputGroup label="Fullname" required>
        <TextInput
          style={[styles.input, fieldErrors.fullName && styles.inputError]}
          placeholder="e.g Steve Roger"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        {fieldErrors.fullName && <Text style={styles.errorText}>{fieldErrors.fullName}</Text>}
      </InputGroup>

      <InputGroup label="NISN" required>
        <TextInput
          style={[styles.input, fieldErrors.studentNumber && styles.inputError]}
          placeholder="e.g 11335924"
          keyboardType="numeric"
          value={nisn}
          onChangeText={setNisn}
        />
        {fieldErrors.studentNumber && <Text style={styles.errorText}>{fieldErrors.studentNumber}</Text>}
      </InputGroup>

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
        {fieldErrors.gender && <Text style={styles.errorText}>{fieldErrors.gender}</Text>}
      </InputGroup>

      <SearchableDropdown
        label="Classroom"
        options={classroomOptions}
        onSelect={(it) => setClassroom(Number(it))}
      />
      {fieldErrors.classroomId && <Text style={styles.errorText}>{fieldErrors.classroomId}</Text>}

      <InputGroup label="Email" required>
        <TextInput
          style={[styles.input, fieldErrors.email && styles.inputError]}
          placeholder="e.g steve@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}
      </InputGroup>

      <InputGroup label="Password" required>
        <PasswordInput label="" value={password} onChangeText={setPassword} />
        {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
      </InputGroup>

      <SubmitButton label="Submit" onPress={handleSubmit} disabled={!isFormValid} />
    </View>
  );
}

// ✅ Only re-render if fieldErrors or input values change
export default memo(PersonalDataForm);

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: "#FFD800", paddingVertical: 8, fontSize: 16 },
  inputError: { borderBottomColor: "red" },
  errorText: { color: "red", fontSize: 13, marginTop: 2 },
  genderRow: { flexDirection: "row", marginTop: 4 },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: "#000", marginRight: 8 },
  radioSelected: { backgroundColor: "#FFB800" },
  radioText: { fontSize: 14, color: "#333" },
});