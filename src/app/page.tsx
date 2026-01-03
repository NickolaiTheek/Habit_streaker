"use client";

import HabitCard from "@/components/HabitCard";
import HeatmapCalendar from "@/components/HeatmapCalendar";
import RewardAnimation from "@/components/RewardAnimation";
import StatsCard from "@/components/StatsCard";
import { useHabitStore } from "@/store/habitStore";
import { AnimatePresence, motion } from "framer-motion";
import {
    Award,
    Calendar,
    Flame,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

function BackgroundGradient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}

export default function Home() {
  const { habits, stats, loadData } = useHabitStore();
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState<"confetti" | "trophy" | "star">("confetti");

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleHabitComplete = (habitId: string) => {
    setShowReward(true);
    setRewardType("confetti");
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <BackgroundGradient />

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

          {/* Habits Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Today's Habits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit, index) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleHabitComplete}
                  index={index}
                />
              ))}
            </div>
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
        </main>
      </div>
    </div>
  );
}
