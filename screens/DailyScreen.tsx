import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import dayjs from "dayjs";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { StreakCalendar } from "@/components/StreakCalendar";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { DailyStackParamList } from "@/navigation/DailyStackNavigator";

type DailyScreenProps = {
  navigation: NativeStackNavigationProp<DailyStackParamList, "Daily">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DailyScreen({ navigation }: DailyScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const {
    dailyQueue,
    gamificationStats,
    generateDailyQueue,
    markDailyItemLearned,
  } = useAppStore();
  const { allContent, getContentByIds } = useContentStore();

  useEffect(() => {
    generateDailyQueue(allContent);
  }, [allContent]);

  const dailyContent = getContentByIds(dailyQueue.contentIds);
  const learnedCount = dailyQueue.learnedIds.length;
  const totalCount = dailyQueue.contentIds.length;

  const handleLearn = useCallback(async (contentId: string) => {
    await markDailyItemLearned(contentId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [markDailyItemLearned]);

  const handleStartQuiz = useCallback(() => {
    navigation.navigate("Quiz");
  }, [navigation]);

  const handleContentPress = useCallback((contentId: string) => {
    navigation.navigate("Detail", { contentId });
  }, [navigation]);

  return (
    <ScreenScrollView>
      <View style={[styles.streakCard, { backgroundColor: theme.backgroundCard }]}>
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <View style={[styles.streakIcon, { backgroundColor: theme.streakColor }]}>
              <Feather name="zap" size={24} color="#FFFFFF" />
            </View>
            <Spacer height={Spacing.sm} />
            <ThemedText type="h2">{gamificationStats.currentStreak}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {t("daily.currentStreak")}
            </ThemedText>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.streakItem}>
            <View style={[styles.streakIcon, { backgroundColor: theme.xpColor }]}>
              <Feather name="star" size={24} color="#FFFFFF" />
            </View>
            <Spacer height={Spacing.sm} />
            <ThemedText type="h2">{gamificationStats.totalPoints}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {t("daily.xpEarned")}
            </ThemedText>
          </View>
        </View>
        
        <Spacer height={Spacing.xl} />
        
        <View style={styles.progressRow}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {t("daily.learnedToday")}
          </ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {learnedCount} / {totalCount}
          </ThemedText>
        </View>
        <Spacer height={Spacing.sm} />
        <View style={[styles.progressBar, { backgroundColor: theme.backgroundDefault }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.primary,
                width: `${(learnedCount / Math.max(totalCount, 1)) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("daily.todaysFive")}</ThemedText>
      </View>
      <Spacer height={Spacing.md} />

      {dailyContent.map((content, index) => {
        const isLearned = dailyQueue.learnedIds.includes(content.id);
        return (
          <View key={content.id}>
            <DailyContentCard
              content={content}
              index={index + 1}
              isLearned={isLearned}
              onPress={() => handleContentPress(content.id)}
              onLearn={() => handleLearn(content.id)}
              theme={theme}
              t={t}
            />
            {index < dailyContent.length - 1 ? (
              <Spacer height={Spacing.md} />
            ) : null}
          </View>
        );
      })}

      <Spacer height={Spacing["2xl"]} />

      <Button onPress={handleStartQuiz}>
        {t("daily.startQuiz")}
      </Button>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("daily.streakCalendar")}</ThemedText>
      </View>
      <Spacer height={Spacing.md} />

      <StreakCalendar
        currentStreak={gamificationStats.currentStreak}
        lastActiveDate={gamificationStats.lastActiveDate}
      />

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

interface DailyContentCardProps {
  content: any;
  index: number;
  isLearned: boolean;
  onPress: () => void;
  onLearn: () => void;
  theme: any;
  t: any;
}

function DailyContentCard({
  content,
  index,
  isLearned,
  onPress,
  onLearn,
  theme,
  t,
}: DailyContentCardProps) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isLearned ? 1 : 0);

  useEffect(() => {
    if (isLearned) {
      checkScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
    }
  }, [isLearned]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.dailyCard,
        { backgroundColor: theme.backgroundCard },
        isLearned && { borderColor: theme.success, borderWidth: 2 },
        animatedStyle,
      ]}
    >
      <View style={styles.dailyCardContent}>
        <View style={[styles.indexBadge, { backgroundColor: theme.primary }]}>
          <ThemedText type="small" style={{ color: "#FFFFFF", fontWeight: "600" }}>
            {index}
          </ThemedText>
        </View>
        
        <View style={styles.dailyCardText}>
          <ThemedText type="body" style={{ fontWeight: "600" }} numberOfLines={2}>
            {content.text}
          </ThemedText>
          <Spacer height={Spacing.xs} />
          <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
            {content.translation}
          </ThemedText>
        </View>
        
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            if (!isLearned) onLearn();
          }}
          style={[
            styles.learnButton,
            {
              backgroundColor: isLearned ? theme.success : theme.backgroundDefault,
            },
          ]}
        >
          <Animated.View style={checkAnimatedStyle}>
            <Feather
              name={isLearned ? "check" : "plus"}
              size={20}
              color={isLearned ? "#FFFFFF" : theme.primary}
            />
          </Animated.View>
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  streakItem: {
    alignItems: "center",
    flex: 1,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 80,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dailyCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  dailyCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dailyCardText: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  learnButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
