import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import ProfileScreen from "@/screens/ProfileScreen";
import AchievementsScreen from "@/screens/AchievementsScreen";
import LeaderboardScreen from "@/screens/LeaderboardScreen";
import FeedbackScreen from "@/screens/FeedbackScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ProfileStackParamList = {
  Profile: undefined;
  Achievements: undefined;
  Leaderboard: undefined;
  Feedback: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: t("profile.title"),
        }}
      />
      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          headerTitle: t("achievements.title"),
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          headerTitle: t("leaderboard.title"),
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          headerTitle: t("feedback.title"),
        }}
      />
    </Stack.Navigator>
  );
}
