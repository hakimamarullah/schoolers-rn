import { useState, useEffect } from 'react';
import { enUS, id } from 'date-fns/locale';
import { Locale } from 'date-fns';
import i18n from '@/i18n/i18n';


const locales: Record<string, Locale> = {
  en: enUS,
  id: id,
};

export const useDateLocale = () => {
  const [dateLocale, setDateLocale] = useState<Locale>(enUS);

  useEffect(() => {
    const updateLocale = () => {
      try {
        const currentLanguage = i18n.language ?? 'en';
        const locale = locales[currentLanguage] || enUS;
        setDateLocale(locale);
      } catch (error: any) {
        console.warn('Error setting date locale:', error.message);
        setDateLocale(enUS);
      }
    };

    // Set initial locale
    updateLocale();

    // Listen for language changes
    i18n.on('languageChanged', updateLocale);

    // Cleanup listener
    return () => {
      i18n.off('languageChanged', updateLocale);
    };
  }, []);

  return dateLocale;
};