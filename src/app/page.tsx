"use client";

import AchievementBadges from "@/components/AchievementBadges";
import AddHabitButton3D from "@/components/AddHabitButton3D";
import AdvancedCharts from "@/components/AdvancedCharts";
import HabitCard from "@/components/HabitCard";
import HabitFilter, { FilterType, SortType } from "@/components/HabitFilter";
import HabitFormModal from "@/components/HabitFormModal";
import HeatmapCalendar from "@/components/HeatmapCalendar";
// import InteractiveScene from "@/components/InteractiveScene";
import ParticlesBackground from "@/components/ParticlesBackground";
import RewardAnimation from "@/components/RewardAnimation";
import SplineScene from "@/components/SplineScene";
import StatsCard from "@/components/StatsCard";
import ThemeStoreModal from "@/components/ThemeStoreModal";
import useSound from "@/hooks/useSound";
import { useHabitStore, type Habit } from "@/store/habitStore";
import { AnimatePresence, motion } from "framer-motion";
import {
    Award,
    Calendar,
    Flame,
    Palette,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Volume2,
    VolumeX,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";


export default function Home() {
  const { habits, stats, loadData } = useHabitStore();
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState<"confetti" | "trophy" | "star">("confetti");
  const [modalOpen, setModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("streak");
  const [isClient, setIsClient] = useState(false);
  const { isMuted, toggleMute } = useSound();

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, [loadData]);

  const handleHabitComplete = () => {
    setShowReward(true);
    setRewardType("confetti");
    setTimeout(() => setShowReward(false), 3000);
  };

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHabit(undefined);
  };

  // Filter and search habits
  const filteredHabits = habits
    .filter((habit) => {
      // Search filter
      const matchesSearch = habit.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      switch (filterType) {
        case "completed":
          return habit.isCompletedToday;
        case "active-streak":
          return habit.streak > 0;
        case "not-completed":
          return !habit.isCompletedToday;
        case "all":
import WeeklySummary from "@/components/WeeklySummary";
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case "streak":
          return b.streak - a.streak; // Highest streak first
        case "name":
          return a.name.localeCompare(b.name); // Alphabetical
        case "last-completed":
          {
            const aDate = a.lastCompleted ? new Date(a.lastCompleted) : new Date(0);
            const bDate = b.lastCompleted ? new Date(b.lastCompleted) : new Date(0);
            return bDate.getTime() - aDate.getTime(); // Most recent first
          }
        default:
          return 0;
      }
    });

  return (
    <div className={`min-h-screen relative overflow-hidden ${isClient && stats.currentTheme ? `theme-${stats.currentTheme}` : ""}`}>
      {/* Interactive 3D Scene - Commented out to use Spline */}
      {/* <InteractiveScene /> */}

      {/* Spline 3D Scene */}
      <SplineScene />

      {/* Particles Background */}
      <ParticlesBackground />

      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      {/* Reward Animations */}
      <AnimatePresence>
        {showReward && <RewardAnimation type={rewardType} />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-strong border-b"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">
                    Streak Tracker
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Build better habits, one day at a time
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMute}
                  className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
                </button>
                <button
                  onClick={() => setThemeModalOpen(true)}
                  className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Palette className="w-5 h-5 text-pink-500" />
                  <span className="hidden sm:inline font-bold">Themes</span>
                </button>
                <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-lg">{stats.totalPoints}</span>
                  <span className="text-sm text-muted-foreground">XP</span>
                </div>
                <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-lg">Level {stats.level}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                icon={<Flame className="w-6 h-6" />}
                title="Current Streak"
                value={stats.currentStreak}
                unit="days"
                color="text-orange-500"
              />
              <StatsCard
                icon={<Trophy className="w-6 h-6" />}
                title="Best Streak"
                value={stats.bestStreak}
                unit="days"
                color="text-yellow-500"
              />
              <StatsCard
                icon={<Target className="w-6 h-6" />}
                title="Completed Today"
                value={stats.completedToday}
                unit={`/ ${habits.length}`}
                color="text-green-500"
              />
              <StatsCard
                icon={<Award className="w-6 h-6" />}
                title="Achievements"
                value={stats.achievements}
                unit="unlocked"
                color="text-purple-500"
              />
            </div>
          </motion.section>

          {/* Weekly Summary */}
          <WeeklySummary />

          {/* Habits Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Today&apos;s Habits
              </h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AddHabitButton3D onClick={handleAddHabit} />
              </motion.div>
            </div>

            {/* Filter Component */}
            <HabitFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={filterType}
              onFilterChange={setFilterType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalHabits={habits.length}
              filteredCount={filteredHabits.length}
            />

            {/* Habits Grid or Empty State */}
            {filteredHabits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHabits.map((habit, index) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onComplete={handleHabitComplete}
                    onEdit={handleEditHabit}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-slate-400 text-lg mb-2">No habits found</p>
                <p className="text-slate-500 text-sm">
                  {searchQuery ? (
                    <>
                      Try adjusting your search: &quot;
                      <span className="text-blue-400">{searchQuery}</span>
                      &quot;
                    </>
                  ) : (
                    "Create your first habit to get started!"
                  )}
                </p>
              </motion.div>
            )}
          </motion.section>

          {/* Heatmap Calendar */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              Activity Heatmap
            </h2>
            <HeatmapCalendar />
          </motion.section>

          {/* Advanced Charts */}
          <AdvancedCharts />

          {/* Achievement Badges */}
          <AchievementBadges />
        </main>
      </div>

      {/* Habit Form Modal */}
      <HabitFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        habit={editingHabit}
      />
      <ThemeStoreModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
}
