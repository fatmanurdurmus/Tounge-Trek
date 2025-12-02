export type ContentType =
  | "proverb"
  | "idiom"
  | "legend"
  | "myth"
  | "folkStory"
  | "epic"
  | "mythologyNote"
  | "regionalTale"
  | "meme"
  | "travelPhrase"
  | "dailyExpression"
  | "trending_quote";

export type LanguageCode =
  | "tr"
  | "en"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pt"
  | "ru"
  | "ja"
  | "zh"
  | "ar";

export type TravelCategory =
  | "greetings"
  | "directions"
  | "restaurant"
  | "emergencies"
  | "smallTalk";

export interface Content {
  id: string;
  type: ContentType;
  language: LanguageCode;
  text: string;
  translation?: string;
  meaning?: string;
  culturalContext?: string;
  tags: string[];
  region?: string;
  popularity: number;
  favoritesCount: number;
  commentsCount: number;
  rating: number;
  relatedContent: string[];
  audioUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  isOffline?: boolean;
  travelCategory?: TravelCategory;
}

export interface UserProgress {
  learnedContentIds: string[];
  bookmarkedIds: string[];
  downloadedIds: string[];
  recentlyViewedIds: string[];
  favoritedIds: string[];
}

export interface GamificationStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  quizCorrectCount: number;
  quizTotalCount: number;
  shareCount: number;
  learnedCount: number;
  dailyChallengesCompleted: number;
  languagesExplored: LanguageCode[];
  travelModesCompleted: LanguageCode[];
  memeInteractions: number;
}

export interface Achievement {
  id: string;
  key: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface DailyQueue {
  date: string;
  contentIds: string[];
  learnedIds: string[];
  quizCompleted: boolean;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  appLanguage: "tr" | "en";
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  displayName: string;
  avatarUri?: string;
}

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  avatarUri?: string;
  totalPoints: number;
  rank: number;
}

export interface StoryPage {
  id: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  choices?: { text: string; nextPageId: string }[];
}

export interface Story {
  id: string;
  title: string;
  type: "legend" | "myth" | "folkStory" | "epic" | "regionalTale";
  language: LanguageCode;
  pages: StoryPage[];
  relatedContentIds: string[];
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  contentId?: string;
}

export interface FilterOptions {
  languages: LanguageCode[];
  types: ContentType[];
  regions: string[];
  tags: string[];
  sortBy: "alphabetical" | "popularity" | "dateAdded" | "recentlyViewed";
}
