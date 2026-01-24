"use client";

import { cn } from "@/lib/utils";
import { useHabitStore, type Habit } from "@/store/habitStore";
import { motion } from "framer-motion";
import { CheckCircle2, Edit2, Flame, Trash2 } from "lucide-react";

import useSound from "@/hooks/useSound";
import HabitIcon3D from "./HabitIcon3D";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  index: number;
}

export default function HabitCard({ habit, onComplete, onEdit, index }: HabitCardProps) {
  const { toggleHabit, deleteHabit } = useHabitStore();
  const { playSfx } = useSound();

  const handleClick = () => {
    if (!habit.isCompletedToday) {
      playSfx("complete");
    }
    toggleHabit(habit.id);
    onComplete(habit.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
      deleteHabit(habit.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(habit);
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
          <HabitIcon3D
            icon={habit.icon}
            className={cn("w-14 h-14 rounded-xl", habit.color)}
          />
          <div>
            <h3 className="font-bold text-lg">{habit.name}</h3>
            <p className="text-sm text-muted-foreground">
              {habit.isCompletedToday ? "Completed today!" : "Mark as done"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {habit.isCompletedToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit habit"
          >
            <Edit2 className="w-4 h-4 text-blue-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Delete habit"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>
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
