"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { lessonCatalog } from "@/lib/lesson-catalog"
import { MessageCircle, BookOpen, Send } from "lucide-react"
import { cn } from "@/lib/utils"

type ChatRole = "system" | "user" | "assistant"

type ChatMessage = {
  role: ChatRole
  content: string
}

const staticApiBase = process.env.NEXT_PUBLIC_CHAT_API_BASE

const defaultLessonIntro = "Hallo! Ich bin dein Deutsch-Coach. Lass uns eine kurze Uebung machen. Antworte auf Deutsch."
const defaultFreeIntro = "Hallo! Ich bin dein Deutsch-Partner. Wir koennen ueber alles sprechen."

export function ConversationTab() {
  const [mode, setMode] = useState<"lesson" | "free">("lesson")
  const [lessonId, setLessonId] = useState("personal-pronouns")
  const [input, setInput] = useState("")
  const [apiBase, setApiBase] = useState(staticApiBase ?? "")
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: defaultLessonIntro,
  }])
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/chat/config")
        if (!response.ok) {
          return
        }
        const data = await response.json()
        if (data?.apiBase) {
          setApiBase(data.apiBase)
        }
      } catch (error) {
        // ignore
      }
    }

    fetchConfig()
  }, [])

  const systemPrompt = useMemo(() => {
    if (mode === "free") {
      return "You are a friendly German conversation partner. Keep replies in German, correct mistakes briefly, and ask a follow-up question."
    }

    const lesson = lessonCatalog.find(item => item.id === lessonId)
    const lessonTitle = lesson ? lesson.title : "German Basics"
    return `You are a German tutor. Focus on the lesson: ${lessonTitle}. Keep replies in German, correct mistakes briefly, and ask one follow-up question.`
  }, [lessonId, mode])

  const handleModeChange = (value: string) => {
    const nextMode = value === "free" ? "free" : "lesson"
    setMode(nextMode)
    setMessages([
      {
        role: "assistant",
        content: nextMode === "free" ? defaultFreeIntro : defaultLessonIntro,
      },
    ])
  }

  const handleLessonChange = (value: string) => {
    setLessonId(value)
    if (mode === "lesson") {
      setMessages([
        {
          role: "assistant",
          content: defaultLessonIntro,
        },
      ])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !apiBase || isSending) {
      return
    }

    const userMessage: ChatMessage = { role: "user", content: input.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setIsSending(true)

    try {
      const response = await fetch(`${apiBase}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-3B-Instruct",
          messages: [{ role: "system", content: systemPrompt }, ...nextMessages],
          temperature: 0.7,
          max_tokens: 220,
        }),
      })

      if (!response.ok) {
        throw new Error("Chat request failed")
      }

      const data = await response.json()
      const assistantText = data?.choices?.[0]?.message?.content?.trim()
      if (assistantText) {
        setMessages((prev) => [...prev, { role: "assistant", content: assistantText }])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Entschuldigung, ich konnte gerade nicht antworten. Bitte versuche es erneut.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-6">
        <h1 className="text-4xl font-bold text-foreground">Conversation Lab</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Trainiere echte Gespräche oder folge einer gefuehrten Lektion.
        </p>
      </div>

      <Card>
        <CardContent className="py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="lesson" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Lesson Mode
              </TabsTrigger>
              <TabsTrigger value="free" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Free Chat
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {mode === "lesson" && (
            <Select value={lessonId} onValueChange={handleLessonChange}>
              <SelectTrigger className="w-full md:w-[320px]">
                <SelectValue placeholder="Select lesson" />
              </SelectTrigger>
              <SelectContent>
                {lessonCatalog.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {!apiBase && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Missing API Base</CardTitle>
            <CardDescription>
              Set `NEXT_PUBLIC_CHAT_API_BASE` to your ngrok URL (for example: https://xxxx.ngrok-free.app/v1).
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            {mode === "lesson" ? "Antworten Sie auf Deutsch und fokussieren Sie die Lektion." : "Freies Gespraech auf Deutsch."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto w-fit"
                    : "bg-muted text-foreground w-fit"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Schreibe deine Antwort..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend()
                }
              }}
            />
            <Button onClick={handleSend} disabled={!apiBase || isSending} className="gap-2">
              <Send className="h-4 w-4" />
              {isSending ? "Sending" : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
