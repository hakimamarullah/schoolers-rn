import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import LanguageOptionsList from '@/components/LanguageOptionsList';
import * as SecureStore from 'expo-secure-store';
import { LANGUAGE_KEY } from '@/constants/common';
import { useApp } from '@/hooks/useApp';
import { useRouter } from 'expo-router';



export default function ChangeLanguageScreen() {
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
  const app = useApp();
  const router = useRouter();

  const languages = [
    { label: "Bahasa Indonesia", value: "id" },
    { label: "English", value: "en" },
  ];

  useEffect(() => {
    const loadLanguage = async () => {
    try {
      app.showOverlay("Load Language...")
      const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_KEY);
      if (savedLanguage) {
        setDefaultLanguage(savedLanguage);
      }
    } catch (error: any) {
      app.showModal("Error", 'Failed to load default language', undefined, false);
    } finally {
      app.hideOverlay();
    }
  };
  loadLanguage();
  }, []);

  

  const handleLanguageSelect = async (lang: string) => {
    try {
      await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
      router.back();
    } catch (error) {
      app.showModal("Error", "Failed to change language", undefined, false);
    }
  };

  
  return (
    <PageLayout title='Language'>
      <View style={styles.container}>
        <LanguageOptionsList 
          defaultValue={defaultLanguage} 
          languages={languages} 
          onSelect={handleLanguageSelect}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});