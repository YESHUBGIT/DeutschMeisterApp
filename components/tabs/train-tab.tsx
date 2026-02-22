"use client"

import { useMemo, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, RotateCcw, Trophy, ChevronRight, Brain, Target, Zap, BookOpen, Shuffle, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllPracticeExercises, getLessonNames, type PracticeExercise } from "@/lib/lesson-content"

/* ═══════════════════════════════════════
   Unified Practice Tab
   Merges interactive lesson exercises
   with filterable lesson tags
   ═══════════════════════════════════════ */

type ExerciseCategory = "all" | "multiple-choice" | "fill-blank" | "reorder" | "translation"

const CATEGORIES: { id: ExerciseCategory; label: string; icon: typeof Brain; desc: string }[] = [
  { id: "all",             label: "All Types",    icon: Shuffle,  desc: "Mix of every exercise type" },
  { id: "multiple-choice", label: "Quiz",         icon: Zap,      desc: "Pick the right answer" },
  { id: "fill-blank",      label: "Fill Blank",   icon: Target,   desc: "Complete the sentence" },
  { id: "reorder",         label: "Word Order",   icon: BookOpen,  desc: "Arrange words correctly" },
  { id: "translation",     label: "Translate",    icon: Brain,    desc: "Type the translation" },
]

/* ── TTS helper ── */
function speakDE(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = "de-DE"
  u.rate = 0.85
  const voices = window.speechSynthesis.getVoices()
  const de = voices.find(v => v.lang.startsWith("de"))
  if (de) u.voice = de
  window.speechSynthesis.speak(u)
}

function normalizeAnswer(s: string): string {
  return s.toLowerCase().replace(/\s+([?!.,;:])/g, "$1").replace(/\s+/g, " ").trim()
}

interface TrainTabProps {
  selectedLesson?: string
  onLessonChange?: (lessonId: string) => void
}

