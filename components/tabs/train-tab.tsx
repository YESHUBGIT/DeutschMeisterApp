"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, RotateCcw, Trophy, Target, Brain, Zap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { lessonCatalog } from "@/lib/lesson-catalog"

type ExerciseType = "translation" | "fillBlank" | "multipleChoice" | "verbPosition" | null

const exercises = {
  translation: [
    { id: 1, german: "Ich bin Student.", english: "I am a student.", lessonId: "personal-pronouns" },
    { id: 2, german: "Du bist mein Freund.", english: "You are my friend.", lessonId: "personal-pronouns" },
    { id: 3, german: "Sie sind sehr nett.", english: "You are very nice.", lessonId: "personal-pronouns" },
    { id: 4, german: "Wir lernen Deutsch.", english: "We are learning German.", lessonId: "personal-pronouns" },
    { id: 5, german: "Das ist mein Bruder.", english: "This is my brother.", lessonId: "possessive-articles" },
    { id: 6, german: "Ich freue mich auf die Party.", english: "I am looking forward to the party.", lessonId: "reflexive-verbs" },
    { id: 7, german: "Er interessiert sich für Musik.", english: "He is interested in music.", lessonId: "reflexive-verbs" },
    { id: 8, german: "Ich warte auf den Bus.", english: "I am waiting for the bus.", lessonId: "verbs-with-prep" },
    { id: 9, german: "Sie kommt aus Deutschland.", english: "She comes from Germany.", lessonId: "prepositions-by-case" },
    { id: 10, german: "Möchtest du einen Kaffee?", english: "Would you like a coffee?", lessonId: "konjunktiv-2" },
  ],
  fillBlank: [
    { id: 1, sentence: "___ bin Student.", answer: "Ich", options: ["Ich", "Du", "Er", "Wir"], hint: "I am a student", lessonId: "personal-pronouns" },
    { id: 2, sentence: "Das ist ___ Buch.", answer: "mein", options: ["mein", "dein", "sein", "ihr"], hint: "my book", lessonId: "possessive-articles" },
    { id: 3, sentence: "Ich fahre ___ dem Bus.", answer: "mit", options: ["mit", "für", "ohne", "durch"], hint: "by bus (Dative prep)", lessonId: "prepositions-by-case" },
    { id: 4, sentence: "Das Geschenk ist ___ dich.", answer: "für", options: ["für", "mit", "von", "zu"], hint: "for you (Accusative prep)", lessonId: "prepositions-by-case" },
    { id: 5, sentence: "Ich ___ schwimmen.", answer: "kann", options: ["kann", "kannst", "können", "könnt"], hint: "I can swim", lessonId: "modal-verbs" },
    { id: 6, sentence: "Er ___ seine Hausaufgaben machen.", answer: "muss", options: ["muss", "musst", "müssen", "müsst"], hint: "He must do", lessonId: "modal-verbs" },
    { id: 7, sentence: "Ich bleibe zu Hause, ___ ich krank bin.", answer: "weil", options: ["weil", "und", "aber", "oder"], hint: "because (verb to end)", lessonId: "connectors-verb-position" },
    { id: 8, sentence: "___ wartest du?", answer: "Worauf", options: ["Worauf", "Auf wen", "Warum", "Wohin"], hint: "What are you waiting for? (thing)", lessonId: "question-words" },
    { id: 9, sentence: "Ich sehe ___ Mann.", answer: "den", options: ["der", "den", "dem", "des"], hint: "Accusative masculine", lessonId: "cases-basics" },
    { id: 10, sentence: "Ich helfe ___ Freund.", answer: "meinem", options: ["meinen", "meinem", "mein", "meine"], hint: "Dative - helfen takes Dative!", lessonId: "cases-basics" },
  ],
  multipleChoice: [
    { 
      id: 1, 
      question: "Which preposition always takes DATIVE?", 
      answer: "mit", 
      options: ["für", "mit", "durch", "ohne"],
      hint: "Think: with whom",
      lessonId: "prepositions-by-case",
    },
    { 
      id: 2, 
      question: "Which connector sends the verb to the END?", 
      answer: "weil", 
      options: ["und", "weil", "aber", "deshalb"],
      hint: "Type 1 connector",
      lessonId: "connectors-verb-position",
    },
    { 
      id: 3, 
      question: "'Worüber' is used to ask about...", 
      answer: "things", 
      options: ["people", "things", "places", "times"],
      hint: "wo + preposition = for things",
      lessonId: "question-words",
    },
    { 
      id: 4, 
      question: "Which verb ALWAYS takes Dative?", 
      answer: "helfen", 
      options: ["sehen", "helfen", "haben", "machen"],
      hint: "Ich helfe DIR",
      lessonId: "cases-basics",
    },
    { 
      id: 5, 
      question: "What is 'ich möchte'?", 
      answer: "I would like", 
      options: ["I must", "I can", "I would like", "I want"],
      hint: "Polite form of wollen",
      lessonId: "konjunktiv-2",
    },
    { 
      id: 6, 
      question: "'-ung' ending nouns are always...", 
      answer: "feminine (die)", 
      options: ["masculine (der)", "feminine (die)", "neuter (das)", "varies"],
      hint: "die Zeitung, die Übung",
      lessonId: "articles-gender",
    },
    { 
      id: 7, 
      question: "In 'Ich sehe den Mann', why 'den'?", 
      answer: "Direct object = Accusative", 
      options: ["Subject = Nominative", "Direct object = Accusative", "Indirect object = Dative", "Possession = Genitive"],
      hint: "sehen takes what case?",
      lessonId: "cases-basics",
    },
    { 
      id: 8, 
      question: "'sich freuen auf' means...", 
      answer: "to look forward to", 
      options: ["to be happy about", "to look forward to", "to laugh at", "to think about"],
      hint: "Future anticipation",
      lessonId: "reflexive-verbs",
    },
    { 
      id: 9, 
      question: "Formal 'you' (Sie) is always...", 
      answer: "capitalized", 
      options: ["lowercase", "capitalized", "both depending on position", "optional"],
      hint: "Respect in writing",
      lessonId: "personal-pronouns",
    },
    { 
      id: 10, 
      question: "'Könnten Sie mir helfen?' is more ___ than 'Können Sie...'", 
      answer: "polite", 
      options: ["casual", "polite", "formal", "informal"],
      hint: "Konjunktiv II effect",
      lessonId: "konjunktiv-2",
    },
  ],
  verbPosition: [
    {
      id: 1,
      question: "Put in correct order: ich / müde / bin / weil",
      answer: "weil ich müde bin",
      options: ["weil ich müde bin", "weil müde ich bin", "weil bin ich müde", "ich weil müde bin"],
      hint: "'weil' sends verb to END",
      lessonId: "connectors-verb-position",
    },
    {
      id: 2,
      question: "Put in correct order: deshalb / ich / bleibe / zu Hause",
      answer: "Deshalb bleibe ich zu Hause",
      options: ["Deshalb bleibe ich zu Hause", "Deshalb ich bleibe zu Hause", "Ich deshalb bleibe zu Hause", "Bleibe deshalb ich zu Hause"],
      hint: "'deshalb' = verb comes right after",
      lessonId: "connectors-verb-position",
    },
    {
      id: 3,
      question: "Put in correct order: ich / gut / schwimmen / kann",
      answer: "Ich kann gut schwimmen",
      options: ["Ich kann gut schwimmen", "Ich gut kann schwimmen", "Ich schwimmen kann gut", "Kann ich gut schwimmen"],
      hint: "Modal verb position",
      lessonId: "modal-verbs",
    },
    {
      id: 4,
      question: "Put in correct order: der Film / um 8 / an / fängt",
      answer: "Der Film fängt um 8 an",
      options: ["Der Film fängt um 8 an", "Der Film anfängt um 8", "Der Film an um 8 fängt", "Fängt der Film um 8 an"],
      hint: "Separable verb 'anfangen'",
      lessonId: "separable-verbs",
    },
    {
      id: 5,
      question: "Put in correct order: ich / auf / meine Freundin / warte",
      answer: "Ich warte auf meine Freundin",
      options: ["Ich warte auf meine Freundin", "Ich auf warte meine Freundin", "Warte ich auf meine Freundin", "Ich warte meine Freundin auf"],
      hint: "warten auf + Accusative",
      lessonId: "verbs-with-prep",
    },
    {
      id: 6,
      question: "What happens after 'obwohl'?",
      answer: "Verb goes to end",
      options: ["Verb stays in position 2", "Verb goes to end", "Verb comes first", "No change"],
      hint: "Type 1 connector",
      lessonId: "connectors-verb-position",
    },
    {
      id: 7,
      question: "Put in correct order: dass / er / krank / ist / ich / glaube",
      answer: "Ich glaube, dass er krank ist",
      options: ["Ich glaube, dass er krank ist", "Ich glaube, dass ist er krank", "Dass er krank ist, ich glaube", "Ich dass glaube er krank ist"],
      hint: "'dass' sends verb to end of subordinate clause",
      lessonId: "connectors-verb-position",
    },
    {
      id: 8,
      question: "When 'weil' clause comes FIRST, what happens?",
      answer: "Main clause verb comes right after",
      options: ["Nothing special", "Main clause verb comes right after", "Main clause verb goes to end too", "Both verbs in middle"],
      hint: "Verb-verb at the comma",
      lessonId: "connectors-verb-position",
    },
  ],
}

