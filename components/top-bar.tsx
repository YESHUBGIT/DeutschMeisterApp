"use client"

import { motion } from "framer-motion"
import { IgelMascot } from "@/components/igel/igel-mascot"
import type { IgelMood } from "@/components/igel/igel-mascot"

interface TopBarProps {
  completedCount: number
  totalLessons: number
  overallProgress: number
  currentModule: string
  activeDays: number
}

function getMood(progress: number): IgelMood {
  if (progress >= 0.8) return "cheering"
  if (progress >= 0.4) return "happy"
  if (progress > 0) return "idle"
  return "thinking"
}

export function TopBar({ completedCount, totalLessons, overallProgress, currentModule, activeDays }: TopBarProps) {
  const mood = getMood(overallProgress)

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border pt-safe">
      <div className="flex items-center gap-3 px-4 py-2.5 max-w-lg mx-auto">
        {/* Mascot */}
        <div className="shrink-0">
          <IgelMascot mood={mood} size={32} breathing />
        </div>

        {/* Progress bar + module label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold text-foreground truncate">{currentModule}</span>
            <span className="text-[10px] font-medium text-muted-foreground tabular-nums shrink-0 ml-2">
              {completedCount}/{totalLessons}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(1, overallProgress * 100)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {/* Active days */}
        <div className="flex items-center gap-1 shrink-0 pl-1">
          <div className="w-6 h-6 rounded-lg bg-dm-amber/15 flex items-center justify-center">
            <span className="text-[10px] font-bold text-dm-amber">{activeDays}</span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">
            {activeDays === 1 ? "day" : "days"}
          </span>
        </div>
      </div>
    </header>
  )
}