export function TrainTab({ selectedLesson, onLessonChange }: TrainTabProps) {
  /* ── State ── */
  const [category, setCategory] = useState<ExerciseCategory>("all")
  const [localLesson, setLocalLesson] = useState("all")
  const [exerciseStarted, setExerciseStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [reorderPicked, setReorderPicked] = useState<string[]>([])
  const [reorderPool, setReorderPool] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showHint, setShowHint] = useState(false)

  const lessonValue = selectedLesson ?? localLesson
  const handleLessonValueChange = onLessonChange ?? setLocalLesson

  /* ── Build exercise list ── */
  const allExercises = useMemo(() => getAllPracticeExercises(), [])
  const lessonNames = useMemo(() => getLessonNames(), [])

  const filtered = useMemo(() => {
    let list = allExercises
    if (lessonValue !== "all") list = list.filter(e => e.lessonId === lessonValue)
    if (category !== "all") list = list.filter(e => e.kind === category)
    return list
  }, [allExercises, lessonValue, category])

  const currentExercise: PracticeExercise | undefined = filtered[currentIdx]
  const isLast = currentIdx >= filtered.length - 1

  /* ── Counts per category ── */
  const categoryCounts = useMemo(() => {
    const base = lessonValue === "all" ? allExercises : allExercises.filter(e => e.lessonId === lessonValue)
    const counts: Record<string, number> = { all: base.length }
    for (const cat of CATEGORIES) {
      if (cat.id !== "all") counts[cat.id] = base.filter(e => e.kind === cat.id).length
    }
    return counts
  }, [allExercises, lessonValue])

  /* ── Handlers ── */
  const resetAll = useCallback(() => {
    setExerciseStarted(false)
    setCurrentIdx(0)
    setUserAnswer("")
    setSelectedOption(null)
    setReorderPicked([])
    setReorderPool([])
    setShowResult(false)
    setIsCorrect(false)
    setScore({ correct: 0, total: 0 })
    setShowHint(false)
  }, [])

  const startExercises = useCallback((cat: ExerciseCategory) => {
    setCategory(cat)
    setCurrentIdx(0)
    setScore({ correct: 0, total: 0 })
    setExerciseStarted(true)
    setShowResult(false)
    setUserAnswer("")
    setSelectedOption(null)
    setShowHint(false)
  }, [])

  /* Init reorder pool when exercise changes */
  const initReorder = useCallback((ex: PracticeExercise) => {
    if (ex.kind === "reorder" && ex.words) {
      const shuffled = [...ex.words].sort(() => Math.random() - 0.5)
      setReorderPool(shuffled)
      setReorderPicked([])
    }
  }, [])

  const checkAnswer = useCallback(() => {
    if (!currentExercise) return
    let correct = false
    const ex = currentExercise

    if (ex.kind === "translation") {
      correct = normalizeAnswer(userAnswer) === normalizeAnswer(ex.answer)
    } else if (ex.kind === "reorder") {
      correct = normalizeAnswer(reorderPicked.join(" ")) === normalizeAnswer(ex.answer)
    } else if (ex.kind === "multiple-choice" || ex.kind === "fill-blank") {
      correct = selectedOption === ex.answer
    }

    setIsCorrect(correct)
    setShowResult(true)
    setScore(p => ({ correct: correct ? p.correct + 1 : p.correct, total: p.total + 1 }))
  }, [currentExercise, userAnswer, reorderPicked, selectedOption])

  const nextExercise = useCallback(() => {
    if (isLast) return
    const nextIdx = currentIdx + 1
    setCurrentIdx(nextIdx)
    setUserAnswer("")
    setSelectedOption(null)
    setShowResult(false)
    setShowHint(false)
    const nextEx = filtered[nextIdx]
    if (nextEx) initReorder(nextEx)
  }, [isLast, currentIdx, filtered, initReorder])

  const handleLessonChange = useCallback((v: string) => {
    handleLessonValueChange(v)
    resetAll()
  }, [handleLessonValueChange, resetAll])

  /* ── Auto-init reorder when exercise starts or changes ── */
  const startWithInit = useCallback((cat: ExerciseCategory) => {
    startExercises(cat)
    // We need to find the first exercise of this category
    const base = lessonValue === "all" ? allExercises : allExercises.filter(e => e.lessonId === lessonValue)
    const list = cat === "all" ? base : base.filter(e => e.kind === cat)
    if (list[0]?.kind === "reorder" && list[0].words) {
      setReorderPool([...list[0].words].sort(() => Math.random() - 0.5))
      setReorderPicked([])
    }
  }, [startExercises, lessonValue, allExercises])

  /* ═══════════════════════════════════════
     RENDER: Category Selection
     ═══════════════════════════════════════ */
  if (!exerciseStarted) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2 py-4">
          <h1 className="text-2xl font-bold text-foreground">Practice</h1>
          <p className="text-sm text-muted-foreground">
            Sharpen your skills with exercises from your lessons
          </p>
        </div>

        {/* Lesson Filter */}
        <div className="p-3 rounded-xl bg-card border border-border">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Filter by lesson
          </label>
          <Select value={lessonValue} onValueChange={handleLessonChange}>
            <SelectTrigger className="rounded-lg bg-secondary border-border">
              <SelectValue placeholder="All Lessons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lessons</SelectItem>
              {lessonNames.map(ln => (
                <SelectItem key={ln.id} value={ln.id}>{ln.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const count = categoryCounts[cat.id] ?? 0
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => count > 0 && startWithInit(cat.id)}
                disabled={count === 0}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all space-y-2",
                  count > 0
                    ? "bg-card border-border hover:border-primary/50 cursor-pointer"
                    : "bg-card/50 border-border/50 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">{cat.label}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{cat.desc}</p>
                <p className="text-xs font-medium text-primary">{count} exercises</p>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════
     RENDER: Completion Screen
     ═══════════════════════════════════════ */
  if (showResult && isLast) {
    const pct = filtered.length > 0 ? Math.round((score.correct / filtered.length) * 100) : 0
    return (
      <div className="space-y-6 py-4">
        <motion.div
          className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Trophy className="w-10 h-10 text-primary" />
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">Practice Complete!</h2>
          <motion.p
            className={cn("text-4xl font-black tabular-nums", pct >= 70 ? "text-success" : "text-accent")}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.15 }}
          >
            {pct}%
          </motion.p>
          <p className="text-sm text-muted-foreground">
            {score.correct} of {filtered.length} correct
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={resetAll}>
            <RotateCcw className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button className="flex-1 rounded-xl font-bold" onClick={() => {
            setCurrentIdx(0)
            setScore({ correct: 0, total: 0 })
            setShowResult(false)
            setUserAnswer("")
            setSelectedOption(null)
            setShowHint(false)
            if (filtered[0]) initReorder(filtered[0])
          }}>
            <RotateCcw className="w-4 h-4 mr-1" /> Retry
          </Button>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════
     RENDER: No Exercises
     ═══════════════════════════════════════ */
  if (!currentExercise) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-lg font-bold text-foreground">No exercises found</p>
        <p className="text-sm text-muted-foreground">Try a different lesson or category.</p>
        <Button variant="outline" onClick={resetAll} className="rounded-xl">
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back
        </Button>
      </div>
    )
  }

  /* ═══════════════════════════════════════
     RENDER: Exercise
     ═══════════════════════════════════════ */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground">
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back
        </Button>
        <span className="text-xs text-muted-foreground font-medium tabular-nums">
          {currentIdx + 1} / {filtered.length}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
          {currentExercise.kind}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / filtered.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Lesson tag */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
          {currentExercise.lessonId.replace(/-/g, " ")}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIdx}-${category}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Prompt */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-semibold text-foreground leading-relaxed flex-1">{currentExercise.prompt}</p>
              {currentExercise.kind !== "translation" && (
                <button onClick={() => speakDE(currentExercise.answer)} className="shrink-0 p-1 text-muted-foreground hover:text-primary">
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {showHint && currentExercise.explanation && (
              <p className="mt-2 text-xs text-muted-foreground italic">{currentExercise.explanation}</p>
            )}
          </div>

          {/* ── Multiple Choice / Fill Blank ── */}
          {(currentExercise.kind === "multiple-choice" || currentExercise.kind === "fill-blank") && currentExercise.options && (
            <div className="grid grid-cols-1 gap-2">
              {currentExercise.options.map(opt => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.97 }}
                  disabled={showResult}
                  onClick={() => !showResult && setSelectedOption(opt)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                    !showResult && selectedOption === opt
                      ? "border-primary bg-primary/10 text-foreground"
                      : !showResult
                        ? "border-border bg-card text-foreground hover:border-primary/40"
                        : opt === currentExercise.answer
                          ? "border-success bg-success/10 text-success"
                          : selectedOption === opt
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          )}

          {/* ── Translation ── */}
          {currentExercise.kind === "translation" && (
            <Input
              placeholder="Type your answer..."
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyDown={e => e.key === "Enter" && userAnswer.trim() && !showResult && checkAnswer()}
              disabled={showResult}
              className="rounded-xl text-base py-3 bg-card border-border"
            />
          )}

          {/* ── Reorder ── */}
          {currentExercise.kind === "reorder" && (
            <div className="space-y-3">
              {/* Picked words (answer area) */}
              <div className="min-h-[48px] p-3 rounded-xl border-2 border-dashed border-border bg-card/50 flex flex-wrap gap-2">
                {reorderPicked.length === 0 && (
                  <span className="text-xs text-muted-foreground">Tap words below to build the sentence</span>
                )}
                {reorderPicked.map((w, i) => (
                  <motion.button
                    key={`picked-${i}`}
                    layoutId={`word-${w}-${i}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (showResult) return
                      setReorderPicked(p => p.filter((_, idx) => idx !== i))
                      setReorderPool(p => [...p, w])
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  >
                    {w}
                  </motion.button>
                ))}
              </div>
              {/* Pool */}
              <div className="flex flex-wrap gap-2 justify-center">
                {reorderPool.map((w, i) => (
                  <motion.button
                    key={`pool-${i}`}
                    layoutId={`pool-${w}-${i}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (showResult) return
                      setReorderPool(p => p.filter((_, idx) => idx !== i))
                      setReorderPicked(p => [...p, w])
                    }}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm font-medium border border-border hover:border-primary/50 transition-colors"
                  >
                    {w}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ── Result Feedback ── */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-3 rounded-xl flex items-start gap-3",
                isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                isCorrect ? "bg-success text-background" : "bg-destructive text-background"
              )}>
                {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </div>
              <div className="space-y-1 min-w-0">
                <p className={cn("text-sm font-bold", isCorrect ? "text-success" : "text-destructive")}>
                  {isCorrect ? "Correct!" : "Not quite"}
                </p>
                {!isCorrect && (
                  <p className="text-xs text-muted-foreground">
                    Correct answer: <strong className="text-foreground">{currentExercise.answer}</strong>
                  </p>
                )}
                {currentExercise.explanation && (
                  <p className="text-xs text-muted-foreground italic">{currentExercise.explanation}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-2 pt-2">
            {!showResult && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowHint(h => !h)} className="text-xs text-muted-foreground">
                  {showHint ? "Hide hint" : "Hint"}
                </Button>
                <Button
                  onClick={checkAnswer}
                  disabled={
                    currentExercise.kind === "translation" ? !userAnswer.trim()
                    : currentExercise.kind === "reorder" ? reorderPicked.length === 0
                    : !selectedOption
                  }
                  className="flex-1 rounded-xl font-bold"
                >
                  Check
                </Button>
              </>
            )}
            {showResult && !isLast && (
              <Button onClick={nextExercise} className="flex-1 rounded-xl font-bold">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {showResult && isLast && (
              <Button onClick={() => setShowResult(true)} className="flex-1 rounded-xl font-bold">
                See Results <Trophy className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
