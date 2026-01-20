"use client";

import { useHabitStore } from "@/store/habitStore";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Palette, X } from "lucide-react";

interface ThemeStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const themes = [
    { id: "default", name: "Deep Space", level: 1, color: "bg-blue-900" },
    { id: "sunset", name: "Sunset Drive", level: 5, color: "bg-orange-600" },
    { id: "cyberpunk", name: "Neon City", level: 10, color: "bg-pink-600" },
    { id: "monochrome", name: "Noir", level: 20, color: "bg-slate-800" },
];

export default function ThemeStoreModal({ isOpen, onClose }: ThemeStoreModalProps) {
    const { stats, setTheme } = useHabitStore();
    const { currentTheme, unlockedThemes } = stats;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <header className="mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Palette className="w-6 h-6 text-purple-500" />
                            Theme Store
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Unlock new looks by leveling up!
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {themes.map((theme) => {
                            const isUnlocked = unlockedThemes.includes(theme.id);
                            const isActive = currentTheme === theme.id;

                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => isUnlocked && setTheme(theme.id)}
                                    disabled={!isUnlocked}
                                    className={`relative group overflow-hidden rounded-xl border-2 transition-all p-4 text-left h-32 flex flex-col justify-between ${isActive
                                        ? "border-green-500 bg-slate-800/50"
                                        : "border-slate-800 bg-slate-900 hover:border-slate-600"
                                        }`}
                                >
                                    {/* Theme Preview Gradient or Color */}
                                    <div className={`absolute inset-0 opacity-20 ${theme.color} group-hover:opacity-30 transition-opacity`} />

                                    <div className="relative z-10 flex justify-between items-start w-full">
                                        <span className="font-bold text-lg">{theme.name}</span>
                                        {isActive && <Check className="w-5 h-5 text-green-500" />}
                                        {!isUnlocked && <Lock className="w-5 h-5 text-slate-500" />}
                                    </div>

                                    <div className="relative z-10">
                                        {isUnlocked ? (
                                            <span className="text-xs text-green-400 font-medium bg-green-900/30 px-2 py-1 rounded">
                                                Unlocked
                                            </span>
                                        ) : (
                                            <span className="text-xs text-red-400 font-medium bg-red-900/30 px-2 py-1 rounded flex items-center gap-1 w-fit">
                                                Lvl {theme.level} Req.
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
