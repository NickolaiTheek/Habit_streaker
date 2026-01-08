"use client";

import { motion } from "framer-motion";
import { Search, X, Filter } from "lucide-react";
import { useState } from "react";

export type FilterType = "all" | "completed" | "active-streak" | "not-completed";
export type SortType = "streak" | "name" | "last-completed";

interface HabitFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  totalHabits: number;
  filteredCount: number;
}

export default function HabitFilter({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  totalHabits,
  filteredCount,
}: HabitFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filterOptions: { value: FilterType; label: string; icon: string }[] = [
    { value: "all", label: "All Habits", icon: "📋" },
    { value: "completed", label: "Completed Today", icon: "✅" },
    { value: "active-streak", label: "Active Streaks", icon: "🔥" },
    { value: "not-completed", label: "Not Completed", icon: "⏳" },
  ];

  const sortOptions: { value: SortType; label: string; icon: string }[] = [
    { value: "streak", label: "Streak Length", icon: "🔥" },
    { value: "name", label: "Alphabetical", icon: "A-Z" },
    { value: "last-completed", label: "Last Completed", icon: "⏰" },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-100 placeholder-slate-500"
          />
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Filter & Sort Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-4 py-2 glass-strong border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Advanced Filters</span>
          {activeFilter !== "all" && (
            <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
              {activeFilter === "completed"
                ? "Completed Today"
                : activeFilter === "active-streak"
                ? "Active Streaks"
                : "Not Completed"}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: showAdvanced ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Filter Options */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
              Filter By Status
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {filterOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onFilterChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    activeFilter === option.value
                      ? "glass-strong border border-blue-500 text-blue-400 bg-blue-500/10"
                      : "glass border border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <span>{option.icon}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
              Sort By
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSortChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    sortBy === option.value
                      ? "glass-strong border border-purple-500 text-purple-400 bg-purple-500/10"
                      : "glass border border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <span>{option.icon}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="glass rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-300">{filteredCount}</span> of{" "}
              <span className="font-semibold text-slate-300">{totalHabits}</span> habits
              {searchQuery && (
                <>
                  {" "}
                  matching "<span className="text-blue-400">{searchQuery}</span>"
                </>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
