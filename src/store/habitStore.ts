import { format, parseISO, subDays } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  bestStreak: number;
  completedDates: string[];
  lastCompleted: string | null;
  isCompletedToday: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  target: number;
  category: "streak" | "completion" | "consistency" | "milestone";
}

export interface Stats {
  level: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  completedToday: number;
  achievements: number;
  currentTheme: string;
  unlockedThemes: string[];
}

interface HabitStore {
  habits: Habit[];
  stats: Stats;
  achievements: Achievement[];
  initializeHabits: () => void;
  toggleHabit: (id: string) => void;
  loadData: () => void;
  getWeeklyStats: () => Array<{ day: string; completed: number }>;
  getMonthlyStats: () => Array<{ week: string; completed: number; possible: number }>;
  getCompletionRate: () => Array<{ habitName: string; rate: number; completed: number; total: number }>;
  addHabit: (name: string, icon: string, color: string) => void;
  updateHabit: (id: string, name: string, icon: string, color: string) => void;
  deleteHabit: (id: string) => void;
  getAchievements: () => Achievement[];
  checkAchievements: () => void;
  setTheme: (theme: string) => void;
}

const calculateStats = (habits: Habit[]): Omit<Stats, "currentTheme" | "unlockedThemes"> => {
  let totalPoints = 0;
  let completedToday = 0;
  let overallBestStreak = 0;
  let overallCurrentStreak = 0;

  habits.forEach((habit) => {
    totalPoints += habit.completedDates.length * 10; // 10 points per completion
    if (habit.isCompletedToday) {
      completedToday++;
    }
    if (habit.bestStreak > overallBestStreak) {
      overallBestStreak = habit.bestStreak;
    }
    // For overall current streak, we might need a more complex logic
    // For simplicity, let's just take the max current streak among habits
    if (habit.streak > overallCurrentStreak) {
      overallCurrentStreak = habit.streak;
    }
  });

  // Level calculation (example: 100 points per level)
  const level = Math.floor(totalPoints / 100) + 1;

  // Placeholder for achievements count, will be updated by checkAchievements
  const achievements = 0;

  return {
    level,
    totalPoints,
    currentStreak: overallCurrentStreak,
    bestStreak: overallBestStreak,
    completedToday,
    achievements,
  };
};

const defaultHabits: Habit[] = [
  {
    id: "1",
    name: "Morning Workout",
    icon: "💪",
    color: "from-red-500 to-orange-500",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    lastCompleted: null,
    isCompletedToday: false,
  },
  {
    id: "2",
    name: "Early Wake Up",
    icon: "🌅",
    color: "from-yellow-500 to-orange-500",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    lastCompleted: null,
    isCompletedToday: false,
  },
  {
    id: "3",
    name: "Morning Walk",
    icon: "🚶",
    color: "from-green-500 to-teal-500",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    lastCompleted: null,
    isCompletedToday: false,
  },
  {
    id: "4",
    name: "Daily Reading",
    icon: "📚",
    color: "from-blue-500 to-purple-500",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    lastCompleted: null,
    isCompletedToday: false,
  },
  {
    id: "5",
    name: "Code Practice",
    icon: "💻",
    color: "from-purple-500 to-pink-500",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    lastCompleted: null,
    isCompletedToday: false,
  },
  {
    id: "6",
    name: "Gratitude Journal",
    icon: "📝",
    color: "from-pink-500 to-rose-500",
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    lastCompleted: null,
    isCompletedToday: false,
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: "streak-7",
    name: "7-Day Warrior",
    description: "Maintain a 7-day habit streak",
    icon: "🔥",
    unlockedAt: null,
    progress: 0,
    target: 7,
    category: "streak",
  },
  {
    id: "streak-30",
    name: "Month Master",
    description: "Maintain a 30-day habit streak",
    icon: "⭐",
    unlockedAt: null,
    progress: 0,
    target: 30,
    category: "streak",
  },
  {
    id: "streak-100",
    name: "Unstoppable",
    description: "Maintain a 100-day habit streak",
    icon: "💎",
    unlockedAt: null,
    progress: 0,
    target: 100,
    category: "streak",
  },
  // Completion Achievements
  {
    id: "complete-10",
    name: "Getting Started",
    description: "Complete 10 total habits",
    icon: "🚀",
    unlockedAt: null,
    progress: 0,
    target: 10,
    category: "completion",
  },
  {
    id: "complete-100",
    name: "Century Club",
    description: "Complete 100 total habits",
    icon: "💯",
    unlockedAt: null,
    progress: 0,
    target: 100,
    category: "completion",
  },
  {
    id: "complete-500",
    name: "Habit Legend",
    description: "Complete 500 total habits",
    icon: "👑",
    unlockedAt: null,
    progress: 0,
    target: 500,
    category: "completion",
  },
  // Consistency Achievements
  {
    id: "consistency-80",
    name: "Consistency King",
    description: "Achieve 80% completion rate",
    icon: "📈",
    unlockedAt: null,
    progress: 0,
    target: 80,
    category: "consistency",
  },
  {
    id: "perfect-week",
    name: "Perfect Week",
    description: "Complete all habits for 7 consecutive days",
    icon: "✨",
    unlockedAt: null,
    progress: 0,
    target: 7,
    category: "milestone",
  },
  // Milestone Achievements
  {
    id: "milestone-all-habits",
    name: "Collector",
    description: "Create 5 different habits",
    icon: "🎯",
    unlockedAt: null,
    progress: 0,
    target: 5,
    category: "milestone",
  },
];


