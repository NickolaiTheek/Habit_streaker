"use client";

import { useHabitStore } from "@/store/habitStore";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function AchievementBadges() {
  const { getAchievements, checkAchievements } = useHabitStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    checkAchievements();
  }, [checkAchievements]);

  if (!isHydrated) return null;

  const achievements = getAchievements();
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const totalCount = achievements.length;

  // Group achievements by category
  const groupedAchievements = {
    streak: achievements.filter((a) => a.category === "streak"),
    completion: achievements.filter((a) => a.category === "completion"),
    consistency: achievements.filter((a) => a.category === "consistency"),
    milestone: achievements.filter((a) => a.category === "milestone"),
  };

  const categoryIcons: { [key: string]: string } = {
    streak: "🔥",
    completion: "✅",
    consistency: "📈",
    milestone: "🎯",
  };

  const categoryNames: { [key: string]: string } = {
    streak: "Streak Badges",
    completion: "Completion Badges",
    consistency: "Consistency Badges",
    milestone: "Milestone Badges",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Achievements
        </h2>
        <div className="glass px-4 py-2 rounded-lg">
          <p className="text-sm text-slate-300">
            <span className="font-bold text-yellow-400">{unlockedCount}</span>
            <span className="text-slate-400">/{totalCount}</span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 glass-strong rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-300">Progress</p>
          <p className="text-sm text-slate-400">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-6">
        {Object.entries(groupedAchievements).map(([category, badges]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-300">
              <span className="text-xl">{categoryIcons[category]}</span>
              {categoryNames[category]}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() =>
                    setSelectedBadge(
                      selectedBadge === badge.id ? null : badge.id
                    )
                  }
                  className={`relative cursor-pointer rounded-xl p-4 transition-all ${
                    badge.unlockedAt
                      ? "glass-strong border border-yellow-500/30 hover:border-yellow-500/60"
                      : "glass border border-slate-700 opacity-60 hover:opacity-80"
                  }`}
                >
                  {/* Badge Content */}
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      animate={
                        badge.unlockedAt ? { y: [0, -5, 0] } : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: badge.unlockedAt ? Infinity : 0,
                      }}
                      className="text-4xl mb-2"
                    >
                      {badge.icon}
                    </motion.div>

                    <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {badge.description}
                    </p>

                    {/* Progress */}
                    {!badge.unlockedAt && (
                      <div className="w-full">
                        <div className="bg-slate-700 rounded-full h-1.5 mb-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(badge.progress / badge.target) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                            className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          {badge.progress}/{badge.target}
                        </p>
                      </div>
                    )}

                    {/* Unlock Badge */}
                    {badge.unlockedAt && (
                      <div className="text-xs text-yellow-400 font-semibold">
                        ✓ Unlocked
                      </div>
                    )}

                    {!badge.unlockedAt && (
                      <Lock className="w-3 h-3 text-slate-500 mt-1" />
                    )}
                  </div>

                  {/* Hover Details */}
                  <AnimatePresence>
                    {selectedBadge === badge.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center"
                      >
                        <div className="text-center">
                          <p className="text-sm mb-2">{badge.description}</p>
                          {badge.unlockedAt && (
                            <p className="text-xs text-yellow-400">
                              Unlocked on{" "}
                              {new Date(badge.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                          {!badge.unlockedAt && (
                            <p className="text-xs text-slate-400">
                              Progress: {badge.progress}/{badge.target}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-strong rounded-lg p-4 border border-slate-700"
        >
          <p className="text-sm text-slate-400 mb-1">Unlocked Badges</p>
          <p className="text-3xl font-bold text-yellow-400">{unlockedCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="glass-strong rounded-lg p-4 border border-slate-700"
        >
          <p className="text-sm text-slate-400 mb-1">Total Badges</p>
          <p className="text-3xl font-bold text-cyan-400">{totalCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-strong rounded-lg p-4 border border-slate-700"
        >
          <p className="text-sm text-slate-400 mb-1">Completion</p>
          <p className="text-3xl font-bold text-green-400">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
