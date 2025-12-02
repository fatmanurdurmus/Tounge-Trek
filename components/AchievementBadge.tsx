import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { Achievement } from "@/types/content";

interface AchievementBadgeProps {
  achievement: Achievement;
  compact?: boolean;
}

const ACHIEVEMENT_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  firstSteps: "flag",
  culturalExplorer: "compass",
  weekWarrior: "calendar",
  monthMaster: "award",
  mythHunter: "book",
  socialButterfly: "share-2",
  travelReady: "globe",
  memeWhisperer: "image",
};

export function AchievementBadge({ achievement, compact = false }: AchievementBadgeProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const icon = ACHIEVEMENT_ICONS[achievement.key] || "star";
  const progress = (achievement.progress / achievement.target) * 100;

  if (compact) {
    return (
      <View
        style={[
          styles.compactContainer,
          { backgroundColor: theme.backgroundCard },
          !achievement.unlocked && styles.locked,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: achievement.unlocked
                ? theme.badgeGold
                : theme.backgroundDefault,
            },
          ]}
        >
          <Feather
            name={icon}
            size={20}
            color={achievement.unlocked ? "#FFFFFF" : theme.textTertiary}
          />
        </View>
        <ThemedText
          type="caption"
          style={{ color: achievement.unlocked ? theme.text : theme.textTertiary }}
          numberOfLines={1}
        >
          {t(`achievements.${achievement.key}`)}
        </ThemedText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundCard },
        !achievement.unlocked && styles.locked,
      ]}
    >
      <View
        style={[
          styles.iconContainerLarge,
          {
            backgroundColor: achievement.unlocked
              ? theme.badgeGold
              : theme.backgroundDefault,
          },
        ]}
      >
        <Feather
          name={icon}
          size={28}
          color={achievement.unlocked ? "#FFFFFF" : theme.textTertiary}
        />
      </View>

      <ThemedText
        type="body"
        style={{
          fontWeight: "600",
          color: achievement.unlocked ? theme.text : theme.textTertiary,
          marginTop: Spacing.sm,
        }}
      >
        {t(`achievements.${achievement.key}`)}
      </ThemedText>

      <ThemedText
        type="caption"
        style={{
          color: theme.textSecondary,
          textAlign: "center",
          marginTop: Spacing.xs,
        }}
      >
        {t(`achievements.${achievement.key}Desc`)}
      </ThemedText>

      {!achievement.unlocked ? (
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { backgroundColor: theme.backgroundDefault }]}
          >
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.primary, width: `${progress}%` },
              ]}
            />
          </View>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {achievement.progress} / {achievement.target}
          </ThemedText>
        </View>
      ) : (
        <View style={[styles.unlockedBadge, { backgroundColor: theme.success }]}>
          <Feather name="check" size={12} color="#FFFFFF" />
          <ThemedText
            type="caption"
            style={{ color: "#FFFFFF", marginLeft: 4 }}
          >
            {t("achievements.unlocked")}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  compactContainer: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  locked: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    width: "100%",
    marginTop: Spacing.md,
    gap: Spacing.xs,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
});
