import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SearchableDropdown, { Option } from "./SearchableDropdown";
import SubmitButton from "./SubmitButton";

interface ChangeClassroomFormProps {
  options: Option[];
  defaultValue?: string;
  onSubmit: (value: string) => void;
}

const ChangeClassroomForm: React.FC<ChangeClassroomFormProps> = ({
  options,
  defaultValue,
  onSubmit,
}) => {
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [initialClassroom, setInitialClassroom] = useState("");

  useEffect(() => {
    if (defaultValue) {
      setSelectedClassroom(defaultValue);
      setInitialClassroom(defaultValue);
    }
  }, [defaultValue]);

  const handleClassroomChange = (value: string) => {
    setSelectedClassroom(value);
  };

  const handleSubmit = () => {
    onSubmit(selectedClassroom);
  };

  const isFormValid = selectedClassroom !== "" && selectedClassroom !== initialClassroom;

  return (
    <View style={styles.container}>
      <SearchableDropdown
        label="Classroom"
        placeholder="Select classroom"
        options={options}
        selectedValue={selectedClassroom}
        onSelect={handleClassroomChange}
      />

      <SubmitButton
        label="Save Changes"
        onPress={handleSubmit}
        disabled={!isFormValid}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  submitButton: {
    marginTop: 30,
  },
});

export default ChangeClassroomForm;