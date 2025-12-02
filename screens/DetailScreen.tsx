import React, { useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, Share, Platform } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ContentCard } from "@/components/ContentCard";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type DetailScreenProps = {
  route: RouteProp<HomeStackParamList, "Detail">;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Detail">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { contentId } = route.params;

  const { getContentById, getRelatedContent } = useContentStore();
  const {
    userProgress,
    toggleBookmark,
    toggleFavorite,
    addToRecentlyViewed,
    recordShare,
    addLanguageExplored,
  } = useAppStore();

  const content = getContentById(contentId);
  const relatedContent = getRelatedContent(contentId).slice(0, 3);

  const isBookmarked = userProgress.bookmarkedIds.includes(contentId);
  const isFavorited = userProgress.favoritedIds.includes(contentId);

  const bookmarkScale = useSharedValue(1);
  const favoriteScale = useSharedValue(1);

  useEffect(() => {
    if (content) {
      addToRecentlyViewed(contentId);
      addLanguageExplored(content.language);
    }
  }, [contentId]);

  const handleSpeak = useCallback(() => {
    if (content) {
      Speech.speak(content.text, {
        language: content.language === "en" ? "en-US" : content.language,
        rate: 0.8,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [content]);

  const handleCopy = useCallback(async () => {
    if (content) {
      await Clipboard.setStringAsync(content.text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [content]);

  const handleBookmark = useCallback(async () => {
    bookmarkScale.value = withSequence(
      withSpring(1.3),
      withSpring(1)
    );
    await toggleBookmark(contentId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [contentId, toggleBookmark]);

  const handleFavorite = useCallback(async () => {
    favoriteScale.value = withSequence(
      withSpring(1.3),
      withSpring(1)
    );
    await toggleFavorite(contentId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [contentId, toggleFavorite]);

  const handleShare = useCallback(async () => {
    if (content) {
      try {
        await Share.share({
          message: `${content.text}\n\n${content.translation ? `${content.translation}\n\n` : ""}${t("app.name")}`,
        });
        await recordShare();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error("Share error:", error);
      }
    }
  }, [content, recordShare, t]);

  const handleRelatedPress = useCallback((relatedId: string) => {
    navigation.push("Detail", { contentId: relatedId });
  }, [navigation]);

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  if (!content) {
    return (
      <ScreenScrollView contentContainerStyle={styles.emptyContainer}>
        <Feather name="alert-circle" size={48} color={theme.textTertiary} />
        <Spacer height={Spacing.md} />
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {t("common.error")}
        </ThemedText>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView>
      <View style={[styles.mainCard, { backgroundColor: theme.backgroundCard }]}>
        <View style={styles.typeRow}>
          <View style={[styles.typeBadge, { backgroundColor: theme.primary }]}>
            <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
              {t(`contentTypes.${content.type}`)}
            </ThemedText>
          </View>
          <View style={styles.statsRow}>
            <Feather name="heart" size={14} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: 4 }}>
              {content.favoritesCount}
            </ThemedText>
          </View>
        </View>

        <Spacer height={Spacing.lg} />

        <ThemedText type="h2">{content.text}</ThemedText>

        {content.translation ? (
          <>
            <Spacer height={Spacing.md} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {content.translation}
            </ThemedText>
          </>
        ) : null}

        <Spacer height={Spacing.xl} />

        <View style={styles.actionsRow}>
          <AnimatedPressable
            onPress={handleFavorite}
            style={[
              styles.actionButton,
              { backgroundColor: theme.backgroundDefault },
              favoriteAnimatedStyle,
            ]}
          >
            <Feather
              name={isFavorited ? "heart" : "heart"}
              size={20}
              color={isFavorited ? theme.error : theme.text}
            />
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleBookmark}
            style={[
              styles.actionButton,
              { backgroundColor: theme.backgroundDefault },
              bookmarkAnimatedStyle,
            ]}
          >
            <Feather
              name={isBookmarked ? "bookmark" : "bookmark"}
              size={20}
              color={isBookmarked ? theme.primary : theme.text}
            />
          </AnimatedPressable>

          <Pressable
            onPress={handleSpeak}
            style={[styles.actionButton, { backgroundColor: theme.backgroundDefault }]}
          >
            <Feather name="volume-2" size={20} color={theme.text} />
          </Pressable>

          <Pressable
            onPress={handleCopy}
            style={[styles.actionButton, { backgroundColor: theme.backgroundDefault }]}
          >
            <Feather name="copy" size={20} color={theme.text} />
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={[styles.actionButton, { backgroundColor: theme.backgroundDefault }]}
          >
            <Feather name="share-2" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>

      {content.meaning ? (
        <>
          <Spacer height={Spacing.xl} />
          <View style={[styles.sectionCard, { backgroundColor: theme.backgroundCard }]}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={18} color={theme.primary} />
              <ThemedText type="h4" style={{ marginLeft: Spacing.sm }}>
                {t("detail.meaning")}
              </ThemedText>
            </View>
            <Spacer height={Spacing.md} />
            <ThemedText type="body">{content.meaning}</ThemedText>
          </View>
        </>
      ) : null}

      {content.culturalContext ? (
        <>
          <Spacer height={Spacing.lg} />
          <View style={[styles.sectionCard, { backgroundColor: theme.backgroundCard }]}>
            <View style={styles.sectionHeader}>
              <Feather name="globe" size={18} color={theme.primary} />
              <ThemedText type="h4" style={{ marginLeft: Spacing.sm }}>
                {t("detail.culturalContext")}
              </ThemedText>
            </View>
            <Spacer height={Spacing.md} />
            <ThemedText type="body">{content.culturalContext}</ThemedText>
          </View>
        </>
      ) : null}

      {content.tags.length > 0 ? (
        <>
          <Spacer height={Spacing.lg} />
          <View style={[styles.sectionCard, { backgroundColor: theme.backgroundCard }]}>
            <View style={styles.sectionHeader}>
              <Feather name="tag" size={18} color={theme.primary} />
              <ThemedText type="h4" style={{ marginLeft: Spacing.sm }}>
                {t("detail.tags")}
              </ThemedText>
            </View>
            <Spacer height={Spacing.md} />
            <View style={styles.tagsContainer}>
              {content.tags.map((tag, index) => (
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
          </View>
        </>
      ) : null}

      {relatedContent.length > 0 ? (
        <>
          <Spacer height={Spacing["2xl"]} />
          <ThemedText type="h4">{t("detail.relatedExpressions")}</ThemedText>
          <Spacer height={Spacing.md} />
          {relatedContent.map((related, index) => (
            <View key={related.id}>
              <ContentCard
                content={related}
                onPress={() => handleRelatedPress(related.id)}
                compact
              />
              {index < relatedContent.length - 1 ? (
                <Spacer height={Spacing.md} />
              ) : null}
            </View>
          ))}
        </>
      ) : null}

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
});
