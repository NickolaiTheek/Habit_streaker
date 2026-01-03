"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { format } from "date-fns";
import { useHabitStore } from "@/store/habitStore";

export default function HeatmapCalendar() {
  const { habits } = useHabitStore();

  const heatmapData = useMemo(() => {
    const data: { [key: string]: number } = {};
    
    habits.forEach((habit) => {
      habit.completedDates.forEach((date) => {
        data[date] = (data[date] || 0) + 1;
      });
    });

    return data;
  }, [habits]);

  const getLast90Days = () => {
    const days = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const days = getLast90Days();
  const maxCount = Math.max(...Object.values(heatmapData), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-800/30";
    const intensity = count / maxCount;
    if (intensity > 0.75) return "bg-green-500";
    if (intensity > 0.5) return "bg-green-600/80";
    if (intensity > 0.25) return "bg-green-700/60";
    return "bg-green-800/40";
  };

  // Group days by week
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-2">
            {week.map((day, dayIndex) => {
              const count = heatmapData[day] || 0;
              const date = new Date(day);
              const formattedDate = format(date, "MMM d, yyyy");
              
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                  whileHover={{ scale: 1.5, zIndex: 10 }}
                  className={`w-3 h-3 rounded-sm ${getIntensity(count)} transition-colors cursor-pointer relative group`}
                  title={`${formattedDate}: ${count} habits completed`}
                >
                  <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap z-50">
                    {formattedDate}: {count} completed
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-800/30" />
          <div className="w-3 h-3 rounded-sm bg-green-800/40" />
          <div className="w-3 h-3 rounded-sm bg-green-700/60" />
          <div className="w-3 h-3 rounded-sm bg-green-600/80" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
