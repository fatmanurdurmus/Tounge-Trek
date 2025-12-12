import React, { useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ContentCard } from "@/components/ContentCard";
import { CategoryChip } from "@/components/CategoryChip";
import { StreakBadge } from "@/components/StreakBadge";
import { SearchBar } from "@/components/SearchBar";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import type { ContentType } from "@/types/content";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Home">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// assets klasöründeki ikonlar (HomeScreen.tsx => screens, assets => proje kökü)
const lightIcons: Record<string, any> = {
  // Atasözü
  proverb: require("../assets/light/Green_Book.png"),
  // Deyim
  idiom: require("../assets/light/greentopic.png"),
  // Mit
  myth: require("../assets/light/greenmoon.png"),
  // Efsane
  legend: require("../assets/light/green_star.png"),
  // Halk Hikayesi
  folkStory: require("../assets/light/Green_Book.png"),
  // Seyahat İfadesi
  travelPhrase: require("../assets/light/greenglobal.png"),
  // Meme
  meme: require("../assets/light/greenmeme.png"),
};

const darkIcons: Record<string, any> = {
  // Atasözü
  proverb: require("../assets/light/whiteatasozu.png"),
  // Deyim
  idiom: require("../assets/light/whitedeyim.png"),
  // Mit
  myth: require("../assets/light/whitemoon.png"),
  // Efsane
  legend: require("../assets/light/whitestar.png"),
  // Halk Hikayesi
  folkStory: require("../assets/light/whitebook.png"),
  // Seyahat İfadesi
  travelPhrase: require("../assets/light/whiteglobal.png"),
  // Meme
  meme: require("../assets/light/whitememe.png"),
};

const getCategoryIconSource = (category: ContentType, isDark: boolean) => {
  const icons = isDark ? darkIcons : lightIcons;
  return icons[category] || icons.proverb;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const gamificationStats = useAppStore((state) => state.gamificationStats);
  const userSettings = useAppStore((state) => state.userSettings);
  const { getTrendingContent, getFeaturedContent, setFilters } =
    useContentStore();

  const trendingContent = getTrendingContent().slice(0, 5);
  const featuredContent = getFeaturedContent();
  const dailyExpression = featuredContent[0];

  const handleContentPress = useCallback(
    (contentId: string) => {
      navigation.navigate("Detail", { contentId });
    },
    [navigation],
  );

  const handleCategoryPress = useCallback(
    (type: ContentType) => {
      setFilters({ types: [type] });
    },
    [setFilters],
  );

  const categoryTypes: ContentType[] = [
    "proverb",
    "idiom",
    "myth",
    "legend",
    "folkStory",
    "travelPhrase",
    "meme",
  ];

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("home.welcome")}, {userSettings.displayName}
          </ThemedText>
          <ThemedText type="h3">{t("app.tagline")}</ThemedText>
        </View>
        <StreakBadge
          streak={gamificationStats.currentStreak}
          xp={gamificationStats.totalPoints}
        />
      </View>

      <Spacer height={Spacing.xl} />

      <SearchBar placeholder={t("home.search")} onPress={() => {}} />

      <Spacer height={Spacing["2xl"]} />

      {dailyExpression ? (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">{t("home.dailyExpression")}</ThemedText>
          </View>
          <Spacer height={Spacing.md} />
          <DailyExpressionCard
            content={dailyExpression}
            onPress={() => handleContentPress(dailyExpression.id)}
            theme={theme}
          />
          <Spacer height={Spacing["2xl"]} />
        </>
      ) : null}

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("home.categories")}</ThemedText>
      </View>
      <Spacer height={Spacing.md} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categoryTypes.map((type) => (
          <CategoryChip
            key={type}
            type={type}
            label={t(`contentTypes.${type}`)}
            icon={getCategoryIconSource(type, isDark)}
            onPress={() => handleCategoryPress(type)}
          />
        ))}
      </ScrollView>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("home.trending")}</ThemedText>
        <Pressable>
          <ThemedText type="small" style={{ color: theme.link }}>
            {t("home.viewAll")}
          </ThemedText>
        </Pressable>
      </View>
      <Spacer height={Spacing.md} />

      {trendingContent.map((content, index) => (
        <View key={content.id}>
          <ContentCard
            content={content}
            onPress={() => handleContentPress(content.id)}
          />
          {index < trendingContent.length - 1 ? (
            <Spacer height={Spacing.md} />
          ) : null}
        </View>
      ))}

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

interface DailyExpressionCardProps {
  content: any;
  onPress: () => void;
  theme: any;
}

function DailyExpressionCard({
  content,
  onPress,
  theme,
}: DailyExpressionCardProps) {
  const scale = useSharedValue(1);
  const { t } = useTranslation();

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
        styles.dailyCard,
        { backgroundColor: theme.primary },
        animatedStyle,
      ]}
    >
      <View style={styles.dailyCardContent}>
        <View style={styles.dailyCardBadge}>
          <Feather name="star" size={14} color="#FFFFFF" />
          <ThemedText
            type="caption"
            style={{ color: "#FFFFFF", marginLeft: 4 }}
          >
            {t("common.featured")}
          </ThemedText>
        </View>
        <Spacer height={Spacing.md} />
        <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
          {content.text}
        </ThemedText>
        <Spacer height={Spacing.sm} />
        <ThemedText type="body" style={{ color: "rgba(255,255,255,0.8)" }}>
          {content.translation}
        </ThemedText>
        <Spacer height={Spacing.lg} />
        <View style={styles.dailyCardFooter}>
          <View style={styles.dailyCardTag}>
            <ThemedText type="caption" style={{ color: "#FFFFFF" }}>
              {t(`contentTypes.${content.type}`)}
            </ThemedText>
          </View>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoriesContainer: {
    paddingRight: Spacing.xl,
    gap: Spacing.sm,
  },
  dailyCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  dailyCardContent: {
    padding: Spacing.xl,
  },
  dailyCardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  dailyCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dailyCardTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
});
