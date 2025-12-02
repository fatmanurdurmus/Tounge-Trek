import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, SectionList } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ContentCard } from "@/components/ContentCard";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { LibraryStackParamList } from "@/navigation/LibraryStackNavigator";
import type { Content } from "@/types/content";

type LibraryScreenProps = {
  navigation: NativeStackNavigationProp<LibraryStackParamList, "Library">;
};

type SectionType = "bookmarks" | "downloads" | "recentlyViewed";

export default function LibraryScreen({ navigation }: LibraryScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const [activeSection, setActiveSection] = useState<SectionType>("bookmarks");

  const { userProgress, toggleBookmark, removeFromDownloaded } = useAppStore();
  const { getContentByIds } = useContentStore();

  const bookmarkedContent = getContentByIds(userProgress.bookmarkedIds);
  const downloadedContent = getContentByIds(userProgress.downloadedIds);
  const recentlyViewedContent = getContentByIds(userProgress.recentlyViewedIds.slice(0, 20));

  const handleContentPress = useCallback((contentId: string) => {
    navigation.navigate("Detail", { contentId });
  }, [navigation]);

  const handleRemoveBookmark = useCallback(async (contentId: string) => {
    await toggleBookmark(contentId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [toggleBookmark]);

  const handleRemoveDownload = useCallback(async (contentId: string) => {
    await removeFromDownloaded(contentId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [removeFromDownloaded]);

  const sections: { key: SectionType; title: string; icon: string }[] = [
    { key: "bookmarks", title: t("library.bookmarks"), icon: "bookmark" },
    { key: "downloads", title: t("library.downloads"), icon: "download" },
    { key: "recentlyViewed", title: t("library.recentlyViewed"), icon: "clock" },
  ];

  const getActiveContent = (): Content[] => {
    switch (activeSection) {
      case "bookmarks":
        return bookmarkedContent;
      case "downloads":
        return downloadedContent;
      case "recentlyViewed":
        return recentlyViewedContent;
      default:
        return [];
    }
  };

  const getEmptyMessage = (): string => {
    switch (activeSection) {
      case "bookmarks":
        return t("library.noBookmarks");
      case "downloads":
        return t("library.noDownloads");
      case "recentlyViewed":
        return t("library.noRecentlyViewed");
      default:
        return "";
    }
  };

  const activeContent = getActiveContent();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.content, { paddingTop }]}>
        <View style={styles.tabContainer}>
          {sections.map((section) => (
            <Pressable
              key={section.key}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeSection === section.key
                      ? theme.primary
                      : theme.backgroundDefault,
                },
              ]}
              onPress={() => setActiveSection(section.key)}
            >
              <Feather
                name={section.icon as any}
                size={18}
                color={activeSection === section.key ? "#FFFFFF" : theme.text}
              />
              <ThemedText
                type="small"
                style={{
                  color: activeSection === section.key ? "#FFFFFF" : theme.text,
                  marginLeft: Spacing.xs,
                }}
              >
                {section.title}
              </ThemedText>
              {activeSection === section.key && activeContent.length > 0 ? (
                <View style={[styles.countBadge, { backgroundColor: "rgba(255,255,255,0.3)" }]}>
                  <ThemedText type="caption" style={{ color: "#FFFFFF", fontSize: 10 }}>
                    {activeContent.length}
                  </ThemedText>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        <Spacer height={Spacing.xl} />

        {activeContent.length > 0 ? (
          <View style={styles.listContainer}>
            {activeContent.map((content, index) => (
              <View key={content.id}>
                <LibraryContentCard
                  content={content}
                  onPress={() => handleContentPress(content.id)}
                  onRemove={
                    activeSection === "bookmarks"
                      ? () => handleRemoveBookmark(content.id)
                      : activeSection === "downloads"
                      ? () => handleRemoveDownload(content.id)
                      : undefined
                  }
                  showOfflineBadge={activeSection === "downloads"}
                  theme={theme}
                  t={t}
                />
                {index < activeContent.length - 1 ? (
                  <Spacer height={Spacing.md} />
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather
              name={sections.find((s) => s.key === activeSection)?.icon as any}
              size={48}
              color={theme.textTertiary}
            />
            <Spacer height={Spacing.md} />
            <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
              {getEmptyMessage()}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

interface LibraryContentCardProps {
  content: Content;
  onPress: () => void;
  onRemove?: () => void;
  showOfflineBadge?: boolean;
  theme: any;
  t: any;
}

function LibraryContentCard({
  content,
  onPress,
  onRemove,
  showOfflineBadge,
  theme,
  t,
}: LibraryContentCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.libraryCard, { backgroundColor: theme.backgroundCard }]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardText}>
          <ThemedText type="body" style={{ fontWeight: "600" }} numberOfLines={2}>
            {content.text}
          </ThemedText>
          <Spacer height={Spacing.xs} />
          <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
            {content.translation}
          </ThemedText>
          <Spacer height={Spacing.xs} />
          <View style={styles.tagRow}>
            <View style={[styles.typeTag, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                {t(`contentTypes.${content.type}`)}
              </ThemedText>
            </View>
            {showOfflineBadge ? (
              <View style={[styles.offlineBadge, { backgroundColor: theme.success }]}>
                <Feather name="wifi-off" size={10} color="#FFFFFF" />
                <ThemedText type="caption" style={{ color: "#FFFFFF", marginLeft: 2, fontSize: 10 }}>
                  {t("library.offlineBadge")}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>
        
        {onRemove ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={[styles.removeButton, { backgroundColor: theme.backgroundDefault }]}
          >
            <Feather name="x" size={18} color={theme.error} />
          </Pressable>
        ) : (
          <Feather name="chevron-right" size={20} color={theme.textTertiary} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  tabContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  countBadge: {
    marginLeft: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
  },
  libraryCard: {
    borderRadius: BorderRadius.md,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  cardText: {
    flex: 1,
  },
  tagRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  typeTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
