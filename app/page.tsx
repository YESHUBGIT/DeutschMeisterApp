"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { LessonsTab } from "@/components/tabs/lessons-tab"
import { TrainTab } from "@/components/tabs/train-tab"
import { VocabTab } from "@/components/tabs/vocab-tab"
import { CardsTab } from "@/components/tabs/cards-tab"
import { CoreTab } from "@/components/tabs/core-tab"
import { CheatTab } from "@/components/tabs/cheat-tab"
import { VerbConjugationsTab } from "@/components/tabs/verb-conjugations-tab"
import { TutorTab } from "@/components/tabs/tutor-tab"

export type TabType = "lessons" | "train" | "vocab" | "conjugations" | "tutor" | "cards" | "core" | "cheat"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("lessons")
  const [lessonFilter, setLessonFilter] = useState("all")

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setLessonFilter("all")
  }

  const handleLessonNavigate = (tab: TabType, lessonId?: string) => {
    setActiveTab(tab)
    if (lessonId) {
      setLessonFilter(lessonId)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "lessons":
        return <LessonsTab onNavigate={handleTabChange} onNavigateWithLesson={handleLessonNavigate} />
      case "train":
        return <TrainTab selectedLesson={lessonFilter} onLessonChange={setLessonFilter} />
      case "vocab":
        return <VocabTab selectedLesson={lessonFilter} onLessonChange={setLessonFilter} />
      case "conjugations":
        return <VerbConjugationsTab />
      case "tutor":
        return <TutorTab />
      case "cards":
        return <CardsTab selectedLesson={lessonFilter} onLessonChange={setLessonFilter} />
      case "core":
        return <CoreTab />
      case "cheat":
        return <CheatTab />
      default:
        return <LessonsTab onNavigate={handleTabChange} onNavigateWithLesson={handleLessonNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
}
