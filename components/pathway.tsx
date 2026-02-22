"use client"

import { useRef, useEffect, useMemo, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Lock, Star, Crown, ChevronRight } from "lucide-react"
import { lessonCatalog, type LessonCatalogItem } from "@/lib/lesson-catalog"
import { IgelMascot } from "@/components/igel/igel-mascot"
import { cn } from "@/lib/utils"

/* ── Group lessons by their catalog "group" field ── */
interface UnitGroup {
  name: string
  color: string
  lessons: LessonCatalogItem[]
}

const UNIT_COLORS = ["#58CC02", "#1CB0F6", "#CE82FF", "#FF9600", "#FF4B4B"]

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
    color: UNIT_COLORS[i % UNIT_COLORS.length],
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
}

export function Pathway({ completedLessons, onStartLesson, onPracticeLesson }: PathwayProps) {
  const units = useMemo(buildUnits, [])
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentNodeRef = useRef<HTMLDivElement>(null)
  const [tappedLocked, setTappedLocked] = useState<string | null>(null)

  /* Flatten lessons for index tracking */
  const allLessons = useMemo(() => units.flatMap((u) => u.lessons), [units])
  const firstIncompleteIdx = useMemo(
    () => {
      const idx = allLessons.findIndex((l) => !completedLessons.includes(l.id))
      return idx === -1 ? allLessons.length : idx
    },
    [allLessons, completedLessons]
  )

  /* Scroll current node into view on mount */
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

  let flatIndex = 0

  return (
    <div ref={scrollRef} className="relative w-full max-w-sm mx-auto px-2 pb-8">
      {units.map((unit, unitIdx) => (
        <div key={unit.name}>
          {/* Unit banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.1 }}
            className="my-6 rounded-2xl px-4 py-3 text-center"
            style={{ backgroundColor: unit.color }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              Unit {unitIdx + 1}
            </p>
            <h2 className="text-lg font-extrabold text-white">{unit.name}</h2>
          </motion.div>

          {/* S-curve grid */}
          <div className="grid grid-cols-3 gap-y-4 relative">
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
                  {/* Connector line from previous node */}
                  {idx > 0 && (
                    <div className="absolute" aria-hidden="true" />
                  )}

                  {/* Igel peeking behind current node */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-1"
                    >
                      <IgelMascot mood="happy" size={28} breathing />
                    </motion.div>
                  )}

                  {/* Node circle */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: idx * 0.05 + unitIdx * 0.15,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    whileTap={status !== "locked" ? { scale: 0.9 } : {}}
                    onClick={() => {
                      if (status === "completed") onPracticeLesson(lesson.id)
                      else if (status === "current") onStartLesson(lesson.id)
                      else handleLockedTap(lesson.id)
                    }}
                    className={cn(
                      "relative w-14 h-14 rounded-full flex items-center justify-center transition-shadow",
                      "border-4 border-b-[6px]",
                      status === "completed" && "bg-duo-green border-duo-green-dark text-white shadow-lg",
                      status === "current" && "bg-duo-green border-duo-green-dark text-white shadow-xl animate-node-glow",
                      status === "locked" && "bg-secondary border-border text-muted-foreground"
                    )}
                    aria-label={`${lesson.title} - ${status}`}
                  >
                    {status === "completed" && (
                      completedLessons.indexOf(lesson.id) === 0 ? (
                        <Crown className="w-6 h-6" />
                      ) : (
                        <Check className="w-6 h-6 stroke-[3px]" />
                      )
                    )}
                    {status === "current" && <Star className="w-6 h-6 fill-white" />}
                    {status === "locked" && <Lock className="w-5 h-5" />}

                    {/* XP badge on completed */}
                    {status === "completed" && (
                      <span className="absolute -top-1 -right-1 bg-duo-gold text-[8px] font-bold text-foreground rounded-full w-5 h-5 flex items-center justify-center shadow">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </motion.button>

                  {/* Lesson label */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 + 0.2 }}
                    className={cn(
                      "text-[11px] font-semibold text-center leading-tight max-w-[80px]",
                      status === "locked" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {lesson.title}
                  </motion.p>

                  {/* Locked tooltip */}
                  <AnimatePresence>
                    {tappedLocked === lesson.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute -bottom-8 bg-foreground text-background text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap z-10"
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
                      transition={{ delay: 0.3 }}
                      onClick={() => onStartLesson(lesson.id)}
                      className="mt-1 flex items-center gap-1 bg-duo-green text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-md border-b-[3px] border-duo-green-dark active:border-b-0 active:mt-[7px] transition-all"
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

      {/* End celebration if all done */}
      {firstIncompleteIdx >= allLessons.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="flex flex-col items-center gap-3 mt-10"
        >
          <IgelMascot mood="celebrate" size={80} breathing />
          <p className="text-lg font-extrabold text-duo-green text-center">
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
