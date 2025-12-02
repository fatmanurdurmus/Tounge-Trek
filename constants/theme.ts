import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#5A6B5D",
    textTertiary: "#8B9A8E",
    buttonText: "#FFFFFF",
    tabIconDefault: "#8B9A8E",
    tabIconSelected: "#5A6B5D",
    link: "#5A6B5D",
    primary: "#5A6B5D",
    primaryLight: "#8DA18F",
    accent: "#C4B8A5",
    accentLight: "#DDD5C8",
    backgroundRoot: "#F8F6F0",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#8DA18F",
    backgroundTertiary: "#C4B8A5",
    backgroundCard: "#FFFFFF",
    border: "#E5E2DB",
    borderLight: "#F0EDE6",
    success: "#5A6B5D",
    warning: "#D4A574",
    error: "#C75C5C",
    overlay: "rgba(0, 0, 0, 0.4)",
    streakColor: "#D4A574",
    xpColor: "#5A6B5D",
    badgeGold: "#D4A574",
    badgeSilver: "#A8A8A8",
    badgeBronze: "#C08B5C",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#8E92B3",
    textTertiary: "#6B6F8E",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B6F8E",
    tabIconSelected: "#8E92B3",
    link: "#8E92B3",
    primary: "#3D4A7A",
    primaryLight: "#5A6B9E",
    accent: "#8E92B3",
    accentLight: "#A8ABCF",
    backgroundRoot: "#070F2B",
    backgroundDefault: "#1A2454",
    backgroundSecondary: "#2D3A6B",
    backgroundTertiary: "#404D82",
    backgroundCard: "#1A2454",
    border: "#2D3A6B",
    borderLight: "#404D82",
    success: "#5A9E5A",
    warning: "#D4A574",
    error: "#C75C5C",
    overlay: "rgba(0, 0, 0, 0.6)",
    streakColor: "#D4A574",
    xpColor: "#8E92B3",
    badgeGold: "#D4A574",
    badgeSilver: "#A8A8A8",
    badgeBronze: "#C08B5C",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ContentTypes = {
  proverb: { label: "Atasözü", icon: "book-open" },
  idiom: { label: "Deyim", icon: "message-circle" },
  legend: { label: "Efsane", icon: "star" },
  myth: { label: "Mit", icon: "moon" },
  folkStory: { label: "Halk Hikayesi", icon: "book" },
  epic: { label: "Destan", icon: "award" },
  mythologyNote: { label: "Mitoloji Notu", icon: "file-text" },
  regionalTale: { label: "Bölgesel Masal", icon: "map-pin" },
  meme: { label: "Meme", icon: "image" },
  travelPhrase: { label: "Seyahat İfadesi", icon: "globe" },
  dailyExpression: { label: "Günlük İfade", icon: "sun" },
  trending_quote: { label: "Trend Söz", icon: "trending-up" },
} as const;

export const LanguageCodes = {
  tr: { name: "Türkçe", flag: "TR" },
  en: { name: "English", flag: "US" },
  de: { name: "Deutsch", flag: "DE" },
  fr: { name: "Français", flag: "FR" },
  es: { name: "Español", flag: "ES" },
  it: { name: "Italiano", flag: "IT" },
  pt: { name: "Português", flag: "PT" },
  ru: { name: "Русский", flag: "RU" },
  ja: { name: "日本語", flag: "JP" },
  zh: { name: "中文", flag: "CN" },
  ar: { name: "العربية", flag: "SA" },
} as const;
