import React, { useState, useCallback } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

export default function FeedbackScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [feedbackText]);

  if (isSubmitted) {
    return (
      <ScreenKeyboardAwareScrollView contentContainerStyle={styles.centeredContainer}>
        <View style={[styles.successCard, { backgroundColor: theme.backgroundCard }]}>
          <View style={[styles.successIcon, { backgroundColor: theme.success }]}>
            <Feather name="check" size={32} color="#FFFFFF" />
          </View>
          <Spacer height={Spacing.xl} />
          <ThemedText type="h3" style={{ textAlign: "center" }}>
            {t("feedback.thankYou")}
          </ThemedText>
          <Spacer height={Spacing.sm} />
          <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
            {t("feedback.feedbackReceived")}
          </ThemedText>
        </View>
      </ScreenKeyboardAwareScrollView>
    );
  }

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textSecondary }}>
        {t("feedback.generalFeedback")}
      </ThemedText>

      <Spacer height={Spacing.xl} />

      <View style={[styles.inputContainer, { backgroundColor: theme.backgroundCard }]}>
        <TextInput
          style={[
            styles.textArea,
            { color: theme.text },
          ]}
          placeholder={t("feedback.description")}
          placeholderTextColor={theme.textTertiary}
          value={feedbackText}
          onChangeText={setFeedbackText}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      <Spacer height={Spacing.xl} />

      <Button
        onPress={handleSubmit}
        disabled={!feedbackText.trim() || isSubmitting}
      >
        {isSubmitting ? t("common.loading") : t("feedback.submit")}
      </Button>

      <Spacer height={Spacing["3xl"]} />
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    alignItems: "center",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xl,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  textArea: {
    fontSize: Typography.body.fontSize,
    minHeight: 150,
  },
});
