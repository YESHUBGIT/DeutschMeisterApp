"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { lessonCatalog } from "@/lib/lesson-catalog"

/* ── Learning progress state (no gamification language) ── */
export interface LearningProgress {
  completedLessons: string[]
  lastActiveDate: string
  activeDays: number
  minutesStudied: number
  sessionStartedAt: number | null
}

const STORAGE_KEY = "deutschmeister-progress"
const EVENT_NAME = "progress-update"

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): LearningProgress {
  if (typeof window === "undefined") {
    return { completedLessons: [], lastActiveDate: "", activeDays: 0, minutesStudied: 0, sessionStartedAt: null }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as LearningProgress
  } catch { /* ignore */ }
  return { completedLessons: [], lastActiveDate: "", activeDays: 0, minutesStudied: 0, sessionStartedAt: null }
}

function persistState(state: LearningProgress) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }))
}

/* ── Hook ── */
export function useGamification() {
  const [state, setState] = useState<LearningProgress>(loadState)

  /* Sync across tabs / components */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LearningProgress>).detail
      if (detail) setState(detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  /* Track active day on mount */
  useEffect(() => {
    const today = getToday()
    setState((prev) => {
      if (prev.lastActiveDate === today) {
        return prev.sessionStartedAt ? prev : { ...prev, sessionStartedAt: Date.now() }
      }
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().slice(0, 10)
      const dayBump = prev.lastActiveDate === yesterdayStr || prev.lastActiveDate === "" ? 1 : 0
      const next = {
        ...prev,
        activeDays: prev.activeDays + dayBump,
        lastActiveDate: today,
        sessionStartedAt: Date.now(),
      }
      persistState(next)
      return next
    })
  }, [])

  const completeLesson = useCallback((lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const elapsed = prev.sessionStartedAt ? Math.round((Date.now() - prev.sessionStartedAt) / 60000) : 0
      const next: LearningProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        minutesStudied: prev.minutesStudied + Math.max(elapsed, 1),
      }
      persistState(next)
      return next
    })
  }, [])

  /* Derived values */
  const totalLessons = lessonCatalog.length
  const completedCount = state.completedLessons.length
  const overallProgress = totalLessons > 0 ? completedCount / totalLessons : 0

  /* Determine current phase */
  const currentPhase = useMemo(() => {
    const pct = overallProgress
    if (pct < 0.25) return { label: "Quick Wins", phase: 1 as const }
    if (pct < 0.7) return { label: "Structured Growth", phase: 2 as const }
    return { label: "Precision & Fluency", phase: 3 as const }
  }, [overallProgress])

  /* Current module name */
  const currentModule = useMemo(() => {
    const next = lessonCatalog.find((l) => !state.completedLessons.includes(l.id))
    return next?.group ?? "All Complete"
  }, [state.completedLessons])

  return {
    ...state,
    totalLessons,
    completedCount,
    overallProgress,
    currentPhase,
    currentModule,
    completeLesson,
  }
}
