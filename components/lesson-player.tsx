"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, ChevronRight, BookOpen, MessageSquare, Dumbbell,
  Check, RotateCcw, Lightbulb, Volume2, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IgelMascot } from "@/components/igel/igel-mascot"
import { cn } from "@/lib/utils"
import type { LessonContent, Exercise, ExerciseKind } from "@/lib/lesson-content"

/* ── Step types in the lesson flow ── */
type LessonStep =
  | { kind: "intro" }
  | { kind: "grammar"; index: number }
  | { kind: "vocab" }
  | { kind: "dialogue" }
  | { kind: "exercise"; index: number }
  | { kind: "summary" }

interface LessonPlayerProps {
  content: LessonContent
  onComplete: (lessonId: string, score: number, total: number) => void
  onExit: () => void
}

export function LessonPlayer({ content, onComplete, onExit }: LessonPlayerProps) {
  /* Build the step sequence */
  const steps = useMemo<LessonStep[]>(() => {
    const s: LessonStep[] = [{ kind: "intro" }]
    content.grammarPoints.forEach((_, i) => s.push({ kind: "grammar", index: i }))
    s.push({ kind: "vocab" })
    if (content.dialogue.length > 0) s.push({ kind: "dialogue" })
    content.exercises.forEach((_, i) => s.push({ kind: "exercise", index: i }))
    s.push({ kind: "summary" })
    return s
  }, [content])

  const [stepIdx, setStepIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  /* Exercise state */
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [typedAnswer, setTypedAnswer] = useState("")
  const [reorderPicked, setReorderPicked] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const currentStep = steps[stepIdx]
  const progress = (stepIdx + 1) / steps.length

  const goNext = useCallback(() => {
    if (stepIdx >= steps.length - 1) return
    setDirection(1)
    setStepIdx((i) => i + 1)
    // Reset exercise state
    setSelectedOption(null)
    setTypedAnswer("")
    setReorderPicked([])
    setShowResult(false)
    setIsCorrect(false)
    setShowHint(false)
  }, [stepIdx, steps.length])

  const goBack = useCallback(() => {
    if (stepIdx <= 0) return
    setDirection(-1)
    setStepIdx((i) => i - 1)
    setShowResult(false)
    setShowHint(false)
  }, [stepIdx])

  const checkExerciseAnswer = useCallback((exercise: Exercise) => {
    let correct = false
    if (exercise.kind === "translation") {
      const norm = (s: string) => s.toLowerCase().trim().replace(/[.,!?]/g, "").replace(/\s+/g, " ")
      correct = norm(typedAnswer) === norm(exercise.answer)
    } else if (exercise.kind === "reorder") {
      correct = reorderPicked.join(" ") === exercise.answer
    } else {
      correct = selectedOption === exercise.answer
    }
    setIsCorrect(correct)
    setShowResult(true)
    setScore((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }))
  }, [selectedOption, typedAnswer, reorderPicked])

  const handleReorderTap = useCallback((word: string) => {
    setReorderPicked((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    )
  }, [])

  /* ── Slide animation ── */
  const slideVars = {
    enter: (d: number) => ({ x: d > 0 ? "30%" : "-30%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-15%" : "15%", opacity: 0 }),
  }

  /* ── Render helpers ── */
  function renderExercise(exercise: Exercise) {
    const renderOptions = (kind: ExerciseKind) => {
      if (kind === "translation") {
        return (
          <div className="space-y-3">
            <Input
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Type your answer in German..."
              disabled={showResult}
              className="bg-secondary border-border text-foreground text-center text-base py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && typedAnswer.trim()) checkExerciseAnswer(exercise)
              }}
            />
          </div>
        )
      }

      if (kind === "reorder" && exercise.words) {
        const remaining = exercise.words.filter((w) => !reorderPicked.includes(w))
        return (
          <div className="space-y-4">
            {/* Picked words area */}
            <div className="min-h-[48px] p-3 rounded-xl bg-secondary/50 border border-dashed border-border flex flex-wrap gap-2">
              {reorderPicked.length === 0 && (
                <span className="text-muted-foreground text-sm">Tap words below to build the sentence...</span>
              )}
              {reorderPicked.map((w, i) => (
                <motion.button
                  key={`picked-${w}-${i}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  onClick={() => !showResult && handleReorderTap(w)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  {w}
                </motion.button>
              ))}
            </div>
            {/* Available words */}
            <div className="flex flex-wrap gap-2 justify-center">
              {remaining.map((w, i) => (
                <motion.button
                  key={`word-${w}-${i}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !showResult && handleReorderTap(w)}
                  className="px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:border-primary/50 transition-colors"
                >
                  {w}
                </motion.button>
              ))}
            </div>
          </div>
        )
      }

      /* multiple-choice / fill-blank */
      return (
        <div className="grid grid-cols-1 gap-2.5">
          {exercise.options?.map((opt) => {
            const isSelected = selectedOption === opt
            const isAnswer = opt === exercise.answer
            let optClass = "bg-card border-border hover:border-primary/50 text-foreground"
            if (showResult && isAnswer) optClass = "bg-success/15 border-success text-success"
            else if (showResult && isSelected && !isAnswer) optClass = "bg-destructive/15 border-destructive text-destructive"
            else if (isSelected) optClass = "bg-primary/10 border-primary text-primary"

            return (
              <motion.button
                key={opt}
                whileTap={showResult ? {} : { scale: 0.97 }}
                onClick={() => !showResult && setSelectedOption(opt)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                  optClass
                )}
              >
                {opt}
              </motion.button>
            )
          })}
        </div>
      )
    }

    return (
      <div className="space-y-5">
        {/* Prompt */}
        <div className="p-4 rounded-xl bg-secondary/60 border border-border">
          <p className="text-base font-semibold text-foreground text-center leading-relaxed">
            {exercise.prompt}
          </p>
        </div>

        {/* Options / Input */}
        {renderOptions(exercise.kind)}

        {/* Hint toggle */}
        {!showResult && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors mx-auto"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
        )}
        {showHint && !showResult && exercise.explanation && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-accent text-center px-4"
          >
            {exercise.explanation.split(".")[0]}.
          </motion.p>
        )}

        {/* Check / Feedback */}
        {!showResult ? (
          <Button
            onClick={() => checkExerciseAnswer(exercise)}
            disabled={
              (exercise.kind === "translation" && !typedAnswer.trim()) ||
              (exercise.kind === "reorder" && reorderPicked.length === 0) ||
              ((exercise.kind === "multiple-choice" || exercise.kind === "fill-blank") && !selectedOption)
            }
            className="w-full py-3 rounded-xl font-bold"
          >
            Check Answer
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-xl border-2",
              isCorrect
                ? "bg-success/10 border-success/30"
                : "bg-destructive/10 border-destructive/30"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                isCorrect ? "bg-success" : "bg-destructive"
              )}>
                {isCorrect ? <Check className="w-4 h-4 text-success-foreground" /> : <X className="w-4 h-4 text-destructive-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold",
                  isCorrect ? "text-success" : "text-destructive"
                )}>
                  {isCorrect ? "Correct!" : "Not quite"}
                </p>
                {!isCorrect && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Correct answer: <span className="font-semibold text-foreground">{exercise.answer}</span>
                  </p>
                )}
                {exercise.explanation && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {exercise.explanation}
                  </p>
                )}
              </div>
            </div>

            <Button onClick={goNext} className="w-full mt-4 py-3 rounded-xl font-bold">
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </div>
    )
  }

  /* ── Main render ── */
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={onExit} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground tabular-nums">
            {stepIdx + 1}/{steps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIdx}
            custom={direction}
            variants={slideVars}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >

            {/* ── INTRO ── */}
            {currentStep.kind === "intro" && (
              <div className="space-y-6 py-4">
                <div className="flex justify-center">
                  <IgelMascot mood="happy" size={64} breathing />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Lesson Goal</p>
                  <h1 className="text-xl font-bold text-foreground text-balance leading-tight">
                    {content.goal}
                  </h1>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: BookOpen, label: "Grammar", detail: `${content.grammarPoints.length} key rules` },
                    { icon: Volume2, label: "Vocabulary", detail: `${content.vocabulary.length} words` },
                    { icon: MessageSquare, label: "Dialogue", detail: `${content.dialogue.length} lines` },
                    { icon: Dumbbell, label: "Exercises", detail: `${content.exercises.length} challenges` },
                  ].map(({ icon: Icon, label, detail }) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground flex-1">{label}</span>
                      <span className="text-xs text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={goNext} className="w-full py-3 rounded-xl font-bold text-base">
                  {"Let's start"} <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            )}

            {/* ── GRAMMAR ── */}
            {currentStep.kind === "grammar" && (
              <div className="space-y-5 py-2">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Grammar Rule {(currentStep as { index: number }).index + 1}
                  </p>
                </div>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {content.grammarPoints[(currentStep as { index: number }).index].rule}
                </p>
                {content.grammarPoints[(currentStep as { index: number }).index].table && (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-secondary/70">
                          {content.grammarPoints[(currentStep as { index: number }).index].table!.headers.map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-bold text-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {content.grammarPoints[(currentStep as { index: number }).index].table!.rows.map((row, ri) => (
                          <tr key={ri} className="border-t border-border">
                            {row.map((cell, ci) => (
                              <td key={ci} className={cn("px-3 py-2", ci === 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {stepIdx > 0 && (
                    <Button variant="outline" onClick={goBack} className="rounded-xl">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  )}
                  <Button onClick={goNext} className="flex-1 py-3 rounded-xl font-bold">
                    Got it <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── VOCABULARY ── */}
            {currentStep.kind === "vocab" && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 text-primary">
                  <Volume2 className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">Key Vocabulary</p>
                </div>
                <div className="space-y-2">
                  {content.vocabulary.map((v, i) => (
                    <motion.div
                      key={v.german}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{v.german}</p>
                        <p className="text-xs text-muted-foreground">{v.english}</p>
                      </div>
                      {v.example && (
                        <p className="text-[10px] text-accent italic shrink-0 max-w-[40%] text-right">{v.example}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={goBack} className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={goNext} className="flex-1 py-3 rounded-xl font-bold">
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── DIALOGUE ── */}
            {currentStep.kind === "dialogue" && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 text-primary">
                  <MessageSquare className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">Dialogue</p>
                </div>
                <div className="space-y-3">
                  {content.dialogue.map((line, i) => {
                    const isEven = i % 2 === 0
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isEven ? -12 : 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className={cn("flex", isEven ? "justify-start" : "justify-end")}
                      >
                        <div className={cn(
                          "max-w-[85%] p-3 rounded-2xl",
                          isEven
                            ? "bg-card border border-border rounded-tl-sm"
                            : "bg-primary/10 border border-primary/20 rounded-tr-sm"
                        )}>
                          <p className="text-[10px] font-bold text-primary mb-1">{line.speaker}</p>
                          <p className="text-sm font-semibold text-foreground">{line.german}</p>
                          <p className="text-xs text-muted-foreground mt-1 italic">{line.english}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={goBack} className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={goNext} className="flex-1 py-3 rounded-xl font-bold">
                    Start Exercises <Dumbbell className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── EXERCISE ── */}
            {currentStep.kind === "exercise" && (
              <div className="py-2">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Dumbbell className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Exercise {(currentStep as { index: number }).index + 1} of {content.exercises.length}
                  </p>
                  <span className="ml-auto text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary border border-border">
                    {content.exercises[(currentStep as { index: number }).index].kind.replace("-", " ")}
                  </span>
                </div>
                {renderExercise(content.exercises[(currentStep as { index: number }).index])}
              </div>
            )}

            {/* ── SUMMARY ── */}
            {currentStep.kind === "summary" && (
              <div className="space-y-6 py-4">
                <div className="flex justify-center">
                  <IgelMascot
                    mood={score.correct >= score.total * 0.7 ? "celebrate" : "thinking"}
                    size={80}
                    breathing
                  />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-foreground">Lesson Complete</h2>
                  <p className="text-3xl font-black text-primary tabular-nums">
                    {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {score.correct} of {score.total} exercises correct
                  </p>
                </div>

                {/* Review hint */}
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs font-bold text-accent mb-1">Review tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{content.reviewHint}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStepIdx(0)
                      setScore({ correct: 0, total: 0 })
                    }}
                    className="rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> Retry
                  </Button>
                  <Button
                    onClick={() => onComplete(content.lessonId, score.correct, score.total)}
                    className="flex-1 py-3 rounded-xl font-bold"
                  >
                    Complete Lesson <Check className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
