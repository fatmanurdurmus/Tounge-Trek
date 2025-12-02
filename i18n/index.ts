import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import tr from "./locales/tr";
import en from "./locales/en";

const LANGUAGE_KEY = "app_language";

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "tr",
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error("Error loading saved language:", error);
  }
};

export const changeLanguage = async (lang: "tr" | "en") => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    await i18n.changeLanguage(lang);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

export default i18n;
