"use client";

import { useHabitStore } from "@/store/habitStore";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";
import { Calendar, TrendingUp } from "lucide-react";

export default function AdvancedCharts() {
  const { getWeeklyStats, getMonthlyStats, getCompletionRate } = useHabitStore();
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  const weeklyData = getWeeklyStats();
  const monthlyData = getMonthlyStats();
  const completionRate = getCompletionRate();

  const chartData = view === "weekly" ? weeklyData : monthlyData;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Analytics & Progress
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === "weekly"
                ? "glass-strong border border-blue-500 text-blue-400"
                : "glass hover:glass-strong"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === "monthly"
                ? "glass-strong border border-blue-500 text-blue-400"
                : "glass hover:glass-strong"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Completion Rate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {completionRate.map((habit, index) => (
          <motion.div
            key={habit.habitName}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="glass-strong rounded-lg p-4 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-300 truncate">
                {habit.habitName}
              </h3>
              <span className="text-lg font-bold text-blue-400">
                {habit.rate}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${habit.rate}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {habit.completed} of {habit.total} days
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="glass-strong rounded-lg p-6 border border-slate-700">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {view === "weekly" ? (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Weekly Completion Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Habits Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Monthly Completion Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    fill="#8b5cf6"
                    name="Avg Completed"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="possible"
                    fill="#475569"
                    name="Total Possible"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Streak Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
      >
        <div className="glass-strong rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            📈 Performance Insight
          </h3>
          <p className="text-xs text-slate-400">
            {chartData.length > 0
              ? `Your habits are most consistent in the ${view === "weekly" ? "middle of the week" : "beginning of the month"}. Keep up the momentum!`
              : "Complete more habits to see insights"}
          </p>
        </div>
        <div className="glass-strong rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            ✨ Consistency Score
          </h3>
          <p className="text-2xl font-bold text-green-400">
            {completionRate.length > 0
              ? Math.round(
                  completionRate.reduce((sum, h) => sum + h.rate, 0) /
                    completionRate.length
                )
              : 0}
            %
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Overall habit completion rate
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}
