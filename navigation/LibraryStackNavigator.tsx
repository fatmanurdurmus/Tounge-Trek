import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import LibraryScreen from "@/screens/LibraryScreen";
import DetailScreen from "@/screens/DetailScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type LibraryStackParamList = {
  Library: undefined;
  Detail: { contentId: string };
};

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export default function LibraryStackNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerTitle: t("library.title"),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ headerTitle: "" }}
      />
    </Stack.Navigator>
  );
}
