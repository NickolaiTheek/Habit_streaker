"use client";

import useSound from "@/hooks/useSound";
import { useHabitStore, type Habit } from "@/store/habitStore";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FocusTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    habit: Habit | undefined;
    onComplete: () => void;
}

const PRESETS = [5, 15 * 60, 25 * 60, 45 * 60, 60 * 60]; // 5s debug, 15m, 25m, 45m, 60m

export default function FocusTimerModal({
    isOpen,
    onClose,
    habit,
    onComplete,
}: FocusTimerModalProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [initialTime, setInitialTime] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const { playSfx } = useSound();
    const { toggleHabit } = useHabitStore();

    // Use a ref for the interval to clear it properly
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Reset state when opening
            setIsActive(false);
            setTimeLeft(25 * 60);
            setInitialTime(25 * 60);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            handleComplete();
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);

    const handleComplete = () => {
        setIsActive(false);
        playSfx("levelUp"); // Or a specific timer sound

        // Auto-complete the habit if not already done
        if (habit && !habit.isCompletedToday) {
            toggleHabit(habit.id);
            onComplete(); // Triggers confetti in parent
        }

        onClose();
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const setPreset = (seconds: number) => {
        setIsActive(false);
        setInitialTime(seconds);
        setTimeLeft(seconds);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = ((initialTime - timeLeft) / initialTime) * 100;

    if (!isOpen || !habit) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-strong w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="text-4xl mb-2">{habit.icon}</div>
                        <h2 className="text-2xl font-bold">{habit.name}</h2>
                        <p className="text-slate-400">Stay focused!</p>
                    </div>

                    {/* Timer Display */}
                    <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                        {/* SVG Progress Circle */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-slate-800"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progress) / 100}
                                className="text-purple-500 transition-all duration-1000 ease-linear"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-5xl font-mono font-bold tracking-wider">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <button
                            onClick={toggleTimer}
                            className="w-16 h-16 rounded-full bg-white text-purple-900 flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isActive ? (
                                <Pause className="w-8 h-8 fill-current" />
                            ) : (
                                <Play className="w-8 h-8 fill-current ml-1" />
                            )}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {PRESETS.map((seconds) => (
                            <button
                                key={seconds}
                                onClick={() => setPreset(seconds)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${initialTime === seconds
                                        ? "bg-purple-500 text-white"
                                        : "bg-white/5 hover:bg-white/10 text-slate-400"
                                    }`}
                            >
                                {seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
