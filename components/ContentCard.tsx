import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { Content } from "@/types/content";

interface ContentCardProps {
  content: Content;
  onPress: () => void;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ContentCard({ content, onPress, compact = false }: ContentCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.card,
        compact && styles.cardCompact,
        { backgroundColor: theme.backgroundCard },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {t(`contentTypes.${content.type}`)}
          </ThemedText>
        </View>
        <View style={styles.statsRow}>
          <Feather name="heart" size={12} color={theme.textTertiary} />
          <ThemedText
            type="caption"
            style={{ color: theme.textTertiary, marginLeft: 2 }}
          >
            {content.favoritesCount}
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText
          type={compact ? "body" : "h4"}
          numberOfLines={compact ? 2 : 3}
          style={{ fontWeight: "600" }}
        >
          {content.text}
        </ThemedText>

        {content.translation && !compact ? (
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
            numberOfLines={2}
          >
            {content.translation}
          </ThemedText>
        ) : null}
      </View>

      {!compact && content.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {content.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: theme.backgroundDefault }]}
            >
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                #{tag}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <Feather name="chevron-right" size={18} color={theme.textTertiary} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  cardCompact: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginBottom: Spacing.sm,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  footer: {
    alignItems: "flex-end",
  },
});
