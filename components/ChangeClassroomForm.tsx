import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SearchableDropdown, { Option } from "./SearchableDropdown";
import SubmitButton from "./SubmitButton";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        label={t("common.Classroom")}
        placeholder={t("common.Select Classroom")}
        options={options}
        selectedValue={selectedClassroom}
        onSelect={handleClassroomChange}
      />

      <SubmitButton
        label={t("common.Save Changes")}
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