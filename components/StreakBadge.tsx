import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StreakBadgeProps {
  streak: number;
  xp: number;
}

export function StreakBadge({ streak, xp }: StreakBadgeProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: theme.streakColor }]}>
        <Feather name="zap" size={14} color="#FFFFFF" />
        <ThemedText
          type="small"
          style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: 2 }}
        >
          {streak}
        </ThemedText>
      </View>
      <View style={[styles.badge, { backgroundColor: theme.xpColor }]}>
        <Feather name="star" size={14} color="#FFFFFF" />
        <ThemedText
          type="small"
          style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: 2 }}
        >
          {xp}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
});
