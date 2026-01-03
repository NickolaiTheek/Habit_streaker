"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, Star } from "lucide-react";

interface RewardAnimationProps {
  type: "confetti" | "trophy" | "star";
}

export default function RewardAnimation({ type }: RewardAnimationProps) {
  const confettiCount = 50;
  const confettiColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {type === "confetti" && (
        <>
          {Array.from({ length: confettiCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
                y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: typeof window !== "undefined"
                  ? Math.random() * window.innerWidth
                  : 0,
                y: typeof window !== "undefined"
                  ? Math.random() * window.innerHeight
                  : 0,
                opacity: 0,
                scale: Math.random() * 2 + 0.5,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  confettiColors[Math.floor(Math.random() * confettiColors.length)],
              }}
            />
          ))}
        </>
      )}

      {type === "trophy" && (
        <motion.div
          initial={{ scale: 0, y: 100, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 1],
            y: [100, -50, 0],
            opacity: [0, 1, 1],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 1, times: [0, 0.6, 1] }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <Trophy className="w-32 h-32 text-yellow-500" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
          />
        </motion.div>
      )}

      {type === "star" && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
                y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x:
                  typeof window !== "undefined"
                    ? window.innerWidth / 2 +
                      Math.cos((i / 20) * Math.PI * 2) * 300
                    : 0,
                y:
                  typeof window !== "undefined"
                    ? window.innerHeight / 2 +
                      Math.sin((i / 20) * Math.PI * 2) * 300
                    : 0,
                scale: [0, 2, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              rotate: [0, 360, 720],
            }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Star className="w-24 h-24 text-yellow-400 fill-yellow-400" />
          </motion.div>
        </>
      )}
    </div>
  );
}
