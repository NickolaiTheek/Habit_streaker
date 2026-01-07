"use client";

import { Habit, useHabitStore } from "@/store/habitStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: Habit;
}

const EMOJI_OPTIONS = [
  "💪",
  "🌅",
  "🚶",
  "📚",
  "💻",
  "📝",
  "🧘",
  "🏃",
  "🥗",
  "💤",
  "🧠",
  "🎯",
  "🎨",
  "🎵",
  "🏋️",
  "🚴",
  "📱",
  "🖥️",
  "✍️",
  "🌱",
];

const COLOR_OPTIONS = [
  "from-red-500 to-orange-500",
  "from-yellow-500 to-orange-500",
  "from-green-500 to-teal-500",
  "from-blue-500 to-purple-500",
  "from-purple-500 to-pink-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-yellow-500",
  "from-teal-500 to-cyan-500",
  "from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-500",
];

const COLOR_PREVIEW: { [key: string]: string } = {
  "from-red-500 to-orange-500": "bg-gradient-to-r from-red-500 to-orange-500",
  "from-yellow-500 to-orange-500":
    "bg-gradient-to-r from-yellow-500 to-orange-500",
  "from-green-500 to-teal-500": "bg-gradient-to-r from-green-500 to-teal-500",
  "from-blue-500 to-purple-500": "bg-gradient-to-r from-blue-500 to-purple-500",
  "from-purple-500 to-pink-500": "bg-gradient-to-r from-purple-500 to-pink-500",
  "from-pink-500 to-rose-500": "bg-gradient-to-r from-pink-500 to-rose-500",
  "from-orange-500 to-yellow-500":
    "bg-gradient-to-r from-orange-500 to-yellow-500",
  "from-teal-500 to-cyan-500": "bg-gradient-to-r from-teal-500 to-cyan-500",
  "from-indigo-500 to-purple-500":
    "bg-gradient-to-r from-indigo-500 to-purple-500",
  "from-cyan-500 to-blue-500": "bg-gradient-to-r from-cyan-500 to-blue-500",
};

export default function HabitFormModal({
  isOpen,
  onClose,
  habit,
}: HabitFormModalProps) {
  const { addHabit, updateHabit } = useHabitStore();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setIcon(habit.icon);
      setColor(habit.color);
    } else {
      setName("");
      setIcon(EMOJI_OPTIONS[0]);
      setColor(COLOR_OPTIONS[0]);
    }
    setError("");
  }, [habit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Habit name is required");
      return;
    }

    if (habit) {
      updateHabit(habit.id, name, icon, color);
    } else {
      addHabit(name, icon, color);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-strong border border-slate-700 rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">
                  {habit ? "Edit Habit" : "New Habit"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g., Morning Run"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg text-2xl transition-all ${
                          icon === emoji
                            ? "bg-blue-500/30 border-2 border-blue-500"
                            : "bg-slate-800 border border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Choose Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_OPTIONS.map((colorOption) => (
                      <motion.button
                        key={colorOption}
                        type="button"
                        onClick={() => setColor(colorOption)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`h-12 rounded-lg transition-all ${
                          COLOR_PREVIEW[colorOption]
                        } ${
                          color === colorOption
                            ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-white"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">Preview:</p>
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl bg-gradient-to-br ${color}`}
                  >
                    {icon}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all"
                  >
                    {habit ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
