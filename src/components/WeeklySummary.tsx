"use client";

import { useHabitStore } from "@/store/habitStore";
import { motion } from "framer-motion";
import { Calendar, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function WeeklySummary() {
  const { habits } = useHabitStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const summary = useMemo(() => {
    const today = new Date();

    const getDateString = (date: Date) => date.toISOString().split("T")[0];
    const getDayLabel = (date: Date) =>
      date.toLocaleDateString("en-US", { weekday: "short" });

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date,
        dateString: getDateString(date),
        dayLabel: getDayLabel(date),
      };
    });

    const dailyCounts = days.map((day) => {
      const completed = habits.filter((habit) =>
        habit.completedDates.includes(day.dateString)
      ).length;
      return { ...day, completed };
    });

    const weeklyCompleted = dailyCounts.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const weeklyPossible = habits.length * 7;
    const completionRate = weeklyPossible
      ? Math.round((weeklyCompleted / weeklyPossible) * 100)
      : 0;

    const bestDay = dailyCounts.reduce(
      (best, day) => (day.completed > best.completed ? day : best),
      dailyCounts[0] ?? { dayLabel: "-", completed: 0 }
    );

    const lastWeekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (13 - i));
      return getDateString(date);
    });

    const lastWeekCompleted = lastWeekDays.reduce((sum, dateString) => {
      const completed = habits.filter((habit) =>
        habit.completedDates.includes(dateString)
      ).length;
      return sum + completed;
    }, 0);

    const trendDelta = weeklyCompleted - lastWeekCompleted;
    const streakingHabits = habits.filter((habit) => habit.streak > 0).length;

    return {
      dailyCounts,
      weeklyCompleted,
      weeklyPossible,
      completionRate,
      bestDay,
      trendDelta,
      streakingHabits,
    };
  }, [habits]);

  if (!isHydrated) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-cyan-500" />
          Weekly Summary
        </h2>
        <div className="glass px-3 py-2 rounded-lg text-sm">
          <span className="text-slate-300">Completion </span>
          <span className="font-bold text-cyan-400">
            {summary.completionRate}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-strong rounded-lg p-4 border border-slate-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-300">Daily Completions</p>
            <div className="text-xs text-slate-400">
              {summary.weeklyCompleted}/{summary.weeklyPossible}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 items-end">
            {summary.dailyCounts.map((day) => (
              <div key={day.dateString} className="flex flex-col items-center">
                <div className="w-full h-24 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${
                        summary.weeklyPossible
                          ? Math.max(12, (day.completed / habits.length) * 100)
                          : 12
                      }%`,
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-full rounded-md bg-gradient-to-t from-cyan-500 to-blue-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">{day.dayLabel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-lg p-4 border border-slate-700 space-y-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Best Day</p>
            <p className="text-lg font-semibold">
              {summary.bestDay.dayLabel} · {summary.bestDay.completed} completed
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Trend vs last week</p>
            <p
              className={`text-lg font-semibold ${
                summary.trendDelta >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {summary.trendDelta >= 0 ? "+" : ""}
              {summary.trendDelta} completions
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Active Streaks</p>
            <p className="text-lg font-semibold text-orange-400">
              {summary.streakingHabits}/{habits.length}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="w-4 h-4" />
            Keep momentum to boost your streaks
          </div>
        </div>
      </div>
    </motion.section>
  );
}