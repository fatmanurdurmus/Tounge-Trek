import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { AchievementBadge } from "@/components/AchievementBadge";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function AchievementsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { achievements } = useAppStore();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ScreenScrollView>
      <View style={[styles.summaryCard, { backgroundColor: theme.backgroundCard }]}>
        <View style={[styles.trophyContainer, { backgroundColor: theme.badgeGold }]}>
          <Feather name="award" size={32} color="#FFFFFF" />
        </View>
        <Spacer height={Spacing.md} />
        <ThemedText type="h2">
          {unlockedCount} / {achievements.length}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {t("achievements.unlocked")}
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.grid}>
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </View>

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  trophyContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
});
