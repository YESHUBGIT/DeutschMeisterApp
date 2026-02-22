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
  return "sad"
}

export function TopBar({ xp, level, progress, streak, hearts, maxHearts }: TopBarProps) {
  const mood = getMoodFromHearts(hearts)

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border pt-safe">
      <div className="flex items-center gap-3 px-4 py-2.5 max-w-lg mx-auto">
        {/* Mascot */}
        <div className="shrink-0">
          <IgelMascot mood={mood} size={34} breathing />
        </div>

        {/* XP bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-bold text-foreground">Lvl {level}</span>
            <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">{xp} XP</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 shrink-0">
          <div className={cn(streak > 0 && "animate-streak-pulse")}>
            <Flame className={cn(
              "w-[18px] h-[18px]",
              streak > 0 ? "text-dm-amber fill-dm-amber" : "text-muted-foreground"
            )} />
          </div>
          <span className={cn(
            "text-sm font-bold tabular-nums",
            streak > 0 ? "text-dm-amber" : "text-muted-foreground"
          )}>
            {streak}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1 shrink-0">
          <Heart className={cn(
            "w-[18px] h-[18px]",
            hearts <= 2 ? "text-dm-coral fill-dm-coral animate-heart-shake" : "text-dm-coral fill-dm-coral"
          )} />
          <span className={cn(
            "text-sm font-bold tabular-nums",
            hearts <= 2 ? "text-dm-coral" : "text-foreground"
          )}>
            {hearts}
          </span>
        </div>
      </div>
    </header>
  )
}
