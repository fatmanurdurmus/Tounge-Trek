import { useCallback } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/store/useAppStore";

const THEME_STORAGE_KEY = "app_theme_preference";

export function useTheme() {
  const systemColorScheme = useRNColorScheme();
  const userSettings = useAppStore((state) => state.userSettings);
  
  const getEffectiveColorScheme = (): "light" | "dark" => {
    if (userSettings.theme === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return userSettings.theme;
  };

  const colorScheme = getEffectiveColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme];

  const setTheme = useCallback(async (newTheme: "light" | "dark" | "system") => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }, []);

  return {
    theme,
    isDark,
    setTheme,
  };
}
