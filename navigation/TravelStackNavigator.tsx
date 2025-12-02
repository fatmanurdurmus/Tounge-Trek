import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import TravelScreen from "@/screens/TravelScreen";
import DetailScreen from "@/screens/DetailScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type TravelStackParamList = {
  Travel: undefined;
  Detail: { contentId: string };
};

const Stack = createNativeStackNavigator<TravelStackParamList>();

export default function TravelStackNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Travel"
        component={TravelScreen}
        options={{
          headerTitle: t("travel.title"),
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
