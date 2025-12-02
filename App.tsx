import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { I18nextProvider } from "react-i18next";

import i18n, { loadSavedLanguage } from "@/i18n";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";

export default function App() {
  const initializeApp = useAppStore((state) => state.initialize);
  const initializeContent = useContentStore((state) => state.initialize);
  const recordDailyLogin = useAppStore((state) => state.recordDailyLogin);

  useEffect(() => {
    const init = async () => {
      await loadSavedLanguage();
      await initializeApp();
      await initializeContent();
      await recordDailyLogin();
    };
    init();
  }, []);

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.root}>
            <KeyboardProvider>
              <NavigationContainer>
                <MainTabNavigator />
              </NavigationContainer>
              <StatusBar style="auto" />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
