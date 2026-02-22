"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase, Plane, GraduationCap, Home, ClipboardCheck, Coffee,
  Sparkles, Clock, MessageCircle, BookOpen, Languages, Globe,
  ChevronRight, ChevronLeft, MapPin,
} from "lucide-react"
import { IgelMascot } from "@/components/igel/igel-mascot"
import type {
  Purpose, Level, TimeCommitment, LearningStyle, Region,
} from "@/lib/use-learner-profile"
import { cn } from "@/lib/utils"

/* ── Step definitions ── */
interface Option<T extends string> {
  value: T
  label: string
  desc?: string
  icon: typeof Briefcase
}

const purposeOptions: Option<Purpose>[] = [
  { value: "work", label: "Work", desc: "Office, meetings, emails", icon: Briefcase },
  { value: "travel", label: "Travel", desc: "Navigate, order, explore", icon: Plane },
  { value: "study", label: "Study", desc: "University, academic", icon: GraduationCap },
  { value: "relocation", label: "Relocation", desc: "Moving to Germany/AT/CH", icon: Home },
  { value: "exams", label: "Exams", desc: "Goethe / TELC prep", icon: ClipboardCheck },
  { value: "daily", label: "Daily Life", desc: "Everyday conversations", icon: Coffee },
]

const levelOptions: Option<Level>[] = [
  { value: "new", label: "Complete Beginner", desc: "I know nothing", icon: Sparkles },
  { value: "a1", label: "A1 - Beginner", desc: "Basic phrases", icon: Languages },
  { value: "a2", label: "A2 - Elementary", desc: "Simple conversations", icon: Languages },
  { value: "b1", label: "B1 - Intermediate", desc: "Everyday topics", icon: Languages },
  { value: "b2", label: "B2 - Upper Int.", desc: "Complex discussions", icon: Languages },
  { value: "unsure", label: "Not Sure", desc: "Help me figure it out", icon: Sparkles },
]

const timeOptions: Option<TimeCommitment>[] = [
  { value: "5", label: "5 min / day", desc: "Quick daily bite", icon: Clock },
  { value: "10", label: "10 min / day", desc: "Steady progress", icon: Clock },
  { value: "20", label: "20 min / day", desc: "Focused learning", icon: Clock },
  { value: "45", label: "45+ min / day", desc: "Intensive study", icon: Clock },
]

const styleOptions: Option<LearningStyle>[] = [
  { value: "speaking", label: "More Speaking", desc: "Dialogues & pronunciation", icon: MessageCircle },
  { value: "grammar", label: "Grammar Clarity", desc: "Rules & structure", icon: BookOpen },
  { value: "vocab", label: "More Vocabulary", desc: "Words & phrases first", icon: Languages },
  { value: "balanced", label: "Balanced Mix", desc: "A bit of everything", icon: Sparkles },
]

const regionOptions: Option<Region>[] = [
  { value: "germany", label: "Germany", desc: "Hochdeutsch focus", icon: MapPin },
  { value: "austria", label: "Austria", desc: "Austrian German", icon: MapPin },
  { value: "switzerland", label: "Switzerland", desc: "Swiss German basics", icon: Globe },
  { value: "none", label: "No Preference", desc: "Standard German", icon: Globe },
]

/* ── Onboarding Props ── */
interface OnboardingProps {
  onComplete: (answers: {
    purpose: Purpose
    level: Level
    timeCommitment: TimeCommitment
    learningStyle: LearningStyle
    region: Region
    deadline: string
  }) => void
}

