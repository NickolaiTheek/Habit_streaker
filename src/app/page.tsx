"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Star
} from "lucide-react";
import HabitCard from "@/components/HabitCard";
import StatsCard from "@/components/StatsCard";
import HeatmapCalendar from "@/components/HeatmapCalendar";
import RewardAnimation from "@/components/RewardAnimation";
import { useHabitStore } from "@/store/habitStore";

// Dynamically import Scene3D with no SSR
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

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
      {/* 3D Background Scene */}
      <div className="fixed inset-0 -z-10">
        <Scene3D />
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
