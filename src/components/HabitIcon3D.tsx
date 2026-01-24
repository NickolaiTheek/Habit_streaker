import React, { Suspense } from "react";
import SplineScene from "./SplineScene";

interface HabitIcon3DProps {
  icon: string;
  className?: string;
}

// Map of emojis to Spline scene URLs
// TODO: Replace these with actual specific 3D model URLs
const HABIT_SCENE_MAP: Record<string, string> = {
  // Using the placeholder URL for demonstration. 
  // In production, these would be unique URLs for a Book, Dumbbell, etc.
  "📚": "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode", 
  "💪": "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  "🧘": "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  "💧": "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
};

export default function HabitIcon3D({ icon, className = "" }: HabitIcon3DProps) {
  const sceneUrl = HABIT_SCENE_MAP[icon];

  if (sceneUrl) {
    return (
      <div className={`relative w-12 h-12 ${className}`}>
        <Suspense fallback={<div className="text-2xl">{icon}</div>}>
          <SplineScene scene={sceneUrl} className="w-full h-full" />
        </Suspense>
      </div>
    );
  }

  // Fallback: 3D-styled card for the emoji
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 shadow-lg ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "500px",
      }}
    >
      <span
        className="text-2xl drop-shadow-md transform transition-transform duration-500 hover:scale-110 hover:rotate-12"
        style={{ transform: "translateZ(20px)" }}
      >
        {icon}
      </span>
    </div>
  );
}
