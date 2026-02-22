"use client"

import { useState, useEffect, useCallback, useMemo } from "react"

/* ── XP level thresholds ── */
const LEVEL_THRESHOLDS = [0, 60, 150, 300, 500, 800, 1200, 1800, 2600, 3600, 5000]

function levelFromXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

function xpForLevel(level: number): { current: number; next: number } {
  const idx = Math.max(0, level - 1)
  const current = LEVEL_THRESHOLDS[idx] ?? 0
  const next = LEVEL_THRESHOLDS[idx + 1] ?? current + 1000
  return { current, next }
}

/* ── Types ── */
export interface GamificationState {
  xp: number
  streak: number
  lastActiveDate: string
  hearts: number
  completedLessons: string[]
}

const MAX_HEARTS = 5
const STORAGE_KEY = "deutschmeister-gamification"
const EVENT_NAME = "gamification-update"

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): GamificationState {
  if (typeof window === "undefined") {
    return { xp: 0, streak: 0, lastActiveDate: "", hearts: MAX_HEARTS, completedLessons: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as GamificationState
  } catch { /* ignore */ }
  return { xp: 0, streak: 0, lastActiveDate: "", hearts: MAX_HEARTS, completedLessons: [] }
}

function persistState(state: GamificationState) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }))
}

/* ── Hook ── */
export function useGamification() {
  const [state, setState] = useState<GamificationState>(loadState)

  /* Sync across tabs / components */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<GamificationState>).detail
      if (detail) setState(detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  /* Refresh streak on mount */
  useEffect(() => {
    const today = getToday()
    setState((prev) => {
      if (prev.lastActiveDate === today) return prev

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().slice(0, 10)

      const newStreak = prev.lastActiveDate === yesterdayStr ? prev.streak : prev.lastActiveDate === "" ? 0 : 0
      const next = { ...prev, streak: newStreak, lastActiveDate: today }
      persistState(next)
      return next
    })
  }, [])

  const addXp = useCallback((amount: number) => {
    setState((prev) => {
      const today = getToday()
      const streakBump = prev.lastActiveDate !== today ? 1 : 0
      const next: GamificationState = {
        ...prev,
        xp: prev.xp + amount,
        streak: prev.streak + streakBump,
        lastActiveDate: today,
      }
      persistState(next)
      return next
    })
  }, [])

  const loseHeart = useCallback(() => {
    setState((prev) => {
      if (prev.hearts <= 0) return prev
      const next = { ...prev, hearts: prev.hearts - 1 }
      persistState(next)
      return next
    })
  }, [])

  const refillHearts = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, hearts: MAX_HEARTS }
      persistState(next)
      return next
    })
  }, [])

  const completeLesson = useCallback((lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const next: GamificationState = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      }
      persistState(next)
      return next
    })
  }, [])

  const level = useMemo(() => levelFromXp(state.xp), [state.xp])
  const { current: levelXpStart, next: levelXpEnd } = useMemo(() => xpForLevel(level), [level])
  const xpInLevel = state.xp - levelXpStart
  const xpNeeded = levelXpEnd - levelXpStart
  const progress = Math.min(1, xpInLevel / xpNeeded)

  return {
    ...state,
    level,
    progress,
    xpInLevel,
    xpNeeded,
    maxHearts: MAX_HEARTS,
    addXp,
    loseHeart,
    refillHearts,
    completeLesson,
  }
}
