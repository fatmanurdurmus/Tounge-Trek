import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { ContentType } from "@/types/content";

interface CategoryChipProps {
  type: ContentType;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  isSelected?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryChip({
  type,
  label,
  icon,
  onPress,
  isSelected = false,
}: CategoryChipProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? theme.primary : theme.backgroundCard,
          borderColor: isSelected ? theme.primary : theme.border,
        },
        animatedStyle,
      ]}
    >
      <Feather
        name={icon}
        size={16}
        color={isSelected ? "#FFFFFF" : theme.text}
      />
      <ThemedText
        type="small"
        style={{
          color: isSelected ? "#FFFFFF" : theme.text,
          marginLeft: Spacing.xs,
        }}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
});
