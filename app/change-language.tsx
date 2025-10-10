import LanguageOptionsList from '@/components/LanguageOptionsList';
import { PageLayout } from '@/components/PageLayout';
import { useApp } from '@/hooks/useApp';
import i18n from '@/i18n/i18n';
import storageService from '@/services/storage.service';
import * as Localization from "expo-localization";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';



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
      const savedLanguage = await storageService.getLanguage();
      if (savedLanguage) {
        setDefaultLanguage(savedLanguage);
      } else {
        const language = Localization.getLocales()[0].languageCode ?? "en";
        setDefaultLanguage(language)
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
      await storageService.setLanguage(lang);
      await i18n.changeLanguage(lang);
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