import React, { useState, useCallback } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { ContentCard } from "@/components/ContentCard";
import { FilterModal } from "@/components/FilterModal";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { useContentStore } from "@/store/useContentStore";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { ExploreStackParamList } from "@/navigation/ExploreStackNavigator";
import type { Content } from "@/types/content";

type ExploreScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, "Explore">;
};

export default function ExploreScreen({ navigation }: ExploreScreenProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  
  const { filteredContent, searchQuery, setSearchQuery, filters } = useContentStore();

  const handleContentPress = useCallback((contentId: string) => {
    navigation.navigate("Detail", { contentId });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: Content }) => (
    <View style={isGridView ? styles.gridItem : styles.listItem}>
      <ContentCard
        content={item}
        onPress={() => handleContentPress(item.id)}
        compact={isGridView}
      />
    </View>
  ), [handleContentPress, isGridView]);

  const ListHeader = (
    <View style={styles.headerContainer}>
      <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault }]}>
        <Feather name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={t("explore.search")}
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      
      <Spacer height={Spacing.md} />
      
      <View style={styles.controlsRow}>
        <Pressable
          style={[styles.filterButton, { backgroundColor: theme.backgroundDefault }]}
          onPress={() => setIsFilterVisible(true)}
        >
          <Feather name="sliders" size={18} color={theme.text} />
          <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
            {t("explore.filters")}
          </ThemedText>
          {(filters.languages.length > 0 || filters.types.length > 0) ? (
            <View style={[styles.filterBadge, { backgroundColor: theme.primary }]}>
              <ThemedText type="caption" style={{ color: "#FFFFFF", fontSize: 10 }}>
                {filters.languages.length + filters.types.length}
              </ThemedText>
            </View>
          ) : null}
        </Pressable>
        
        <View style={styles.viewToggle}>
          <Pressable
            style={[
              styles.viewToggleButton,
              !isGridView && { backgroundColor: theme.backgroundSecondary },
            ]}
            onPress={() => setIsGridView(false)}
          >
            <Feather name="list" size={18} color={theme.text} />
          </Pressable>
          <Pressable
            style={[
              styles.viewToggleButton,
              isGridView && { backgroundColor: theme.backgroundSecondary },
            ]}
            onPress={() => setIsGridView(true)}
          >
            <Feather name="grid" size={18} color={theme.text} />
          </Pressable>
        </View>
      </View>
      
      <Spacer height={Spacing.md} />
      
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {filteredContent.length} {t("explore.noResults").includes("found") ? "results" : "sonuç"}
      </ThemedText>
      
      <Spacer height={Spacing.md} />
    </View>
  );

  const EmptyComponent = (
    <View style={styles.emptyContainer}>
      <Feather name="search" size={48} color={theme.textTertiary} />
      <Spacer height={Spacing.md} />
      <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
        {t("explore.noResults")}
      </ThemedText>
    </View>
  );

  return (
    <>
      <ScreenFlatList
        data={filteredContent}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? "grid" : "list"}
        columnWrapperStyle={isGridView ? styles.gridRow : undefined}
        ItemSeparatorComponent={() => <Spacer height={Spacing.md} />}
      />
      
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: Spacing.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  filterBadge: {
    marginLeft: Spacing.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  viewToggle: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  viewToggleButton: {
    padding: Spacing.sm,
  },
  listItem: {
    width: "100%",
  },
  gridItem: {
    flex: 1,
    maxWidth: "50%",
    paddingHorizontal: Spacing.xs,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
});
