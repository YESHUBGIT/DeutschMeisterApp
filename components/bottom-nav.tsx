"use client"

import { motion } from "framer-motion"
import { Home, Dumbbell, BookOpen, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

export type AppTab = "home" | "practice" | "review" | "tutor" | "profile"

const tabs: { id: AppTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Learn", icon: Home },
  { id: "practice", label: "Practice", icon: Dumbbell },
  { id: "review", label: "Review", icon: BookOpen },
  { id: "tutor", label: "Tutor", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
]

interface BottomNavProps {
  active: AppTab
  onChange: (tab: AppTab) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border pb-safe"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-2.5 px-3 flex-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute -top-px left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Icon className={cn("w-5 h-5 transition-all", isActive && "stroke-[2.5px]")} />
              </motion.div>
              <span className={cn(
                "text-[10px] font-semibold leading-tight",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
