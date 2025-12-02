import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import DailyScreen from "@/screens/DailyScreen";
import QuizScreen from "@/screens/QuizScreen";
import DetailScreen from "@/screens/DetailScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type DailyStackParamList = {
  Daily: undefined;
  Quiz: undefined;
  Detail: { contentId: string };
};

const Stack = createNativeStackNavigator<DailyStackParamList>();

export default function DailyStackNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Daily"
        component={DailyScreen}
        options={{
          headerTitle: t("daily.title"),
        }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          headerTitle: t("quiz.title"),
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
