import React, { useCallback, useState } from "react";
import { View, StyleSheet, Pressable, Switch, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { AchievementBadge } from "@/components/AchievementBadge";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { changeLanguage } from "@/i18n";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Profile">;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { gamificationStats, achievements, userSettings, updateSettings, userProgress } = useAppStore();
  
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  const handleThemeChange = useCallback(async (newTheme: "light" | "dark" | "system") => {
    await updateSettings({ theme: newTheme });
    setTheme(newTheme);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [updateSettings, setTheme]);

  const handleLanguageChange = useCallback(async () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    await changeLanguage(newLang);
    await updateSettings({ appLanguage: newLang });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [i18n.language, updateSettings]);

  const handleNotificationsToggle = useCallback(async (value: boolean) => {
    await updateSettings({ notificationsEnabled: value });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [updateSettings]);

  const handlePickAvatar = useCallback(async () => {
    try {
      setIsChangingAvatar(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateSettings({ avatarUri: result.assets[0].uri });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert(t("errors.loadingFailed"));
    } finally {
      setIsChangingAvatar(false);
    }
  }, [updateSettings, t]);

  const quizAccuracy = gamificationStats.quizTotalCount > 0
    ? Math.round((gamificationStats.quizCorrectCount / gamificationStats.quizTotalCount) * 100)
    : 0;

  return (
    <ScreenScrollView>
      <View style={[styles.profileCard, { backgroundColor: theme.backgroundCard }]}>
        <Pressable
          onPress={handlePickAvatar}
          style={[styles.avatarContainer, { backgroundColor: theme.backgroundSecondary }]}
          disabled={isChangingAvatar}
        >
          <Feather name="user" size={40} color={theme.textSecondary} />
          <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
            <Feather name="edit-2" size={12} color="#FFFFFF" />
          </View>
        </Pressable>
        
        <Spacer height={Spacing.md} />
        
        <ThemedText type="h3">{userSettings.displayName}</ThemedText>
        
        <Spacer height={Spacing.sm} />
        
        <View style={styles.rankRow}>
          <View style={[styles.rankBadge, { backgroundColor: theme.badgeGold }]}>
            <Feather name="award" size={14} color="#FFFFFF" />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {t("profile.rank")} #42
          </ThemedText>
        </View>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText type="h4">{t("profile.statistics")}</ThemedText>
      <Spacer height={Spacing.md} />

      <View style={styles.statsGrid}>
        <StatCard
          icon="book-open"
          value={userProgress.learnedContentIds.length}
          label={t("profile.learned")}
          theme={theme}
        />
        <StatCard
          icon="target"
          value={`${quizAccuracy}%`}
          label={t("profile.quizAccuracy")}
          theme={theme}
        />
        <StatCard
          icon="zap"
          value={gamificationStats.currentStreak}
          label={t("home.streak")}
          theme={theme}
        />
        <StatCard
          icon="star"
          value={gamificationStats.totalPoints}
          label={t("profile.totalPoints")}
          theme={theme}
        />
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("profile.achievements")}</ThemedText>
        <Pressable onPress={() => navigation.navigate("Achievements")}>
          <ThemedText type="small" style={{ color: theme.link }}>
            {t("profile.viewAll")} ({unlockedAchievements.length}/{achievements.length})
          </ThemedText>
        </Pressable>
      </View>
      <Spacer height={Spacing.md} />

      <View style={styles.achievementsRow}>
        {achievements.slice(0, 4).map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            compact
          />
        ))}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText type="h4">{t("profile.settings")}</ThemedText>
      <Spacer height={Spacing.md} />

      <View style={[styles.settingsCard, { backgroundColor: theme.backgroundCard }]}>
        <SettingsItem
          icon="sun"
          label={t("profile.theme")}
          theme={theme}
          rightElement={
            <View style={styles.themeButtons}>
              {(["light", "dark", "system"] as const).map((themeOption) => (
                <Pressable
                  key={themeOption}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor:
                        userSettings.theme === themeOption
                          ? theme.primary
                          : theme.backgroundDefault,
                    },
                  ]}
                  onPress={() => handleThemeChange(themeOption)}
                >
                  <ThemedText
                    type="caption"
                    style={{
                      color: userSettings.theme === themeOption ? "#FFFFFF" : theme.text,
                    }}
                  >
                    {t(`profile.theme${themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}`)}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          }
        />
        
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        
        <SettingsItem
          icon="globe"
          label={t("profile.language")}
          theme={theme}
          rightElement={
            <Pressable
              style={[styles.languageButton, { backgroundColor: theme.backgroundDefault }]}
              onPress={handleLanguageChange}
            >
              <ThemedText type="small">
                {i18n.language === "tr" ? "Türkçe" : "English"}
              </ThemedText>
              <Feather name="chevron-down" size={16} color={theme.text} style={{ marginLeft: 4 }} />
            </Pressable>
          }
        />
        
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        
        <SettingsItem
          icon="bell"
          label={t("profile.notifications")}
          theme={theme}
          rightElement={
            <Switch
              value={userSettings.notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: theme.backgroundDefault, true: theme.primary }}
            />
          }
        />
      </View>

      <Spacer height={Spacing.lg} />

      <View style={[styles.settingsCard, { backgroundColor: theme.backgroundCard }]}>
        <SettingsItem
          icon="award"
          label={t("profile.leaderboard")}
          theme={theme}
          onPress={() => navigation.navigate("Leaderboard")}
        />
        
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        
        <SettingsItem
          icon="message-square"
          label={t("profile.feedback")}
          theme={theme}
          onPress={() => navigation.navigate("Feedback")}
        />
      </View>

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  theme: any;
}

function StatCard({ icon, value, label, theme }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundCard }]}>
      <Feather name={icon as any} size={24} color={theme.primary} />
      <Spacer height={Spacing.sm} />
      <ThemedText type="h3">{value}</ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );
}

interface SettingsItemProps {
  icon: string;
  label: string;
  theme: any;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

function SettingsItem({ icon, label, theme, rightElement, onPress }: SettingsItemProps) {
  const content = (
    <View style={styles.settingsItem}>
      <Feather name={icon as any} size={20} color={theme.text} />
      <ThemedText type="body" style={{ flex: 1, marginLeft: Spacing.md }}>
        {label}
      </ThemedText>
      {rightElement ? (
        rightElement
      ) : (
        <Feather name="chevron-right" size={20} color={theme.textTertiary} />
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  achievementsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.lg,
  },
  themeButtons: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  themeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
});