const TOTAL_STEPS = 6

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-50%" : "50%", opacity: 0 }),
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)

  const [purpose, setPurpose] = useState<Purpose | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [time, setTime] = useState<TimeCommitment | null>(null)
  const [style, setStyle] = useState<LearningStyle | null>(null)
  const [region, setRegion] = useState<Region | null>(null)
  const [deadline, setDeadline] = useState("")

  const goNext = useCallback(() => {
    setDir(1)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }, [])

  const goBack = useCallback(() => {
    setDir(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const canContinue = () => {
    switch (step) {
      case 0: return !!purpose
      case 1: return !!level
      case 2: return !!time
      case 3: return !!style
      case 4: return !!region
      case 5: return true
      default: return false
    }
  }

  const handleFinish = useCallback(() => {
    if (purpose && level && time && style && region) {
      onComplete({
        purpose,
        level,
        timeCommitment: time,
        learningStyle: style,
        region,
        deadline: deadline || "none",
      })
    }
  }, [purpose, level, time, style, region, deadline, onComplete])

  const stepTitles = [
    "Why are you learning German?",
    "What's your current level?",
    "How much time per day?",
    "How do you like to learn?",
    "Which region?",
    "Any deadline?",
  ]

  const stepSubtitles = [
    "We'll personalize your lessons to match your goal.",
    "No pressure -- you can always adjust later.",
    "Even 5 minutes a day makes a big difference.",
    "We'll weight your exercises accordingly.",
    "We'll adjust vocabulary and expressions.",
    "We'll pace your plan to meet your goal.",
  ]

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Top section */}
      <div className="pt-safe px-5 pt-6 pb-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          {step > 0 && (
            <button
              onClick={goBack}
              className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground tabular-nums shrink-0">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Mascot */}
        <div className="flex justify-center mb-4">
          <IgelMascot
            mood={step === 0 ? "happy" : step === TOTAL_STEPS - 1 ? "cheering" : "thinking"}
            size={64}
            breathing
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground text-center mb-1 text-balance">
              {stepTitles[step]}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6 text-pretty">
              {stepSubtitles[step]}
            </p>

            {/* Options */}
            {step === 0 && (
              <OptionGrid options={purposeOptions} selected={purpose} onSelect={(v) => { setPurpose(v); setTimeout(goNext, 200) }} />
            )}
            {step === 1 && (
              <OptionGrid options={levelOptions} selected={level} onSelect={(v) => { setLevel(v); setTimeout(goNext, 200) }} cols={2} />
            )}
            {step === 2 && (
              <OptionGrid options={timeOptions} selected={time} onSelect={(v) => { setTime(v); setTimeout(goNext, 200) }} cols={2} />
            )}
            {step === 3 && (
              <OptionGrid options={styleOptions} selected={style} onSelect={(v) => { setStyle(v); setTimeout(goNext, 200) }} cols={2} />
            )}
            {step === 4 && (
              <OptionGrid options={regionOptions} selected={region} onSelect={(v) => { setRegion(v); setTimeout(goNext, 200) }} cols={2} />
            )}
            {step === 5 && (
              <div className="flex flex-col items-center gap-4">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full max-w-xs px-4 py-3 rounded-xl bg-card border-2 border-border text-foreground font-medium text-center focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  aria-label="Target deadline"
                />
                <button
                  onClick={() => setDeadline("")}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    !deadline ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  No specific deadline
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="px-5 pb-6 pb-safe">
        {step === TOTAL_STEPS - 1 ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleFinish}
            disabled={!canContinue()}
            className={cn(
              "w-full py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2",
              canContinue()
                ? "bg-primary text-primary-foreground shadow-lg active:scale-[0.98]"
                : "bg-secondary text-muted-foreground"
            )}
          >
            Start Learning
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <div className="h-14" /> /* Spacer -- auto-advance on tap */
        )}
      </div>
    </div>
  )
}

/* ── Reusable option grid ── */
function OptionGrid<T extends string>({
  options,
  selected,
  onSelect,
  cols = 2,
}: {
  options: Option<T>[]
  selected: T | null
  onSelect: (value: T) => void
  cols?: number
}) {
  return (
    <div className={cn("grid gap-3", cols === 2 ? "grid-cols-2" : "grid-cols-2")}>
      {options.map((opt, i) => {
        const isSelected = selected === opt.value
        const Icon = opt.icon
        return (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
              isSelected
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card hover:border-primary/30"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={cn(
                "text-sm font-bold transition-colors",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {opt.label}
              </p>
              {opt.desc && (
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {opt.desc}
                </p>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
