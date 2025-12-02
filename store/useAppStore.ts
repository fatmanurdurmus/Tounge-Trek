import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import type {
  Content,
  UserProgress,
  GamificationStats,
  Achievement,
  DailyQueue,
  UserSettings,
} from "@/types/content";

const POINTS = {
  DAILY_LOGIN: 10,
  LEARN_CONTENT: 5,
  DAILY_CHALLENGE: 20,
  VIEW_CONTENT: 1,
  QUIZ_CORRECT: 10,
  BOOKMARK: 2,
  SHARE: 3,
};

interface AppState {
  isInitialized: boolean;
  userProgress: UserProgress;
  gamificationStats: GamificationStats;
  achievements: Achievement[];
  dailyQueue: DailyQueue;
  userSettings: UserSettings;
  
  initialize: () => Promise<void>;
  
  addToLearned: (contentId: string) => Promise<void>;
  toggleBookmark: (contentId: string) => Promise<void>;
  addToDownloaded: (contentId: string) => Promise<void>;
  removeFromDownloaded: (contentId: string) => Promise<void>;
  addToRecentlyViewed: (contentId: string) => Promise<void>;
  toggleFavorite: (contentId: string) => Promise<void>;
  
  addPoints: (amount: number) => Promise<void>;
  recordDailyLogin: () => Promise<void>;
  recordQuizAnswer: (correct: boolean) => Promise<void>;
  recordShare: () => Promise<void>;
  addLanguageExplored: (language: string) => Promise<void>;
  completeTravelMode: (language: string) => Promise<void>;
  incrementMemeInteractions: () => Promise<void>;
  
  checkAndUnlockAchievements: () => Promise<void>;
  
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  
  generateDailyQueue: (allContent: Content[]) => Promise<void>;
  markDailyItemLearned: (contentId: string) => Promise<void>;
  completeDailyQuiz: () => Promise<void>;
}

const DEFAULT_USER_PROGRESS: UserProgress = {
  learnedContentIds: [],
  bookmarkedIds: [],
  downloadedIds: [],
  recentlyViewedIds: [],
  favoritedIds: [],
};

const DEFAULT_GAMIFICATION_STATS: GamificationStats = {
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  quizCorrectCount: 0,
  quizTotalCount: 0,
  shareCount: 0,
  learnedCount: 0,
  dailyChallengesCompleted: 0,
  languagesExplored: [],
  travelModesCompleted: [],
  memeInteractions: 0,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "1", key: "firstSteps", unlocked: false, progress: 0, target: 5 },
  { id: "2", key: "culturalExplorer", unlocked: false, progress: 0, target: 5 },
  { id: "3", key: "weekWarrior", unlocked: false, progress: 0, target: 7 },
  { id: "4", key: "monthMaster", unlocked: false, progress: 0, target: 30 },
  { id: "5", key: "mythHunter", unlocked: false, progress: 0, target: 20 },
  { id: "6", key: "socialButterfly", unlocked: false, progress: 0, target: 10 },
  { id: "7", key: "travelReady", unlocked: false, progress: 0, target: 3 },
  { id: "8", key: "memeWhisperer", unlocked: false, progress: 0, target: 20 },
];

const DEFAULT_DAILY_QUEUE: DailyQueue = {
  date: "",
  contentIds: [],
  learnedIds: [],
  quizCompleted: false,
};

const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: "system",
  appLanguage: "tr",
  notificationsEnabled: true,
  dailyReminderTime: "09:00",
  displayName: "Kullanıcı",
  avatarUri: undefined,
};

const STORAGE_KEYS = {
  USER_PROGRESS: "user_progress",
  GAMIFICATION_STATS: "gamification_stats",
  ACHIEVEMENTS: "achievements",
  DAILY_QUEUE: "daily_queue",
  USER_SETTINGS: "user_settings",
};

