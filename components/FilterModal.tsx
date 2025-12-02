import React from "react";
import { View, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useContentStore } from "@/store/useContentStore";
import { Spacing, BorderRadius, LanguageCodes, ContentTypes } from "@/constants/theme";
import type { LanguageCode, ContentType } from "@/types/content";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FilterModal({ visible, onClose }: FilterModalProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useContentStore();

  const toggleLanguage = (lang: LanguageCode) => {
    const newLanguages = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang];
    setFilters({ languages: newLanguages });
  };

  const toggleType = (type: ContentType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    setFilters({ types: newTypes });
  };

  const languages = Object.keys(LanguageCodes) as LanguageCode[];
  const types = Object.keys(ContentTypes) as ContentType[];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={styles.header}>
          <ThemedText type="h3">{t("explore.filters")}</ThemedText>
          <Pressable onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <ThemedText type="h4">{t("explore.allLanguages")}</ThemedText>
          <Spacer height={Spacing.md} />
          <View style={styles.chipsContainer}>
            {languages.map((lang) => (
              <Pressable
                key={lang}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filters.languages.includes(lang)
                      ? theme.primary
                      : theme.backgroundDefault,
                  },
                ]}
                onPress={() => toggleLanguage(lang)}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: filters.languages.includes(lang) ? "#FFFFFF" : theme.text,
                  }}
                >
                  {LanguageCodes[lang].name}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <Spacer height={Spacing.xl} />

          <ThemedText type="h4">{t("explore.allTypes")}</ThemedText>
          <Spacer height={Spacing.md} />
          <View style={styles.chipsContainer}>
            {types.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filters.types.includes(type)
                      ? theme.primary
                      : theme.backgroundDefault,
                  },
                ]}
                onPress={() => toggleType(type)}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: filters.types.includes(type) ? "#FFFFFF" : theme.text,
                  }}
                >
                  {t(`contentTypes.${type}`)}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <Spacer height={Spacing.xl} />

          <ThemedText type="h4">{t("explore.sortBy")}</ThemedText>
          <Spacer height={Spacing.md} />
          <View style={styles.chipsContainer}>
            {(["alphabetical", "popularity", "dateAdded", "recentlyViewed"] as const).map(
              (sortOption) => (
                <Pressable
                  key={sortOption}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        filters.sortBy === sortOption
                          ? theme.primary
                          : theme.backgroundDefault,
                    },
                  ]}
                  onPress={() => setFilters({ sortBy: sortOption })}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: filters.sortBy === sortOption ? "#FFFFFF" : theme.text,
                    }}
                  >
                    {t(`explore.${sortOption}`)}
                  </ThemedText>
                </Pressable>
              )
            )}
          </View>

          <Spacer height={Spacing["2xl"]} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.resetButton, { borderColor: theme.border }]}
            onPress={resetFilters}
          >
            <ThemedText type="body">{t("common.cancel")}</ThemedText>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Button onPress={onClose}>{t("common.done")}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  resetButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
