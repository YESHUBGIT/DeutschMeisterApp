"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  buildPersonalizedCatalog,
  isLessonUnlocked,
  getCurrentLesson,
  type LessonCatalogItem,
} from "@/lib/lesson-catalog"
import type { Purpose } from "@/lib/use-learner-profile"

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

export function useGamification(purpose: Purpose | null = null) {
  const [state, setState] = useState<LearningProgress>(loadState)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LearningProgress>).detail
      if (detail) setState(detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

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

  /* Build personalized catalog */
  const personalCatalog: LessonCatalogItem[] = useMemo(
    () => buildPersonalizedCatalog(purpose),
    [purpose]
  )

  const completedSet = useMemo(
    () => new Set(state.completedLessons),
    [state.completedLessons]
  )

  const totalLessons = personalCatalog.length
  const completedCount = personalCatalog.filter((l) => completedSet.has(l.id)).length
  const overallProgress = totalLessons > 0 ? completedCount / totalLessons : 0

  const currentLesson = useMemo(
    () => getCurrentLesson(personalCatalog, completedSet),
    [personalCatalog, completedSet]
  )

  const currentPhase = useMemo(() => {
    if (overallProgress < 0.25) return { label: "Quick Wins", phase: 1 as const }
    if (overallProgress < 0.7) return { label: "Structured Growth", phase: 2 as const }
    return { label: "Precision & Fluency", phase: 3 as const }
  }, [overallProgress])

  const currentModule = currentLesson?.group ?? "All Complete"

  /** Check if a specific lesson is unlocked */
  const isUnlocked = useCallback(
    (lesson: LessonCatalogItem) => isLessonUnlocked(lesson, completedSet),
    [completedSet]
  )

  return {
    ...state,
    personalCatalog,
    totalLessons,
    completedCount,
    overallProgress,
    currentPhase,
    currentModule,
    currentLesson,
    isUnlocked,
    completeLesson,
  }
}
