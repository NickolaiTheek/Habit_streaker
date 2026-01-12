"use client";

import Spline from "@splinetool/react-spline";

interface AddHabitButton3DProps {
    onClick: () => void;
    className?: string;
}

export default function AddHabitButton3D({ onClick, className = "" }: AddHabitButton3DProps) {
    return (
        <button
            onClick={onClick}
            className={`relative w-16 h-16 group ${className} transition-transform hover:scale-110 active:scale-95`}
            aria-label="Add Habit"
        >
            {/* 3D Scene Container */}
            <div className="absolute inset-0 z-10 rounded-full overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-slate-800 border border-slate-700">
                {/* Using a placeholder Spline scene (a simple shape) - User needs to replace this with a '+' or specific button model */}
                <Spline
                    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                    className="w-full h-full pointer-events-none"
                />

                {/* Overlay for better clickability if the canvas steals events, or use pointer-events-none on Spline if visual only */}
                <div className="absolute inset-0 bg-transparent" />
            </div>

            {/* Fallback Icon / Label (Optional, strictly for accessibility or loading state) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <span className="text-white font-bold text-xs">ADD</span>
            </div>
        </button>
    );
}
