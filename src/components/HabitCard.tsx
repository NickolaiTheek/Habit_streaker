"use client";

import { motion } from "framer-motion";
import { Flame, CheckCircle2 } from "lucide-react";
import { useHabitStore, type Habit } from "@/store/habitStore";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  index: number;
}

export default function HabitCard({ habit, onComplete, index }: HabitCardProps) {
  const { toggleHabit } = useHabitStore();

  const handleClick = () => {
    toggleHabit(habit.id);
    onComplete(habit.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass-strong rounded-2xl p-6 cursor-pointer transition-all duration-300",
        habit.isCompletedToday && "ring-2 ring-green-500/50"
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br",
              habit.color
            )}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{habit.name}</h3>
            <p className="text-sm text-muted-foreground">
              {habit.isCompletedToday ? "Completed today!" : "Mark as done"}
            </p>
          </div>
        </div>
        {habit.isCompletedToday && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </motion.div>
        )}
      </div>

      {/* Streak Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame
            className={cn(
              "w-6 h-6",
              habit.streak > 0 ? "text-orange-500" : "text-gray-500"
            )}
          />
          <div>
            <p className="text-2xl font-bold">{habit.streak}</p>
            <p className="text-xs text-muted-foreground">day streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-yellow-500">
            {habit.bestStreak}
          </p>
          <p className="text-xs text-muted-foreground">best streak</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: habit.isCompletedToday ? "100%" : "0%",
            }}
            transition={{ duration: 0.5 }}
            className={cn("h-full bg-gradient-to-r", habit.color)}
          />
        </div>
      </div>
    </motion.div>
  );
}
