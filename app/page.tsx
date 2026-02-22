"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BottomNav, type AppTab } from "@/components/bottom-nav"
import { TopBar } from "@/components/top-bar"
import { Pathway } from "@/components/pathway"
import { Onboarding } from "@/components/onboarding"
import { TrainTab } from "@/components/tabs/train-tab"
import { ReviewScreen } from "@/components/review-screen"
import { TutorTab } from "@/components/tabs/tutor-tab"
import { ProfileScreen } from "@/components/profile-screen"
import { useGamification } from "@/lib/use-gamification"
import { useLearnerProfile } from "@/lib/use-learner-profile"
import { useSoundSettings } from "@/lib/use-sound-settings"

/* ── Tab ordering for slide direction ── */
const TAB_ORDER: AppTab[] = ["home", "practice", "review", "tutor", "profile"]

function getDirection(from: AppTab, to: AppTab): number {
  return TAB_ORDER.indexOf(to) > TAB_ORDER.indexOf(from) ? 1 : -1
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "30%" : "-30%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-15%" : "15%", opacity: 0 }),
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("home")
  const [lessonFilter, setLessonFilter] = useState("all")
  const prevTabRef = useRef<AppTab>("home")
  const [direction, setDirection] = useState(0)

  const progress = useGamification()
  const { profile, updateProfile, completeOnboarding, resetProfile } = useLearnerProfile()
  const { play } = useSoundSettings()

  /* ── Onboarding completion ── */
  const handleOnboardingComplete = useCallback((answers: {
    purpose: string
    level: string
    timeCommitment: string
    learningStyle: string
    region: string
    deadline: string
  }) => {
    updateProfile({
      purpose: answers.purpose as never,
      level: answers.level as never,
      timeCommitment: answers.timeCommitment as never,
      learningStyle: answers.learningStyle as never,
      region: answers.region as never,
      deadline: answers.deadline,
    })
    completeOnboarding()
    play("complete")
  }, [updateProfile, completeOnboarding, play])

  /* ── Tab navigation ── */
  const handleTabChange = useCallback((tab: AppTab) => {
    setDirection(getDirection(prevTabRef.current, tab))
    prevTabRef.current = activeTab
    setActiveTab(tab)
  }, [activeTab])

  const handleStartLesson = useCallback((lessonId: string) => {
    setLessonFilter(lessonId)
    setDirection(1)
    prevTabRef.current = "home"
    setActiveTab("practice")
    progress.completeLesson(lessonId)
    play("correct")
  }, [progress, play])

  const handlePracticeLesson = useCallback((lessonId: string) => {
    setLessonFilter(lessonId)
    setDirection(1)
    prevTabRef.current = "home"
    setActiveTab("practice")
  }, [])

  /* ── Gate: show onboarding if not completed ── */
  if (!profile.onboarded) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Onboarding onComplete={handleOnboardingComplete} />
        </motion.div>
      </AnimatePresence>
    )
  }

  /* ── Main app shell ── */
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar
        completedCount={progress.completedCount}
        totalLessons={progress.totalLessons}
        overallProgress={progress.overallProgress}
        currentModule={progress.currentModule}
        activeDays={progress.activeDays}
      />

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
                completedLessons={progress.completedLessons}
                onStartLesson={handleStartLesson}
                onPracticeLesson={handlePracticeLesson}
                profile={profile}
              />
            )}
            {activeTab === "practice" && (
              <div className="max-w-lg mx-auto px-4">
                <TrainTab selectedLesson={lessonFilter} onLessonChange={setLessonFilter} />
              </div>
            )}
            {activeTab === "review" && (
              <div className="max-w-lg mx-auto px-4">
                <ReviewScreen selectedLesson={lessonFilter} onLessonChange={setLessonFilter} />
              </div>
            )}
            {activeTab === "tutor" && (
              <div className="max-w-lg mx-auto px-4">
                <TutorTab />
              </div>
            )}
            {activeTab === "profile" && (
              <ProfileScreen
                completedCount={progress.completedCount}
                totalLessons={progress.totalLessons}
                activeDays={progress.activeDays}
                minutesStudied={progress.minutesStudied}
                currentPhase={progress.currentPhase}
                currentModule={progress.currentModule}
                profile={profile}
                onResetProfile={resetProfile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav active={activeTab} onChange={handleTabChange} />
    </div>
  )
}
