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

export type TabType = "lessons" | "train" | "vocab" | "conjugations" | "cards" | "core" | "cheat"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("lessons")

  const renderTabContent = () => {
    switch (activeTab) {
      case "lessons":
        return <LessonsTab onNavigate={setActiveTab} />
      case "train":
        return <TrainTab />
      case "vocab":
        return <VocabTab />
      case "conjugations":
        return <VerbConjugationsTab />
      case "cards":
        return <CardsTab />
      case "core":
        return <CoreTab />
      case "cheat":
        return <CheatTab />
      default:
        return <LessonsTab onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
}
