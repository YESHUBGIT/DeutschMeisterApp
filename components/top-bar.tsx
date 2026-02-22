"use client"

import { motion } from "framer-motion"
import { Flame, Heart } from "lucide-react"
import { IgelMascot } from "@/components/igel/igel-mascot"
import type { IgelMood } from "@/components/igel/igel-mascot"
import { cn } from "@/lib/utils"

interface TopBarProps {
  xp: number
  level: number
  progress: number
  streak: number
  hearts: number
  maxHearts: number
}

function getMoodFromHearts(hearts: number): IgelMood {
  if (hearts >= 4) return "happy"
  if (hearts >= 2) return "idle"
  if (hearts >= 1) return "sad"
  return "sad"
}

export function TopBar({ xp, level, progress, streak, hearts, maxHearts }: TopBarProps) {
  const mood = getMoodFromHearts(hearts)

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border pt-safe">
      <div className="flex items-center gap-3 px-4 py-2 max-w-lg mx-auto">
        {/* Mascot */}
        <div className="shrink-0">
          <IgelMascot mood={mood} size={36} breathing />
        </div>

        {/* XP bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-bold text-foreground">
              Level {level}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {xp} XP
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-duo-green"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 shrink-0">
          <div className={cn(streak > 0 && "animate-fire-pulse")}>
            <Flame
              className={cn(
                "w-5 h-5",
                streak > 0 ? "text-duo-gold fill-duo-gold" : "text-muted-foreground"
              )}
            />
          </div>
          <span className={cn(
            "text-sm font-bold tabular-nums",
            streak > 0 ? "text-duo-gold" : "text-muted-foreground"
          )}>
            {streak}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1 shrink-0">
          <Heart
            className={cn(
              "w-5 h-5",
              hearts <= 2 ? "text-duo-red fill-duo-red animate-heart-shake" : "text-duo-red fill-duo-red"
            )}
          />
          <span className={cn(
            "text-sm font-bold tabular-nums",
            hearts <= 2 ? "text-duo-red" : "text-foreground"
          )}>
            {hearts}/{maxHearts}
          </span>
        </div>
      </div>
    </header>
  )
}
