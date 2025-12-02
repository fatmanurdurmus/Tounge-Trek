import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import ExploreScreen from "@/screens/ExploreScreen";
import DetailScreen from "@/screens/DetailScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ExploreStackParamList = {
  Explore: undefined;
  Detail: { contentId: string };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStackNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerTitle: t("explore.title"),
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
