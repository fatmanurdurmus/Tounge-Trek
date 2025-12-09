import React from "react";
import {
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
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
  // Hem Feather ikon adı (string) hem de require("../...png") kabul edilsin
  icon?: keyof typeof Feather.glyphMap | ImageSourcePropType;
  onPress: () => void;
  isSelected?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryChip({
  type, // şu an kullanılmıyor ama ileride filtre vs. için lazım olabilir
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

  const isFeatherIcon = typeof icon === "string";

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
      {/* ICON */}
      {icon &&
        (isFeatherIcon ? (
          <Feather
            name={icon as keyof typeof Feather.glyphMap}
            size={16}
            color={isSelected ? "#FFFFFF" : theme.text}
          />
        ) : (
          <Image
            source={icon as ImageSourcePropType}
            style={styles.icon}
            resizeMode="contain"
          />
        ))}

      <ThemedText
        type="small"
        style={{
          color: isSelected ? "#FFFFFF" : theme.text,
          marginLeft: icon ? Spacing.xs : 0,
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
  icon: {
    width: 16,
    height: 16,
  },
});
