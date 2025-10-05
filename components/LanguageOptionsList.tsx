import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import LanguageOption from "./LanguageOption";

interface LanguageItem {
  label: string;
  value: string;
}

interface LanguageOptionsListProps {
  languages: LanguageItem[];
  defaultValue?: string;
  onSelect: (value: string) => void;
}

const LanguageOptionsList: React.FC<LanguageOptionsListProps> = ({ 
  languages,
  defaultValue,
  onSelect 
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || languages[0]?.value || '');

  // Update selectedValue when defaultValue changes
  React.useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <LanguageOption
          key={language.value}
          label={language.label}
          value={language.value}
          selectedValue={selectedValue}
          onPress={handleSelect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  },
});

export default LanguageOptionsList;