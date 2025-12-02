import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
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
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useContentStore } from "@/store/useContentStore";
import { useAppStore } from "@/store/useAppStore";
import { Spacing, BorderRadius, LanguageCodes } from "@/constants/theme";
import type { TravelStackParamList } from "@/navigation/TravelStackNavigator";
import type { LanguageCode, TravelCategory, Content } from "@/types/content";

type TravelScreenProps = {
  navigation: NativeStackNavigationProp<TravelStackParamList, "Travel">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TRAVEL_CATEGORIES: { key: TravelCategory; icon: string }[] = [
  { key: "greetings", icon: "smile" },
  { key: "directions", icon: "map" },
  { key: "restaurant", icon: "coffee" },
  { key: "emergencies", icon: "alert-circle" },
  { key: "smallTalk", icon: "message-circle" },
];

export default function TravelScreen({ navigation }: TravelScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory>("greetings");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { getTravelPhrases } = useContentStore();
  const { addToDownloaded, userProgress } = useAppStore();

  const travelPhrases = getTravelPhrases(selectedLanguage).filter(
    (p) => p.travelCategory === selectedCategory
  );

  const handleSpeak = useCallback((text: string, language: LanguageCode) => {
    Speech.speak(text, {
      language: language === "en" ? "en-US" : language,
      rate: 0.8,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleCopy = useCallback(async (text: string, id: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleDownload = useCallback((contentId: string) => {
    addToDownloaded(contentId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [addToDownloaded]);

  const availableLanguages: LanguageCode[] = ["en", "de", "fr", "es", "it"];

  return (
    <ScreenScrollView>
      <ThemedText type="body" style={{ color: theme.textSecondary }}>
        {t("travel.selectCountry")}
      </ThemedText>
      <Spacer height={Spacing.md} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.languageContainer}
      >
        {availableLanguages.map((lang) => (
          <LanguageButton
            key={lang}
            language={lang}
            isSelected={selectedLanguage === lang}
            onPress={() => setSelectedLanguage(lang)}
            theme={theme}
          />
        ))}
      </ScrollView>

      <Spacer height={Spacing["2xl"]} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {TRAVEL_CATEGORIES.map((cat) => (
          <CategoryButton
            key={cat.key}
            category={cat.key}
            icon={cat.icon}
            isSelected={selectedCategory === cat.key}
            onPress={() => setSelectedCategory(cat.key)}
            theme={theme}
            t={t}
          />
        ))}
      </ScrollView>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">
          {t(`travel.${selectedCategory}`)}
        </ThemedText>
        <Pressable
          style={[styles.downloadAllButton, { borderColor: theme.border }]}
          onPress={() => {
            travelPhrases.forEach((p) => handleDownload(p.id));
          }}
        >
          <Feather name="download" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ color: theme.primary, marginLeft: 4 }}>
            {t("travel.downloadPack")}
          </ThemedText>
        </Pressable>
      </View>

      <Spacer height={Spacing.lg} />

      {travelPhrases.length > 0 ? (
        travelPhrases.map((phrase, index) => (
          <View key={phrase.id}>
            <TravelPhraseCard
              phrase={phrase}
              onSpeak={() => handleSpeak(phrase.text, phrase.language)}
              onCopy={() => handleCopy(phrase.text, phrase.id)}
              onDownload={() => handleDownload(phrase.id)}
              isCopied={copiedId === phrase.id}
              isDownloaded={userProgress.downloadedIds.includes(phrase.id)}
              theme={theme}
              t={t}
            />
            {index < travelPhrases.length - 1 ? (
              <Spacer height={Spacing.md} />
            ) : null}
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="globe" size={48} color={theme.textTertiary} />
          <Spacer height={Spacing.md} />
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
            {t("explore.noResults")}
          </ThemedText>
        </View>
      )}

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

interface LanguageButtonProps {
  language: LanguageCode;
  isSelected: boolean;
  onPress: () => void;
  theme: any;
}

function LanguageButton({ language, isSelected, onPress, theme }: LanguageButtonProps) {
  const langInfo = LanguageCodes[language];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.languageButton,
        {
          backgroundColor: isSelected ? theme.primary : theme.backgroundDefault,
          borderColor: isSelected ? theme.primary : theme.border,
        },
        animatedStyle,
      ]}
    >
      <ThemedText
        type="body"
        style={{ color: isSelected ? "#FFFFFF" : theme.text }}
      >
        {langInfo.name}
      </ThemedText>
    </AnimatedPressable>
  );
}

interface CategoryButtonProps {
  category: TravelCategory;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
  theme: any;
  t: any;
}

function CategoryButton({ category, icon, isSelected, onPress, theme, t }: CategoryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryButton,
        {
          backgroundColor: isSelected ? theme.primary : theme.backgroundDefault,
        },
      ]}
    >
      <Feather
        name={icon as any}
        size={18}
        color={isSelected ? "#FFFFFF" : theme.text}
      />
      <ThemedText
        type="small"
        style={{
          color: isSelected ? "#FFFFFF" : theme.text,
          marginLeft: Spacing.xs,
        }}
      >
        {t(`travel.${category}`)}
      </ThemedText>
    </Pressable>
  );
}

interface TravelPhraseCardProps {
  phrase: Content;
  onSpeak: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
  isDownloaded: boolean;
  theme: any;
  t: any;
}

function TravelPhraseCard({
  phrase,
  onSpeak,
  onCopy,
  onDownload,
  isCopied,
  isDownloaded,
  theme,
  t,
}: TravelPhraseCardProps) {
  return (
    <View style={[styles.phraseCard, { backgroundColor: theme.backgroundCard }]}>
      <View style={styles.phraseContent}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {phrase.text}
        </ThemedText>
        <Spacer height={Spacing.xs} />
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {phrase.translation}
        </ThemedText>
      </View>
      
      <View style={styles.phraseActions}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.backgroundDefault }]}
          onPress={onSpeak}
        >
          <Feather name="volume-2" size={18} color={theme.primary} />
        </Pressable>
        
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.backgroundDefault }]}
          onPress={onCopy}
        >
          <Feather
            name={isCopied ? "check" : "copy"}
            size={18}
            color={isCopied ? theme.success : theme.primary}
          />
        </Pressable>
        
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.backgroundDefault }]}
          onPress={onDownload}
        >
          <Feather
            name={isDownloaded ? "check-circle" : "download"}
            size={18}
            color={isDownloaded ? theme.success : theme.primary}
          />
        </Pressable>
      </View>
      
      {isDownloaded ? (
        <View style={[styles.offlineBadge, { backgroundColor: theme.success }]}>
          <ThemedText type="caption" style={{ color: "#FFFFFF", fontSize: 10 }}>
            {t("travel.offlineReady")}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  languageContainer: {
    gap: Spacing.sm,
  },
  languageButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  categoryContainer: {
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downloadAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  phraseCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    position: "relative",
  },
  phraseContent: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  phraseActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  offlineBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
});
