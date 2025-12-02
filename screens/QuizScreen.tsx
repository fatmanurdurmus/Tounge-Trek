import React, { useState, useCallback, useMemo } from "react";
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
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { useContentStore } from "@/store/useContentStore";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { DailyStackParamList } from "@/navigation/DailyStackNavigator";

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<DailyStackParamList, "Quiz">;
};

interface QuizQuestion {
  content: any;
  options: string[];
  correctIndex: number;
}

export default function QuizScreen({ navigation }: QuizScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { recordQuizAnswer, completeDailyQuiz, dailyQueue } = useAppStore();
  const { getContentByIds } = useContentStore();

  const dailyContent = getContentByIds(dailyQueue.contentIds);

  const questions: QuizQuestion[] = useMemo(() => {
    return dailyContent.map((content) => {
      const correctAnswer = content.meaning || content.translation || "";
      const wrongAnswers = dailyContent
        .filter((c) => c.id !== content.id)
        .map((c) => c.meaning || c.translation || "")
        .slice(0, 3);

      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correctAnswer);

      return {
        content,
        options,
        correctIndex,
      };
    });
  }, [dailyContent]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  const handleSelectOption = useCallback(async (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    await recordQuizAnswer(isCorrect);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [isAnswered, currentQuestion, recordQuizAnswer]);

  const handleNext = useCallback(async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      await completeDailyQuiz();
      setIsFinished(true);
    }
  }, [currentIndex, questions.length, completeDailyQuiz]);

  const handleFinish = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (isFinished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <ScreenScrollView contentContainerStyle={styles.centeredContainer}>
        <Animated.View entering={FadeIn} style={styles.resultsCard}>
          <View style={[styles.resultIcon, { backgroundColor: theme.success }]}>
            <Feather name="check-circle" size={48} color="#FFFFFF" />
          </View>
          
          <Spacer height={Spacing.xl} />
          
          <ThemedText type="h2">{t("quiz.results")}</ThemedText>
          
          <Spacer height={Spacing.md} />
          
          <ThemedText type="h1" style={{ color: theme.primary }}>
            {accuracy}%
          </ThemedText>
          
          <Spacer height={Spacing.sm} />
          
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {correctCount} / {questions.length} {t("quiz.correct")}
          </ThemedText>
          
          <Spacer height={Spacing["2xl"]} />
          
          <Button onPress={handleFinish}>{t("common.done")}</Button>
        </Animated.View>
      </ScreenScrollView>
    );
  }

  if (!currentQuestion) {
    return (
      <ScreenScrollView contentContainerStyle={styles.centeredContainer}>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {t("common.error")}
        </ThemedText>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView>
      <View style={styles.progressContainer}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {t("quiz.question")} {currentIndex + 1} {t("quiz.of")} {questions.length}
        </ThemedText>
        <View style={[styles.progressBar, { backgroundColor: theme.backgroundDefault }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={[styles.questionCard, { backgroundColor: theme.backgroundCard }]}>
        <ThemedText type="h3" style={{ textAlign: "center" }}>
          {currentQuestion.content.text}
        </ThemedText>
      </View>

      <Spacer height={Spacing.xl} />

      <ThemedText type="body" style={{ color: theme.textSecondary }}>
        {t("detail.meaning")}:
      </ThemedText>

      <Spacer height={Spacing.md} />

      {currentQuestion.options.map((option, index) => {
        let optionStyle = { backgroundColor: theme.backgroundCard };
        let iconName = null;
        let iconColor = theme.text;

        if (isAnswered) {
          if (index === currentQuestion.correctIndex) {
            optionStyle = { backgroundColor: theme.success };
            iconName = "check";
            iconColor = "#FFFFFF";
          } else if (index === selectedOption && selectedOption !== currentQuestion.correctIndex) {
            optionStyle = { backgroundColor: theme.error };
            iconName = "x";
            iconColor = "#FFFFFF";
          }
        }

        return (
          <View key={index}>
            <Pressable
              onPress={() => handleSelectOption(index)}
              style={[styles.optionButton, optionStyle]}
              disabled={isAnswered}
            >
              <ThemedText
                type="body"
                style={{
                  flex: 1,
                  color: isAnswered && (index === currentQuestion.correctIndex || index === selectedOption)
                    ? "#FFFFFF"
                    : theme.text,
                }}
                numberOfLines={3}
              >
                {option}
              </ThemedText>
              {iconName ? (
                <Feather name={iconName as any} size={20} color={iconColor} />
              ) : null}
            </Pressable>
            <Spacer height={Spacing.md} />
          </View>
        );
      })}

      {isAnswered ? (
        <>
          <Spacer height={Spacing.lg} />
          <Button onPress={handleNext}>
            {currentIndex < questions.length - 1 ? t("quiz.next") : t("quiz.finish")}
          </Button>
        </>
      ) : null}

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    gap: Spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  questionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  resultsCard: {
    alignItems: "center",
    padding: Spacing.xl,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