const getTodayString = () => {
  return format(new Date(), "yyyy-MM-dd");
};

// Calculate current streak based on consecutive completed dates
const calculateStreakFromDates = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const today = getTodayString();
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  // Determine start date for streak check
  let currentCheckDateStr = today;
  if (!completedDates.includes(today) && completedDates.includes(yesterday)) {
    currentCheckDateStr = yesterday;
  } else if (!completedDates.includes(today)) {
    return 0; // Not done today or yesterday, streak broken
  }

  let streak = 0;
  let checkDate = parseISO(currentCheckDateStr);

  // Check backwards up to 365 days (or until break)
  for (let i = 0; i < 365; i++) {
    const dateStr = format(checkDate, "yyyy-MM-dd");

    if (completedDates.includes(dateStr)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
};


export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      stats: {
        level: 1,
        totalPoints: 0,
        currentStreak: 0,
        bestStreak: 0,
        completedToday: 0,
        achievements: 0,
        currentTheme: "default",
        unlockedThemes: ["default"],
      },
      achievements: DEFAULT_ACHIEVEMENTS,

      initializeHabits: () => {
        const stored = localStorage.getItem("habit-store");
        if (!stored) {
          set({ habits: defaultHabits });
        }
      },

      loadData: () => {
        const { habits } = get();
        const baseHabits = habits.length === 0 ? defaultHabits : habits;

        if (habits.length === 0) {
          set({ habits: baseHabits });
        }

        const today = getTodayString();
        const updatedHabits = baseHabits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);

          // Recalculate streak from completed dates
          const currentStreak = calculateStreakFromDates(habit.completedDates);

          return {
            ...habit,
            isCompletedToday,
            streak: currentStreak,
          };
        });

        const stats = { ...get().stats, ...calculateStats(updatedHabits) };
        set({ habits: updatedHabits, stats });
      },

      toggleHabit: (id: string) => {
        const today = getTodayString();

        set((state) => {
          const updatedHabits = state.habits.map((habit) => {
            if (habit.id !== id) return habit;

            const isCompletedToday = habit.completedDates.includes(today);

            let newCompletedDates = [...habit.completedDates];
            let newBestStreak = habit.bestStreak;

            if (isCompletedToday) {
              // Uncomplete: remove today from completed dates
              newCompletedDates = newCompletedDates.filter((date) => date !== today);
            } else {
              // Complete: add today to completed dates
              newCompletedDates.push(today);
            }

            // Recalculate streak from the updated completed dates
            const newStreak = calculateStreakFromDates(newCompletedDates);

            // Update best streak if current streak is higher
            if (newStreak > newBestStreak) {
              newBestStreak = newStreak;
            }

            return {
              ...habit,
              completedDates: newCompletedDates,
              streak: newStreak,
              bestStreak: newBestStreak,
              lastCompleted: newCompletedDates.length > 0
                ? newCompletedDates[newCompletedDates.length - 1]
                : null,
              isCompletedToday: !isCompletedToday,
            };
          });

          const stats = { ...state.stats, ...calculateStats(updatedHabits) };

          // Schedule achievement check
          setTimeout(() => get().checkAchievements(), 0);

          return { habits: updatedHabits, stats };
        });
      },

      getWeeklyStats: () => {
        const { habits } = get();
        const today = new Date();
        const weekData: { [key: string]: number } = {};

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          weekData[dateStr] = 0;
        }

        // Count completions for each day
        habits.forEach((habit) => {
          habit.completedDates.forEach((dateStr) => {
            if (weekData.hasOwnProperty(dateStr)) {
              weekData[dateStr]++;
            }
          });
        });

        return Object.entries(weekData).map(([date, completed]) => {
          const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
          return { day: dayName, completed };
        });
      },

      getMonthlyStats: () => {
        const { habits } = get();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Initialize weeks based on actual days in month
        const weeks: { [key: number]: { completed: number; possible: number } } = {};
        const maxWeeks = Math.ceil(daysInMonth / 7);
        for (let i = 1; i <= maxWeeks; i++) {
          weeks[i] = { completed: 0, possible: 0 };
        }

        // Count completions by week
        habits.forEach((habit) => {
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const weekNum = Math.ceil(day / 7);
            weeks[weekNum].possible++;

            const dateStr = date.toISOString().split("T")[0];
            if (habit.completedDates.includes(dateStr)) {
              weeks[weekNum].completed++;
            }
          }
        });

        return Object.entries(weeks).map(([weekNum, data]) => ({
          week: `Week ${weekNum}`,
          completed: Math.round(data.completed / habits.length || 0),
          possible: Math.round(data.possible / habits.length || 0),
        }));
      },

      getCompletionRate: () => {
        const { habits } = get();
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return habits.map((habit) => {
          const completedInRange = habit.completedDates.filter((dateStr) => {
            const date = new Date(dateStr);
            return date >= thirtyDaysAgo && date <= today;
          }).length;

          const rate = Math.round((completedInRange / 30) * 100);
          return {
            habitName: habit.name,
            rate,
            completed: completedInRange,
            total: 30,
          };
        });
      },

      addHabit: (name: string, icon: string, color: string) => {
        const id = Date.now().toString();
        const newHabit: Habit = {
          id,
          name,
          icon,
          color,
          streak: 0,
          bestStreak: 0,
          completedDates: [],
          lastCompleted: null,
          isCompletedToday: false,
        };

        set((state) => {
          const updatedHabits = [...state.habits, newHabit];
          const stats = { ...state.stats, ...calculateStats(updatedHabits) };
          return { habits: updatedHabits, stats };
        });
      },

      updateHabit: (id: string, name: string, icon: string, color: string) => {
        set((state) => {
          const updatedHabits = state.habits.map((habit) =>
            habit.id === id ? { ...habit, name, icon, color } : habit
          );
          const stats = { ...state.stats, ...calculateStats(updatedHabits) };
          return { habits: updatedHabits, stats };
        });
      },

      deleteHabit: (id: string) => {
        set((state) => {
          const updatedHabits = state.habits.filter((habit) => habit.id !== id);
          const stats = { ...state.stats, ...calculateStats(updatedHabits) };
          return { habits: updatedHabits, stats };
        });
      },

      getAchievements: () => {
        return get().achievements;
      },

      checkAchievements: () => {
        const { habits, achievements } = get();
        const today = getTodayString();

        const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
        const bestStreak = Math.max(...habits.map((h) => h.bestStreak), 0);
        const completionRate = habits.length > 0
          ? Math.round((habits.filter((h) => h.isCompletedToday).length / habits.length) * 100)
          : 0;

        const updatedAchievements = achievements.map((achievement) => {
          if (achievement.unlockedAt) return achievement;

          let progress = 0;
          let shouldUnlock = false;

          switch (achievement.id) {
            case "streak-7":
            case "streak-30":
            case "streak-100":
              progress = bestStreak;
              shouldUnlock = bestStreak >= achievement.target;
              break;

            case "complete-10":
            case "complete-100":
            case "complete-500":
              progress = totalCompletions;
              shouldUnlock = totalCompletions >= achievement.target;
              break;

            case "consistency-80":
              progress = completionRate;
              shouldUnlock = completionRate >= achievement.target;
              break;

            case "perfect-week":
              {
                let perfectDays = 0;
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

                for (let i = 0; i < 7; i++) {
                  const checkDate = new Date(sevenDaysAgo);
                  checkDate.setDate(checkDate.getDate() + i);
                  const dateStr = checkDate.toISOString().split("T")[0];
                  const allCompleted = habits.every((h) =>
                    h.completedDates.includes(dateStr)
                  );
                  if (allCompleted && habits.length > 0) perfectDays++;
                }

                progress = perfectDays;
                shouldUnlock = perfectDays >= 7 && habits.length > 0;
              }
              break;

            case "milestone-all-habits":
              progress = habits.length;
              shouldUnlock = habits.length >= achievement.target;
              break;
          }

          return {
            ...achievement,
            progress: Math.min(progress, achievement.target),
            unlockedAt: shouldUnlock ? today : achievement.unlockedAt,
          };
        });

        set({ achievements: updatedAchievements });

        // Check for theme unlocks
        const currentLevel = get().stats.level;
        const currentUnlocked = get().stats.unlockedThemes;
        const newUnlocked = [...currentUnlocked];

        if (currentLevel >= 5 && !newUnlocked.includes("sunset")) {
          newUnlocked.push("sunset");
        }
        if (currentLevel >= 10 && !newUnlocked.includes("cyberpunk")) {
          newUnlocked.push("cyberpunk");
        }
        if (currentLevel >= 20 && !newUnlocked.includes("monochrome")) {
          newUnlocked.push("monochrome");
        }

        if (newUnlocked.length > currentUnlocked.length) {
          set((state) => ({
            stats: {
              ...state.stats,
              unlockedThemes: newUnlocked,
            }
          }));
        }
      },

      setTheme: (theme: string) => {
        set((state) => ({
          stats: {
            ...state.stats,
            currentTheme: theme,
          },
        }));
      },
    }),
    {
      name: "habit-store",
    }
  )
);
