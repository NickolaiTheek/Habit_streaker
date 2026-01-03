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

export interface Stats {
  level: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  completedToday: number;
  achievements: number;
}

interface HabitStore {
  habits: Habit[];
  stats: Stats;
  initializeHabits: () => void;
  toggleHabit: (id: string) => void;
  loadData: () => void;
}

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

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

const calculateStats = (habits: Habit[]): Stats => {
  const completedToday = habits.filter((h) => h.isCompletedToday).length;
  const totalPoints = habits.reduce((sum, h) => sum + h.streak * 10, 0);
  const level = Math.floor(totalPoints / 100) + 1;
  const currentStreak = habits.reduce((sum, h) => sum + h.streak, 0) / habits.length;
  const bestStreak = Math.max(...habits.map((h) => h.bestStreak), 0);
  const achievements = Math.floor(totalPoints / 500);

  return {
    level,
    totalPoints,
    currentStreak: Math.floor(currentStreak),
    bestStreak,
    completedToday,
    achievements,
  };
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
      },

      initializeHabits: () => {
        const stored = localStorage.getItem("habit-store");
        if (!stored) {
          set({ habits: defaultHabits });
        }
      },

      loadData: () => {
        const { habits } = get();
        if (habits.length === 0) {
          set({ habits: defaultHabits });
        }

        const today = getTodayString();
        const updatedHabits = habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);
          
          // Check if streak should continue
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toISOString().split("T")[0];
          
          let currentStreak = habit.streak;
          if (!isCompletedToday && habit.lastCompleted !== today) {
            // If not completed today and last completion wasn't yesterday, reset streak
            if (habit.lastCompleted !== yesterdayString) {
              currentStreak = 0;
            }
          }

          return {
            ...habit,
            isCompletedToday,
            streak: currentStreak,
          };
        });

        const stats = calculateStats(updatedHabits);
        set({ habits: updatedHabits, stats });
      },

      toggleHabit: (id: string) => {
        const today = getTodayString();
        
        set((state) => {
          const updatedHabits = state.habits.map((habit) => {
            if (habit.id !== id) return habit;

            const isCompletedToday = habit.completedDates.includes(today);
            
            let newCompletedDates = [...habit.completedDates];
            let newStreak = habit.streak;
            let newBestStreak = habit.bestStreak;

            if (isCompletedToday) {
              // Uncomplete
              newCompletedDates = newCompletedDates.filter((date) => date !== today);
              newStreak = Math.max(0, newStreak - 1);
            } else {
              // Complete
              newCompletedDates.push(today);
              newStreak = habit.streak + 1;
              newBestStreak = Math.max(newBestStreak, newStreak);
            }

            return {
              ...habit,
              completedDates: newCompletedDates,
              streak: newStreak,
              bestStreak: newBestStreak,
              lastCompleted: isCompletedToday ? habit.lastCompleted : today,
              isCompletedToday: !isCompletedToday,
            };
          });

          const stats = calculateStats(updatedHabits);
          return { habits: updatedHabits, stats };
        });
      },
    }),
    {
      name: "habit-store",
    }
  )
);
