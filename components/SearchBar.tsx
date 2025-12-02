import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SearchBarProps {
  placeholder: string;
  onPress: () => void;
}

export function SearchBar({ placeholder, onPress }: SearchBarProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      <Feather name="search" size={20} color={theme.textSecondary} />
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, marginLeft: Spacing.sm, flex: 1 }}
      >
        {placeholder}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.md,
  },
});