export const useAppStore = create<AppState>((set, get) => ({
  isInitialized: false,
  userProgress: DEFAULT_USER_PROGRESS,
  gamificationStats: DEFAULT_GAMIFICATION_STATS,
  achievements: DEFAULT_ACHIEVEMENTS,
  dailyQueue: DEFAULT_DAILY_QUEUE,
  userSettings: DEFAULT_USER_SETTINGS,

  initialize: async () => {
    try {
      const [progress, stats, achievements, queue, settings] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.GAMIFICATION_STATS),
        AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_QUEUE),
        AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS),
      ]);

      set({
        userProgress: progress ? JSON.parse(progress) : DEFAULT_USER_PROGRESS,
        gamificationStats: stats ? JSON.parse(stats) : DEFAULT_GAMIFICATION_STATS,
        achievements: achievements ? JSON.parse(achievements) : DEFAULT_ACHIEVEMENTS,
        dailyQueue: queue ? JSON.parse(queue) : DEFAULT_DAILY_QUEUE,
        userSettings: settings ? JSON.parse(settings) : DEFAULT_USER_SETTINGS,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Error initializing app store:", error);
      set({ isInitialized: true });
    }
  },

  addToLearned: async (contentId: string) => {
    const { userProgress, gamificationStats } = get();
    if (userProgress.learnedContentIds.includes(contentId)) return;

    const newProgress = {
      ...userProgress,
      learnedContentIds: [...userProgress.learnedContentIds, contentId],
    };
    const newStats = {
      ...gamificationStats,
      totalPoints: gamificationStats.totalPoints + POINTS.LEARN_CONTENT,
      learnedCount: gamificationStats.learnedCount + 1,
    };

    set({ userProgress: newProgress, gamificationStats: newStats });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress)),
      AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats)),
    ]);
    await get().checkAndUnlockAchievements();
  },

  toggleBookmark: async (contentId: string) => {
    const { userProgress, gamificationStats } = get();
    const isBookmarked = userProgress.bookmarkedIds.includes(contentId);

    const newProgress = {
      ...userProgress,
      bookmarkedIds: isBookmarked
        ? userProgress.bookmarkedIds.filter((id) => id !== contentId)
        : [...userProgress.bookmarkedIds, contentId],
    };

    let newStats = gamificationStats;
    if (!isBookmarked) {
      newStats = {
        ...gamificationStats,
        totalPoints: gamificationStats.totalPoints + POINTS.BOOKMARK,
      };
    }

    set({ userProgress: newProgress, gamificationStats: newStats });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress)),
      AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats)),
    ]);
  },

  addToDownloaded: async (contentId: string) => {
    const { userProgress } = get();
    if (userProgress.downloadedIds.includes(contentId)) return;

    const newProgress = {
      ...userProgress,
      downloadedIds: [...userProgress.downloadedIds, contentId],
    };

    set({ userProgress: newProgress });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress));
  },

  removeFromDownloaded: async (contentId: string) => {
    const { userProgress } = get();
    const newProgress = {
      ...userProgress,
      downloadedIds: userProgress.downloadedIds.filter((id) => id !== contentId),
    };

    set({ userProgress: newProgress });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress));
  },

  addToRecentlyViewed: async (contentId: string) => {
    const { userProgress, gamificationStats } = get();
    const filtered = userProgress.recentlyViewedIds.filter((id) => id !== contentId);
    const newRecentlyViewed = [contentId, ...filtered].slice(0, 50);

    const newProgress = {
      ...userProgress,
      recentlyViewedIds: newRecentlyViewed,
    };
    const newStats = {
      ...gamificationStats,
      totalPoints: gamificationStats.totalPoints + POINTS.VIEW_CONTENT,
    };

    set({ userProgress: newProgress, gamificationStats: newStats });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress)),
      AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats)),
    ]);
  },

  toggleFavorite: async (contentId: string) => {
    const { userProgress } = get();
    const isFavorited = userProgress.favoritedIds.includes(contentId);

    const newProgress = {
      ...userProgress,
      favoritedIds: isFavorited
        ? userProgress.favoritedIds.filter((id) => id !== contentId)
        : [...userProgress.favoritedIds, contentId],
    };

    set({ userProgress: newProgress });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress));
  },

  addPoints: async (amount: number) => {
    const { gamificationStats } = get();
    const newStats = {
      ...gamificationStats,
      totalPoints: gamificationStats.totalPoints + amount,
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
  },

  recordDailyLogin: async () => {
    const { gamificationStats } = get();
    const today = dayjs().format("YYYY-MM-DD");
    const lastActive = gamificationStats.lastActiveDate;

    if (lastActive === today) return;

    let newStreak = 1;
    if (lastActive) {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      if (lastActive === yesterday) {
        newStreak = gamificationStats.currentStreak + 1;
      }
    }

    const newStats = {
      ...gamificationStats,
      totalPoints: gamificationStats.totalPoints + POINTS.DAILY_LOGIN,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, gamificationStats.longestStreak),
      lastActiveDate: today,
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
    await get().checkAndUnlockAchievements();
  },

  recordQuizAnswer: async (correct: boolean) => {
    const { gamificationStats } = get();
    const newStats = {
      ...gamificationStats,
      quizCorrectCount: gamificationStats.quizCorrectCount + (correct ? 1 : 0),
      quizTotalCount: gamificationStats.quizTotalCount + 1,
      totalPoints: correct
        ? gamificationStats.totalPoints + POINTS.QUIZ_CORRECT
        : gamificationStats.totalPoints,
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
  },

  recordShare: async () => {
    const { gamificationStats } = get();
    const newStats = {
      ...gamificationStats,
      totalPoints: gamificationStats.totalPoints + POINTS.SHARE,
      shareCount: gamificationStats.shareCount + 1,
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
    await get().checkAndUnlockAchievements();
  },

  addLanguageExplored: async (language: string) => {
    const { gamificationStats } = get();
    if (gamificationStats.languagesExplored.includes(language as any)) return;

    const newStats = {
      ...gamificationStats,
      languagesExplored: [...gamificationStats.languagesExplored, language as any],
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
    await get().checkAndUnlockAchievements();
  },

  completeTravelMode: async (language: string) => {
    const { gamificationStats } = get();
    if (gamificationStats.travelModesCompleted.includes(language as any)) return;

    const newStats = {
      ...gamificationStats,
      travelModesCompleted: [...gamificationStats.travelModesCompleted, language as any],
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
    await get().checkAndUnlockAchievements();
  },

  incrementMemeInteractions: async () => {
    const { gamificationStats } = get();
    const newStats = {
      ...gamificationStats,
      memeInteractions: gamificationStats.memeInteractions + 1,
    };

    set({ gamificationStats: newStats });
    await AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats));
    await get().checkAndUnlockAchievements();
  },

  checkAndUnlockAchievements: async () => {
    const { achievements, gamificationStats, userProgress } = get();
    const newAchievements = achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let progress = 0;
      switch (achievement.key) {
        case "firstSteps":
          progress = userProgress.learnedContentIds.length;
          break;
        case "culturalExplorer":
          progress = gamificationStats.languagesExplored.length;
          break;
        case "weekWarrior":
          progress = gamificationStats.currentStreak;
          break;
        case "monthMaster":
          progress = gamificationStats.currentStreak;
          break;
        case "mythHunter":
          progress = gamificationStats.learnedCount;
          break;
        case "socialButterfly":
          progress = gamificationStats.shareCount;
          break;
        case "travelReady":
          progress = gamificationStats.travelModesCompleted.length;
          break;
        case "memeWhisperer":
          progress = gamificationStats.memeInteractions;
          break;
      }

      const unlocked = progress >= achievement.target;
      return {
        ...achievement,
        progress,
        unlocked,
        unlockedAt: unlocked ? dayjs().toISOString() : undefined,
      };
    });

    set({ achievements: newAchievements });
    await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements));
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    const { userSettings } = get();
    const newSettings = { ...userSettings, ...settings };

    set({ userSettings: newSettings });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(newSettings));
  },

  generateDailyQueue: async (allContent: Content[]) => {
    const { dailyQueue, userProgress } = get();
    const today = dayjs().format("YYYY-MM-DD");

    if (dailyQueue.date === today && dailyQueue.contentIds.length > 0) return;

    const unlearned = allContent.filter(
      (c) => !userProgress.learnedContentIds.includes(c.id)
    );
    const shuffled = unlearned.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5).map((c) => c.id);

    const newQueue: DailyQueue = {
      date: today,
      contentIds: selected,
      learnedIds: [],
      quizCompleted: false,
    };

    set({ dailyQueue: newQueue });
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(newQueue));
  },

  markDailyItemLearned: async (contentId: string) => {
    const { dailyQueue } = get();
    if (dailyQueue.learnedIds.includes(contentId)) return;

    const newQueue = {
      ...dailyQueue,
      learnedIds: [...dailyQueue.learnedIds, contentId],
    };

    set({ dailyQueue: newQueue });
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(newQueue));
    await get().addToLearned(contentId);
  },

  completeDailyQuiz: async () => {
    const { dailyQueue, gamificationStats } = get();
    if (dailyQueue.quizCompleted) return;

    const newQueue = { ...dailyQueue, quizCompleted: true };
    const newStats = {
      ...gamificationStats,
      totalPoints: gamificationStats.totalPoints + POINTS.DAILY_CHALLENGE,
      dailyChallengesCompleted: gamificationStats.dailyChallengesCompleted + 1,
    };

    set({ dailyQueue: newQueue, gamificationStats: newStats });
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(newQueue)),
      AsyncStorage.setItem(STORAGE_KEYS.GAMIFICATION_STATS, JSON.stringify(newStats)),
    ]);
  },
}));
