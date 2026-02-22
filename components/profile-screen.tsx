"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy, Flame, Heart, BookOpen, Zap, Table, GraduationCap,
  ArrowLeft, Volume2, VolumeX, ChevronRight, RotateCcw,
} from "lucide-react"
import { IgelMascot } from "@/components/igel/igel-mascot"
import { CoreTab } from "@/components/tabs/core-tab"
import { CheatTab } from "@/components/tabs/cheat-tab"
import { VerbConjugationsTab } from "@/components/tabs/verb-conjugations-tab"
import { useSoundSettings } from "@/lib/use-sound-settings"
import type { LearnerProfile } from "@/lib/use-learner-profile"
import { cn } from "@/lib/utils"

interface ProfileScreenProps {
  xp: number
  level: number
  streak: number
  hearts: number
  maxHearts: number
  completedCount: number
  totalLessons: number
  profile: LearnerProfile
  onResetProfile?: () => void
}

type SubPage = null | "grammar" | "cheatsheets" | "verbs"

export function ProfileScreen({
  xp, level, streak, hearts, maxHearts, completedCount, totalLessons, profile, onResetProfile,
}: ProfileScreenProps) {
  const [subPage, setSubPage] = useState<SubPage>(null)
  const { enabled, toggle } = useSoundSettings()

  const stats = [
    { icon: Trophy, label: "Total XP", value: xp.toLocaleString(), color: "text-dm-amber", bg: "bg-dm-amber/10" },
    { icon: GraduationCap, label: "Level", value: level, color: "text-primary", bg: "bg-primary/10" },
    { icon: Flame, label: "Day Streak", value: streak, color: "text-dm-amber", bg: "bg-dm-amber/10" },
    { icon: Heart, label: "Hearts", value: `${hearts}/${maxHearts}`, color: "text-dm-coral", bg: "bg-dm-coral/10" },
    { icon: BookOpen, label: "Completed", value: `${completedCount}/${totalLessons}`, color: "text-primary", bg: "bg-primary/10" },
  ]

  const links = [
    { id: "grammar" as const, icon: BookOpen, label: "Grammar Reference", desc: "Core German grammar rules" },
    { id: "cheatsheets" as const, icon: Zap, label: "Cheat Sheets", desc: "Quick lookup tables" },
    { id: "verbs" as const, icon: Table, label: "Verb Conjugations", desc: "All verb tenses & forms" },
  ]

  const purposeLabel = {
    work: "Work", travel: "Travel", study: "Study", relocation: "Relocation",
    exams: "Exams", daily: "Daily Life", other: "General",
  }

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
              className="flex items-center gap-2 text-primary font-bold text-sm mb-4 py-2"
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
            <div className="flex flex-col items-center pt-4 pb-5">
              <IgelMascot
                mood={streak >= 3 ? "cheering" : streak >= 1 ? "happy" : "idle"}
                size={72}
                breathing
              />
              <h2 className="mt-3 text-xl font-bold text-foreground">Your Progress</h2>
              {profile.purpose && (
                <p className="text-sm text-muted-foreground">
                  Learning for {purposeLabel[profile.purpose] ?? "fun"} | {profile.level?.toUpperCase() ?? "New"}
                </p>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl bg-card border border-border",
                    i === 0 && "col-span-2"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-base font-bold text-foreground">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reference links */}
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Reference
            </h3>
            <div className="flex flex-col gap-2 mb-5">
              {links.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  onClick={() => setSubPage(link.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border text-left hover:border-primary/40 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <link.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{link.label}</p>
                    <p className="text-[11px] text-muted-foreground">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>
              ))}
            </div>

            {/* Settings */}
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Settings
            </h3>
            <div className="flex flex-col gap-2 mb-6">
              {/* Sound toggle */}
              <button
                onClick={toggle}
                className="flex items-center gap-3 w-full p-3 rounded-2xl bg-card border border-border"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  {enabled ? <Volume2 className="w-4 h-4 text-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-foreground">Sound Effects</p>
                </div>
                <div className={cn(
                  "w-10 h-[22px] rounded-full transition-colors relative",
                  enabled ? "bg-primary" : "bg-secondary"
                )}>
                  <div className={cn(
                    "absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform",
                    enabled ? "translate-x-[20px]" : "translate-x-[2px]"
                  )} />
                </div>
              </button>

              {/* Reset onboarding */}
              {onResetProfile && (
                <button
                  onClick={onResetProfile}
                  className="flex items-center gap-3 w-full p-3 rounded-2xl bg-card border border-border hover:border-dm-coral/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-dm-coral/10 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-dm-coral" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-foreground">Restart Onboarding</p>
                    <p className="text-[11px] text-muted-foreground">Change your learning preferences</p>
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
