"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Flame, Heart, BookOpen, Zap, Table, GraduationCap, ArrowLeft, Volume2, VolumeX, ChevronRight } from "lucide-react"
import { IgelMascot } from "@/components/igel/igel-mascot"
import { CoreTab } from "@/components/tabs/core-tab"
import { CheatTab } from "@/components/tabs/cheat-tab"
import { VerbConjugationsTab } from "@/components/tabs/verb-conjugations-tab"
import { useSoundSettings } from "@/lib/use-sound-settings"
import { cn } from "@/lib/utils"

interface ProfileScreenProps {
  xp: number
  level: number
  streak: number
  hearts: number
  maxHearts: number
  completedCount: number
  totalLessons: number
}

type SubPage = null | "grammar" | "cheatsheets" | "verbs"

export function ProfileScreen({
  xp, level, streak, hearts, maxHearts, completedCount, totalLessons,
}: ProfileScreenProps) {
  const [subPage, setSubPage] = useState<SubPage>(null)
  const { enabled, toggle } = useSoundSettings()

  const stats = [
    { icon: Trophy, label: "Total XP", value: xp.toLocaleString(), color: "text-duo-gold", bg: "bg-duo-gold/10" },
    { icon: GraduationCap, label: "Level", value: level, color: "text-duo-green", bg: "bg-duo-green/10" },
    { icon: Flame, label: "Day Streak", value: streak, color: "text-duo-gold", bg: "bg-duo-gold/10" },
    { icon: Heart, label: "Hearts", value: `${hearts}/${maxHearts}`, color: "text-duo-red", bg: "bg-duo-red/10" },
    { icon: BookOpen, label: "Completed", value: `${completedCount}/${totalLessons}`, color: "text-duo-blue", bg: "bg-duo-blue/10" },
  ]

  const links = [
    { id: "grammar" as const, icon: BookOpen, label: "Grammar Reference", desc: "Core German grammar rules" },
    { id: "cheatsheets" as const, icon: Zap, label: "Cheat Sheets", desc: "Quick lookup tables" },
    { id: "verbs" as const, icon: Table, label: "Verb Conjugations", desc: "All verb tenses & forms" },
  ]

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <AnimatePresence mode="wait">
        {subPage ? (
          <motion.div
            key={subPage}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={() => setSubPage(null)}
              className="flex items-center gap-2 text-duo-green font-bold text-sm mb-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>
            <div className="pb-8">
              {subPage === "grammar" && <CoreTab />}
              {subPage === "cheatsheets" && <CheatTab />}
              {subPage === "verbs" && <VerbConjugationsTab />}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Mascot + greeting */}
            <div className="flex flex-col items-center pt-4 pb-6">
              <IgelMascot
                mood={streak >= 3 ? "cheering" : streak >= 1 ? "happy" : "idle"}
                size={80}
                breathing
              />
              <h2 className="mt-3 text-xl font-extrabold text-foreground">
                Your Progress
              </h2>
              <p className="text-sm text-muted-foreground">
                Keep learning every day!
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl bg-card border-2 border-border",
                    i === 0 && "col-span-2"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick links */}
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Reference
            </h3>
            <div className="flex flex-col gap-2 mb-6">
              {links.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onClick={() => setSubPage(link.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border-2 border-border text-left hover:border-duo-green/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-duo-green/10 flex items-center justify-center">
                    <link.icon className="w-5 h-5 text-duo-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-duo-green transition-colors" />
                </motion.button>
              ))}
            </div>

            {/* Sound toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-3 w-full p-3 rounded-2xl bg-card border-2 border-border mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                {enabled ? (
                  <Volume2 className="w-5 h-5 text-foreground" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-foreground">Sound Effects</p>
                <p className="text-xs text-muted-foreground">{enabled ? "On" : "Off"}</p>
              </div>
              <div className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                enabled ? "bg-duo-green" : "bg-secondary"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  enabled ? "translate-x-[22px]" : "translate-x-0.5"
                )} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
