"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BottomNav, type AppTab } from "@/components/bottom-nav"
import { TopBar } from "@/components/top-bar"
import { Pathway } from "@/components/pathway"
import { TrainTab } from "@/components/tabs/train-tab"
import { ReviewScreen } from "@/components/review-screen"
import { TutorTab } from "@/components/tabs/tutor-tab"
import { ProfileScreen } from "@/components/profile-screen"
import { useGamification } from "@/lib/use-gamification"
import { lessonCatalog } from "@/lib/lesson-catalog"
import { useSoundSettings } from "@/lib/use-sound-settings"

/* ── Tab ordering for slide direction ── */
const TAB_ORDER: AppTab[] = ["home", "practice", "review", "tutor", "profile"]

function getDirection(from: AppTab, to: AppTab): number {
  return TAB_ORDER.indexOf(to) > TAB_ORDER.indexOf(from) ? 1 : -1
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "30%" : "-30%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-15%" : "15%",
    opacity: 0,
  }),
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("home")
  const [lessonFilter, setLessonFilter] = useState("all")
  const prevTabRef = useRef<AppTab>("home")
  const [direction, setDirection] = useState(0)

  const gamification = useGamification()
  const { play } = useSoundSettings()

  const handleTabChange = useCallback((tab: AppTab) => {
    setDirection(getDirection(prevTabRef.current, tab))
    prevTabRef.current = activeTab
    setActiveTab(tab)
  }, [activeTab])

  const handleStartLesson = useCallback((lessonId: string) => {
    // Navigate to Practice tab with the selected lesson
    setLessonFilter(lessonId)
    setDirection(1)
    prevTabRef.current = "home"
    setActiveTab("practice")
    // Award XP and complete
    gamification.addXp(10)
    gamification.completeLesson(lessonId)
    play("correct")
  }, [gamification, play])

  const handlePracticeLesson = useCallback((lessonId: string) => {
    setLessonFilter(lessonId)
    setDirection(1)
    prevTabRef.current = "home"
    setActiveTab("practice")
  }, [])

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Top status bar */}
      <TopBar
        xp={gamification.xp}
        level={gamification.level}
        progress={gamification.progress}
        streak={gamification.streak}
        hearts={gamification.hearts}
        maxHearts={gamification.maxHearts}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20 pt-2">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            className="w-full"
          >
            {activeTab === "home" && (
              <Pathway
                completedLessons={gamification.completedLessons}
                onStartLesson={handleStartLesson}
                onPracticeLesson={handlePracticeLesson}
              />
            )}
            {activeTab === "practice" && (
              <div className="container mx-auto px-4">
                <TrainTab
                  selectedLesson={lessonFilter}
                  onLessonChange={setLessonFilter}
                />
              </div>
            )}
            {activeTab === "review" && (
              <div className="container mx-auto px-4">
                <ReviewScreen
                  selectedLesson={lessonFilter}
                  onLessonChange={setLessonFilter}
                />
              </div>
            )}
            {activeTab === "tutor" && (
              <div className="container mx-auto px-4">
                <TutorTab />
              </div>
            )}
            {activeTab === "profile" && (
              <ProfileScreen
                xp={gamification.xp}
                level={gamification.level}
                streak={gamification.streak}
                hearts={gamification.hearts}
                maxHearts={gamification.maxHearts}
                completedCount={gamification.completedLessons.length}
                totalLessons={lessonCatalog.length}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <BottomNav active={activeTab} onChange={handleTabChange} />
    </div>
  )
}
