import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import dayjs from "dayjs";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StreakCalendarProps {
  currentStreak: number;
  lastActiveDate: string;
}

export function StreakCalendar({ currentStreak, lastActiveDate }: StreakCalendarProps) {
  const { theme } = useTheme();

  const activeDates = useMemo(() => {
    const dates: string[] = [];
    const lastActive = dayjs(lastActiveDate);
    
    for (let i = 0; i < currentStreak; i++) {
      dates.push(lastActive.subtract(i, "day").format("YYYY-MM-DD"));
    }
    
    return dates;
  }, [currentStreak, lastActiveDate]);

  const weeks = useMemo(() => {
    const today = dayjs();
    const startOfMonth = today.startOf("month");
    const endOfMonth = today.endOf("month");
    
    const days: dayjs.Dayjs[] = [];
    let current = startOfMonth.startOf("week");
    
    while (current.isBefore(endOfMonth.endOf("week"))) {
      days.push(current);
      current = current.add(1, "day");
    }
    
    const weeksArray: dayjs.Dayjs[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArray.push(days.slice(i, i + 7));
    }
    
    return weeksArray;
  }, []);

  const weekDays = ["P", "S", "Ç", "P", "C", "C", "P"];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>
      <View style={styles.header}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {dayjs().format("MMMM YYYY")}
        </ThemedText>
      </View>

      <View style={styles.weekDays}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.dayCell}>
            <ThemedText type="caption" style={{ color: theme.textTertiary }}>
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((day, dayIndex) => {
            const dateStr = day.format("YYYY-MM-DD");
            const isActive = activeDates.includes(dateStr);
            const isCurrentMonth = day.month() === dayjs().month();
            const isToday = dateStr === dayjs().format("YYYY-MM-DD");

            return (
              <View
                key={dayIndex}
                style={[
                  styles.dayCell,
                  isActive && { backgroundColor: theme.streakColor },
                  isToday && !isActive && { borderWidth: 2, borderColor: theme.primary },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{
                    color: isActive
                      ? "#FFFFFF"
                      : isCurrentMonth
                      ? theme.text
                      : theme.textTertiary,
                    fontWeight: isToday ? "700" : "400",
                  }}
                >
                  {day.date()}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  week: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.xs,
    margin: 2,
  },
});
