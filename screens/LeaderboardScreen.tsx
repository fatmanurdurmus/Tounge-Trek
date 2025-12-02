import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { Spacing, BorderRadius } from "@/constants/theme";

type TimeFrame = "weekly" | "monthly" | "allTime";

const MOCK_LEADERBOARD = [
  { id: "1", displayName: "Ayse K.", totalPoints: 15420, rank: 1 },
  { id: "2", displayName: "Mehmet A.", totalPoints: 14230, rank: 2 },
  { id: "3", displayName: "Zeynep Y.", totalPoints: 13890, rank: 3 },
  { id: "4", displayName: "Ali B.", totalPoints: 12450, rank: 4 },
  { id: "5", displayName: "Fatma S.", totalPoints: 11200, rank: 5 },
  { id: "6", displayName: "Can D.", totalPoints: 10890, rank: 6 },
  { id: "7", displayName: "Elif G.", totalPoints: 9870, rank: 7 },
  { id: "8", displayName: "Emre T.", totalPoints: 8760, rank: 8 },
  { id: "9", displayName: "Selin M.", totalPoints: 7650, rank: 9 },
  { id: "10", displayName: "Burak N.", totalPoints: 6540, rank: 10 },
];

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { gamificationStats, userSettings } = useAppStore();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("weekly");

  const tabs: { key: TimeFrame; label: string }[] = [
    { key: "weekly", label: t("leaderboard.weekly") },
    { key: "monthly", label: t("leaderboard.monthly") },
    { key: "allTime", label: t("leaderboard.allTime") },
  ];

  return (
    <ScreenScrollView>
      <View style={[styles.userCard, { backgroundColor: theme.primary }]}>
        <View style={styles.userCardContent}>
          <View style={styles.userAvatar}>
            <Feather name="user" size={24} color={theme.primary} />
          </View>
          <View style={styles.userInfo}>
            <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
              {userSettings.displayName}
            </ThemedText>
            <ThemedText type="small" style={{ color: "rgba(255,255,255,0.8)" }}>
              {gamificationStats.totalPoints} {t("leaderboard.points")}
            </ThemedText>
          </View>
          <View style={styles.rankBadge}>
            <ThemedText type="h3" style={{ color: "#FFFFFF" }}>
              #42
            </ThemedText>
          </View>
        </View>
      </View>

      <Spacer height={Spacing.xl} />

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor:
                  timeFrame === tab.key ? theme.primary : theme.backgroundDefault,
              },
            ]}
            onPress={() => setTimeFrame(tab.key)}
          >
            <ThemedText
              type="small"
              style={{
                color: timeFrame === tab.key ? "#FFFFFF" : theme.text,
                fontWeight: "600",
              }}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Spacer height={Spacing.xl} />

      <View style={styles.topThree}>
        {MOCK_LEADERBOARD.slice(0, 3).map((user, index) => (
          <TopThreeCard
            key={user.id}
            user={user}
            position={index + 1}
            theme={theme}
            t={t}
          />
        ))}
      </View>

      <Spacer height={Spacing.xl} />

      {MOCK_LEADERBOARD.slice(3).map((user) => (
        <View key={user.id}>
          <LeaderboardRow user={user} theme={theme} t={t} />
          <Spacer height={Spacing.sm} />
        </View>
      ))}

      <Spacer height={Spacing["3xl"]} />
    </ScreenScrollView>
  );
}

interface TopThreeCardProps {
  user: typeof MOCK_LEADERBOARD[0];
  position: number;
  theme: any;
  t: any;
}

function TopThreeCard({ user, position, theme, t }: TopThreeCardProps) {
  const getBadgeColor = () => {
    switch (position) {
      case 1:
        return theme.badgeGold;
      case 2:
        return theme.badgeSilver;
      case 3:
        return theme.badgeBronze;
      default:
        return theme.textTertiary;
    }
  };

  const getHeight = () => {
    switch (position) {
      case 1:
        return 140;
      case 2:
        return 120;
      case 3:
        return 100;
      default:
        return 100;
    }
  };

  return (
    <View
      style={[
        styles.topThreeCard,
        { backgroundColor: theme.backgroundCard, height: getHeight() },
        position === 1 && styles.topThreeFirst,
      ]}
    >
      <View style={[styles.positionBadge, { backgroundColor: getBadgeColor() }]}>
        <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "700" }}>
          {position}
        </ThemedText>
      </View>
      <Spacer height={Spacing.sm} />
      <ThemedText type="small" style={{ fontWeight: "600" }} numberOfLines={1}>
        {user.displayName}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {user.totalPoints.toLocaleString()}
      </ThemedText>
    </View>
  );
}

interface LeaderboardRowProps {
  user: typeof MOCK_LEADERBOARD[0];
  theme: any;
  t: any;
}

function LeaderboardRow({ user, theme, t }: LeaderboardRowProps) {
  return (
    <View style={[styles.leaderboardRow, { backgroundColor: theme.backgroundCard }]}>
      <View style={styles.rankCircle}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {user.rank}
        </ThemedText>
      </View>
      <View style={[styles.avatarSmall, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="user" size={16} color={theme.textSecondary} />
      </View>
      <ThemedText type="body" style={{ flex: 1, fontWeight: "500" }}>
        {user.displayName}
      </ThemedText>
      <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
        {user.totalPoints.toLocaleString()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  userCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rankBadge: {
    padding: Spacing.md,
  },
  tabContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  topThree: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: Spacing.md,
  },
  topThreeCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  topThreeFirst: {
    marginTop: -20,
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  rankCircle: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Spacing.sm,
  },
});
