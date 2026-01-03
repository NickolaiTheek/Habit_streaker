"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  unit: string;
  color: string;
}

export default function StatsCard({ icon, title, value, unit, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="glass-strong rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-12 -mt-12" />
      
      <div className="relative z-10">
        <div className={cn("mb-3", color)}>{icon}</div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold"
          >
            {value}
          </motion.p>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}
