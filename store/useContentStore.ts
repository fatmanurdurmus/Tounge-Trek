import { create } from "zustand";
import type { Content, FilterOptions, LanguageCode, ContentType } from "@/types/content";
import { fetchAllContent } from "@/lib/supabase-service";
import { SAMPLE_CONTENT } from "@/data/sampleContent";

interface ContentState {
  allContent: Content[];
  filteredContent: Content[];
  searchQuery: string;
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  refreshContent: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  applyFiltersAndSearch: () => void;
  
  getContentById: (id: string) => Content | undefined;
  getContentByIds: (ids: string[]) => Content[];
  getRelatedContent: (contentId: string) => Content[];
  getTrendingContent: () => Content[];
  getFeaturedContent: () => Content[];
  getContentByType: (type: ContentType) => Content[];
  getContentByLanguage: (language: LanguageCode) => Content[];
  getTravelPhrases: (language: LanguageCode) => Content[];
  getDailyExpressions: () => Content[];
}

const DEFAULT_FILTERS: FilterOptions = {
  languages: [],
  types: [],
  regions: [],
  tags: [],
  sortBy: "popularity",
};

export const useContentStore = create<ContentState>((set, get) => ({
  allContent: [],
  filteredContent: [],
  searchQuery: "",
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const content = await fetchAllContent();
      
      if (content.length > 0) {
        set({ 
          allContent: content,
          filteredContent: content,
          isLoading: false,
        });
      } else {
        console.log("No content from Supabase, using sample data");
        set({ 
          allContent: SAMPLE_CONTENT,
          filteredContent: SAMPLE_CONTENT,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error initializing content:", error);
      set({ 
        allContent: SAMPLE_CONTENT,
        filteredContent: SAMPLE_CONTENT,
        isLoading: false,
        error: "Supabase bağlantısı başarısız, yerel veri kullanılıyor",
      });
    }
  },

  refreshContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const content = await fetchAllContent();
      if (content.length > 0) {
        set({ 
          allContent: content,
          isLoading: false,
        });
        get().applyFiltersAndSearch();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error refreshing content:", error);
      set({ 
        isLoading: false,
        error: "İçerik yenilenemedi",
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFiltersAndSearch();
  },

  setFilters: (newFilters: Partial<FilterOptions>) => {
    const { filters } = get();
    set({ filters: { ...filters, ...newFilters } });
    get().applyFiltersAndSearch();
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS, searchQuery: "" });
    get().applyFiltersAndSearch();
  },

  applyFiltersAndSearch: () => {
    const { allContent, searchQuery, filters } = get();
    
    let result = [...allContent];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.text.toLowerCase().includes(query) ||
          (c.translation?.toLowerCase().includes(query)) ||
          (c.meaning?.toLowerCase().includes(query)) ||
          c.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    
    if (filters.languages.length > 0) {
      result = result.filter((c) => filters.languages.includes(c.language));
    }
    
    if (filters.types.length > 0) {
      result = result.filter((c) => filters.types.includes(c.type));
    }
    
    if (filters.regions.length > 0) {
      result = result.filter((c) => c.region && filters.regions.includes(c.region));
    }
    
    if (filters.tags.length > 0) {
      result = result.filter((c) =>
        c.tags.some((t) => filters.tags.includes(t))
      );
    }
    
    switch (filters.sortBy) {
      case "alphabetical":
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "popularity":
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case "dateAdded":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    set({ filteredContent: result });
  },

  getContentById: (id: string) => {
    const { allContent } = get();
    return allContent.find((c) => c.id === id);
  },

  getContentByIds: (ids: string[]) => {
    const { allContent } = get();
    return allContent.filter((c) => ids.includes(c.id));
  },

  getRelatedContent: (contentId: string) => {
    const { allContent } = get();
    const content = allContent.find((c) => c.id === contentId);
    if (!content) return [];
    
    const related = allContent.filter((c) => content.relatedContent.includes(c.id));
    
    if (related.length < 5) {
      const sameTags = allContent.filter(
        (c) =>
          c.id !== contentId &&
          !related.some((r) => r.id === c.id) &&
          c.tags.some((t) => content.tags.includes(t))
      );
      related.push(...sameTags.slice(0, 5 - related.length));
    }
    
    if (related.length < 5) {
      const sameLanguage = allContent.filter(
        (c) =>
          c.id !== contentId &&
          !related.some((r) => r.id === c.id) &&
          c.language === content.language
      );
      related.push(...sameLanguage.slice(0, 5 - related.length));
    }
    
    return related;
  },

  getTrendingContent: () => {
    const { allContent } = get();
    return [...allContent]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
  },

  getFeaturedContent: () => {
    const { allContent } = get();
    return allContent.filter((c) => c.popularity > 80).slice(0, 5);
  },

  getContentByType: (type: ContentType) => {
    const { allContent } = get();
    return allContent.filter((c) => c.type === type);
  },

  getContentByLanguage: (language: LanguageCode) => {
    const { allContent } = get();
    return allContent.filter((c) => c.language === language);
  },

  getTravelPhrases: (language: LanguageCode) => {
    const { allContent } = get();
    return allContent.filter(
      (c) => c.type === "travelPhrase" && c.language === language
    );
  },

  getDailyExpressions: () => {
    const { allContent } = get();
    return allContent.filter(
      (c) => c.type === "dailyExpression" || c.type === "proverb" || c.type === "idiom"
    );
  },
}));
