"use client"

import { useRef, useEffect, useMemo, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Lock, Star, ChevronRight } from "lucide-react"
import { lessonCatalog, type LessonCatalogItem } from "@/lib/lesson-catalog"
import { IgelMascot } from "@/components/igel/igel-mascot"
import type { LearnerProfile } from "@/lib/use-learner-profile"
import { cn } from "@/lib/utils"

/* ── Unit groups ── */
interface UnitGroup {
  name: string
  color: string
  borderColor: string
  lessons: LessonCatalogItem[]
}

const UNIT_STYLES = [
  { color: "#1A8A7D", border: "#147A6E" },
  { color: "#E8993E", border: "#D08530" },
  { color: "#E85D4A", border: "#D04A38" },
  { color: "#0F1A2E", border: "#0A1220" },
  { color: "#23B5A5", border: "#1A9A8C" },
]

function buildUnits(): UnitGroup[] {
  const order: string[] = []
  const map = new Map<string, LessonCatalogItem[]>()
  for (const lesson of lessonCatalog) {
    if (!map.has(lesson.group)) {
      order.push(lesson.group)
      map.set(lesson.group, [])
    }
    map.get(lesson.group)!.push(lesson)
  }
  return order.map((name, i) => ({
    name,
    color: UNIT_STYLES[i % UNIT_STYLES.length].color,
    borderColor: UNIT_STYLES[i % UNIT_STYLES.length].border,
    lessons: map.get(name)!,
  }))
}

/* ── S-curve positioning ── */
type Column = "left" | "center" | "right"
const S_PATTERN: Column[] = ["center", "right", "center", "left", "center", "right"]

function getColumn(flatIndex: number): Column {
  return S_PATTERN[flatIndex % S_PATTERN.length]
}

const colClass: Record<Column, string> = {
  left: "col-start-1 justify-self-center",
  center: "col-start-2 justify-self-center",
  right: "col-start-3 justify-self-center",
}

/* ── Node status ── */
type NodeStatus = "completed" | "current" | "locked"

function getNodeStatus(
  lessonId: string,
  completedLessons: string[],
  flatIndex: number,
  firstIncompleteIdx: number
): NodeStatus {
  if (completedLessons.includes(lessonId)) return "completed"
  if (flatIndex === firstIncompleteIdx) return "current"
  return "locked"
}

/* ── Props ── */
interface PathwayProps {
  completedLessons: string[]
  onStartLesson: (lessonId: string) => void
  onPracticeLesson: (lessonId: string) => void
  profile: LearnerProfile
}

export function Pathway({ completedLessons, onStartLesson, onPracticeLesson, profile }: PathwayProps) {
  const units = useMemo(buildUnits, [])
  const currentNodeRef = useRef<HTMLDivElement>(null)
  const [tappedLocked, setTappedLocked] = useState<string | null>(null)

  const allLessons = useMemo(() => units.flatMap((u) => u.lessons), [units])
  const firstIncompleteIdx = useMemo(() => {
    const idx = allLessons.findIndex((l) => !completedLessons.includes(l.id))
    return idx === -1 ? allLessons.length : idx
  }, [allLessons, completedLessons])

  /* Scroll current node into view */
  useEffect(() => {
    const timer = setTimeout(() => {
      currentNodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleLockedTap = useCallback((id: string) => {
    setTappedLocked(id)
    setTimeout(() => setTappedLocked(null), 800)
  }, [])

  /* Personalized greeting based on profile */
  const greeting = profile.purpose === "work" ? "Ready for the office?" :
    profile.purpose === "travel" ? "Where to next?" :
    profile.purpose === "study" ? "Time to study!" :
    profile.purpose === "relocation" ? "Setting up in Germany" :
    "Let's keep going!"

  let flatIndex = 0

  return (
    <div className="relative w-full max-w-sm mx-auto px-3 pb-8">
      {/* Personalized greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
      </motion.div>

      {units.map((unit, unitIdx) => (
        <div key={unit.name}>
          {/* Unit banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.08 }}
            className="my-5 rounded-2xl px-4 py-3 text-center border-b-4"
            style={{ backgroundColor: unit.color, borderBottomColor: unit.borderColor }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Unit {unitIdx + 1}
            </p>
            <h2 className="text-base font-extrabold text-white">{unit.name}</h2>
          </motion.div>

          {/* S-curve grid */}
          <div className="grid grid-cols-3 gap-y-5 relative">
            {unit.lessons.map((lesson) => {
              const idx = flatIndex
              flatIndex++
              const col = getColumn(idx)
              const status = getNodeStatus(lesson.id, completedLessons, idx, firstIncompleteIdx)
              const isCurrent = status === "current"

              return (
                <div
                  key={lesson.id}
                  className={cn("flex flex-col items-center gap-1.5", colClass[col])}
                  ref={isCurrent ? currentNodeRef : undefined}
                >
                  {/* Igel peeking above current node */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-0.5"
                    >
                      <IgelMascot mood="happy" size={28} breathing />
                    </motion.div>
                  )}

                  {/* Node circle */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: idx * 0.04 + unitIdx * 0.12,
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    whileTap={status !== "locked" ? { scale: 0.88 } : {}}
                    onClick={() => {
                      if (status === "completed") onPracticeLesson(lesson.id)
                      else if (status === "current") onStartLesson(lesson.id)
                      else handleLockedTap(lesson.id)
                    }}
                    className={cn(
                      "relative w-[52px] h-[52px] rounded-full flex items-center justify-center transition-shadow",
                      "border-[3px] border-b-[5px]",
                      status === "completed" && "bg-primary border-primary/80 text-primary-foreground shadow-md",
                      status === "current" && "bg-primary border-primary/80 text-primary-foreground shadow-xl animate-node-glow",
                      status === "locked" && "bg-secondary border-border text-muted-foreground"
                    )}
                    aria-label={`${lesson.title} - ${status}`}
                  >
                    {status === "completed" && <Check className="w-5 h-5 stroke-[3px]" />}
                    {status === "current" && <Star className="w-5 h-5 fill-current" />}
                    {status === "locked" && <Lock className="w-4 h-4" />}
                  </motion.button>

                  {/* Lesson label */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 + 0.15 }}
                    className={cn(
                      "text-[10px] font-semibold text-center leading-tight max-w-[76px]",
                      status === "locked" ? "text-muted-foreground/60" : "text-foreground"
                    )}
                  >
                    {lesson.title}
                  </motion.p>

                  {/* Locked tooltip */}
                  <AnimatePresence>
                    {tappedLocked === lesson.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        className="absolute -bottom-7 bg-dm-midnight text-white text-[9px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg"
                      >
                        Complete previous lessons first
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Start button for current node */}
                  {isCurrent && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 }}
                      onClick={() => onStartLesson(lesson.id)}
                      className="mt-1 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-xl shadow-md border-b-[3px] border-primary/70 active:border-b-0 active:mt-[7px] transition-all"
                    >
                      START
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* All done celebration */}
      {firstIncompleteIdx >= allLessons.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="flex flex-col items-center gap-3 mt-10"
        >
          <IgelMascot mood="celebrate" size={80} breathing />
          <p className="text-lg font-extrabold text-primary text-center">
            All lessons completed!
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Keep practicing to master your German skills.
          </p>
        </motion.div>
      )}
    </div>
  )
}