const exerciseTypes = [
  { 
    id: "translation" as const, 
    title: "Translation Practice", 
    description: "Translate German sentences to English",
    icon: Brain,
    color: "bg-blue-100 text-blue-700"
  },
  { 
    id: "fillBlank" as const, 
    title: "Fill in the Blank", 
    description: "Choose the correct word",
    icon: Target,
    color: "bg-green-100 text-green-700"
  },
  { 
    id: "multipleChoice" as const, 
    title: "Grammar Quiz", 
    description: "Test your knowledge of grammar rules",
    icon: Zap,
    color: "bg-amber-100 text-amber-700"
  },
  { 
    id: "verbPosition" as const, 
    title: "Verb Position", 
    description: "Practice word order with connectors",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-700"
  },
]

interface TrainTabProps {
  selectedLesson?: string
  onLessonChange?: (lessonId: string) => void
}

export function TrainTab({ selectedLesson, onLessonChange }: TrainTabProps) {
  const [selectedType, setSelectedType] = useState<ExerciseType>(null)
  const [localLesson, setLocalLesson] = useState("all")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const lessonValue = selectedLesson ?? localLesson
  const handleLessonValueChange = onLessonChange ?? setLocalLesson

  const lessonCounts = useMemo(() => {
    return exerciseTypes.reduce<Record<string, number>>((acc, type) => {
      const items = exercises[type.id]
      acc[type.id] = lessonValue === "all"
        ? items.length
        : items.filter((exercise) => (exercise as { lessonId?: string }).lessonId === lessonValue).length
      return acc
    }, {})
  }, [lessonValue])

  const filteredExercises = useMemo(() => {
    if (!selectedType) {
      return []
    }

    const items = exercises[selectedType]
    if (lessonValue === "all") {
      return items
    }

    return items.filter((exercise) => (exercise as { lessonId?: string }).lessonId === lessonValue)
  }, [lessonValue, selectedType])

  const currentExercises = filteredExercises
  const currentExercise = currentExercises[currentIndex]
  const isLastExercise = currentIndex === currentExercises.length - 1

  const handleLessonChange = (value: string) => {
    handleLessonValueChange(value)
    setCurrentIndex(0)
    setUserAnswer("")
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
  }

  const handleSelectType = (type: ExerciseType) => {
    setSelectedType(type)
    setCurrentIndex(0)
    setUserAnswer("")
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
  }

  const checkAnswer = () => {
    let correct = false
    
    if (selectedType === "translation") {
      const userNormalized = userAnswer.toLowerCase().trim().replace(/[.,!?]/g, "")
      const correctNormalized = (currentExercise as typeof exercises.translation[0]).english.toLowerCase().replace(/[.,!?]/g, "")
      correct = userNormalized === correctNormalized
    } else {
      correct = selectedOption === (currentExercise as typeof exercises.fillBlank[0]).answer
    }
    
    setIsCorrect(correct)
    setShowResult(true)
    setScore(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }))
  }

  const nextExercise = () => {
    if (isLastExercise) {
      return
    }
    setCurrentIndex(prev => prev + 1)
    setUserAnswer("")
    setSelectedOption(null)
    setShowResult(false)
  }

  const resetExercise = () => {
    setSelectedType(null)
    setCurrentIndex(0)
    setUserAnswer("")
    setSelectedOption(null)
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
  }

  // Exercise Selection Screen
  if (!selectedType) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 py-6">
          <h1 className="text-4xl font-bold text-foreground">Training Mode</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice what you learned in the lessons with interactive exercises
          </p>
        </div>

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">Lesson Filter</p>
                <p className="text-sm text-muted-foreground">Choose a lesson or practice everything.</p>
              </div>
              <Select value={lessonValue} onValueChange={handleLessonChange}>
                <SelectTrigger className="w-full md:w-[320px]">
                  <SelectValue placeholder="Select lesson" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lessons</SelectItem>
                  {lessonCatalog.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {exerciseTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card 
                key={type.id}
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                onClick={() => handleSelectType(type.id)}
              >
                <CardHeader className="text-center">
                  <div className={cn("w-16 h-16 mx-auto rounded-full flex items-center justify-center", type.color)}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="mt-4">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {lessonCounts[type.id]} exercises
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Completion Screen
  if (showResult && isLastExercise) {
    const percentage = Math.round((score.correct / currentExercises.length) * 100)
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={resetExercise}>
          ← Back to Exercise Types
        </Button>

        <Card className="max-w-md mx-auto">
          <CardContent className="py-8 text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Exercise Complete!</h2>
              <p className="text-4xl font-bold text-primary">{percentage}%</p>
              <p className="text-muted-foreground">
                You got {score.correct} out of {currentExercises.length} correct
              </p>
            </div>
            <Button onClick={resetExercise} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedType && currentExercises.length === 0) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={resetExercise}>
          ← Back to Exercise Types
        </Button>
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <h2 className="text-2xl font-bold">No exercises found</h2>
            <p className="text-muted-foreground">
              Try a different lesson or switch back to All Lessons.
            </p>
            <Select value={lessonValue} onValueChange={handleLessonChange}>
              <SelectTrigger className="w-full max-w-sm mx-auto">
                <SelectValue placeholder="Select lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lessons</SelectItem>
                {lessonCatalog.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Exercise Screen
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={resetExercise}>
          ← Back
        </Button>
        <div className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {currentExercises.length}
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / currentExercises.length) * 100}%` }}
        />
      </div>

      {/* Exercise Card */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {selectedType === "translation" && "Translate to English"}
            {selectedType === "fillBlank" && "Fill in the Blank"}
            {selectedType === "multipleChoice" && "Choose the Correct Answer"}
            {selectedType === "verbPosition" && "Word Order Challenge"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="text-center p-6 bg-secondary rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {selectedType === "translation" && (currentExercise as typeof exercises.translation[0]).german}
              {selectedType === "fillBlank" && (currentExercise as typeof exercises.fillBlank[0]).sentence}
              {(selectedType === "multipleChoice" || selectedType === "verbPosition") && (currentExercise as typeof exercises.multipleChoice[0]).question}
            </p>
            {"hint" in currentExercise && (
              <p className="text-sm text-muted-foreground mt-2">Hint: {currentExercise.hint}</p>
            )}
          </div>

          {/* Answer Input */}
          {selectedType === "translation" && (
            <Input
              placeholder="Type your translation..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={showResult}
              className="text-center text-lg"
            />
          )}

          {/* Options */}
          {(selectedType === "fillBlank" || selectedType === "multipleChoice" || selectedType === "verbPosition") && (
            <div className="grid grid-cols-2 gap-3">
              {(currentExercise as typeof exercises.fillBlank[0]).options.map((option) => (
                <Button
                  key={option}
                  variant={selectedOption === option ? "default" : "outline"}
                  onClick={() => !showResult && setSelectedOption(option)}
                  disabled={showResult}
                  className={cn(
                    "h-auto py-4 text-base",
                    showResult && option === (currentExercise as typeof exercises.fillBlank[0]).answer && "bg-green-500 hover:bg-green-500 text-white",
                    showResult && selectedOption === option && option !== (currentExercise as typeof exercises.fillBlank[0]).answer && "bg-red-500 hover:bg-red-500 text-white"
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {/* Result Feedback */}
          {showResult && (
            <div className={cn(
              "p-4 rounded-lg flex items-center gap-3",
              isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              <div>
                <p className="font-medium">{isCorrect ? "Correct!" : "Not quite..."}</p>
                {!isCorrect && selectedType === "translation" && (
                  <p className="text-sm">
                    Correct answer: {(currentExercise as typeof exercises.translation[0]).english}
                  </p>
                )}
                {!isCorrect && selectedType !== "translation" && (
                  <p className="text-sm">
                    Correct answer: {(currentExercise as typeof exercises.fillBlank[0]).answer}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {!showResult ? (
              <Button 
                onClick={checkAnswer}
                disabled={selectedType === "translation" ? !userAnswer : !selectedOption}
                size="lg"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextExercise} size="lg">
                {isLastExercise ? "See Results" : "Next Question"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
