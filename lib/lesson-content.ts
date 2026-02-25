"use client"
/* ===================================================
   DeutschMeister — Purpose-Aware Lesson Content

   Architecture:
   - Each lesson has a SHARED grammar skeleton (rules, tables)
   - Each lesson has PURPOSE-SPECIFIC overlays:
     vocabulary, dialogue, exercises tailored to
     work / travel / study / relocation / exams / daily
   - getLessonContent(id, purpose) merges them
   - If no overlay exists for a purpose, "daily" is used
   =================================================== */

import type { Purpose } from "./use-learner-profile"

export type ExerciseKind =
  | "multiple-choice"
  | "fill-blank"
  | "reorder"
  | "translation"
  | "match-pair"

export interface Exercise {
  kind: ExerciseKind
  prompt: string
  options?: string[]
  answer: string
  explanation?: string
  words?: string[]
  pairs?: { left: string; right: string }[]
}

export interface DialogueLine {
  speaker: string
  german: string
  english: string
}

export interface VocabItem {
  german: string
  english: string
  example?: string
}

export interface GrammarPoint {
  rule: string
  table?: { headers: string[]; rows: string[][] }
}

export interface LessonContent {
  lessonId: string
  goal: string
  grammarPoints: GrammarPoint[]
  vocabulary: VocabItem[]
  dialogue: DialogueLine[]
  exercises: Exercise[]
  reviewHint: string
}

/* ── Purpose-specific overlay ── */
interface PurposeOverlay {
  goal: string
  vocabulary: VocabItem[]
  dialogue: DialogueLine[]
  exercises: Exercise[]
  reviewHint: string
}

interface LessonSkeleton {
  lessonId: string
  grammarPoints: GrammarPoint[]
  overlays: Partial<Record<Purpose | "default", PurposeOverlay>>
}

/* ============================================
   LESSON SKELETONS — grammar is purpose-neutral
   ============================================ */

const skeletons: LessonSkeleton[] = [
  /* ── 1. Greetings & Introductions ── */
  {
    lessonId: "greetings-intro",
    grammarPoints: [
      {
        rule: "Use 'sein' (to be) and 'heißen' (to be called) to introduce yourself. Verb always in position 2.",
        table: {
          headers: ["Person", "sein", "heißen"],
          rows: [
            ["ich", "bin", "heiße"],
            ["du", "bist", "heißt"],
            ["er/sie", "ist", "heißt"],
            ["Sie (formal)", "sind", "heißen"],
          ],
        },
      },
      { rule: "Formal = Sie (capitalized). Informal = du. Use Sie with strangers and in professional settings." },
    ],
    overlays: {
      work: {
        goal: "Introduce yourself professionally and greet colleagues",
        vocabulary: [
          { german: "Guten Tag", english: "Good day (formal)", example: "Guten Tag, Herr Schmidt." },
          { german: "Ich bin ... von der Firma ...", english: "I am ... from the company ..." },
          { german: "Freut mich, Sie kennenzulernen", english: "Pleased to meet you (formal)" },
          { german: "die Abteilung", english: "the department" },
          { german: "der Kollege / die Kollegin", english: "the colleague (m/f)" },
          { german: "die Besprechung", english: "the meeting" },
          { german: "Wie kann ich Ihnen helfen?", english: "How can I help you?" },
          { german: "Auf Wiedersehen", english: "Goodbye (formal)" },
        ],
        dialogue: [
          { speaker: "Frau Weber", german: "Guten Tag! Ich bin Frau Weber, Abteilungsleiterin.", english: "Good day! I'm Ms. Weber, department head." },
          { speaker: "Markus", german: "Guten Tag, Frau Weber. Ich bin Markus Braun, der neue Praktikant.", english: "Good day, Ms. Weber. I'm Markus Braun, the new intern." },
          { speaker: "Frau Weber", german: "Freut mich, Herr Braun! Willkommen im Team.", english: "Nice to meet you, Mr. Braun! Welcome to the team." },
          { speaker: "Markus", german: "Danke! Freut mich auch, Sie kennenzulernen.", english: "Thanks! Nice to meet you too." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "How do you introduce yourself in a business meeting?", options: ["Ich bin Markus Braun von der Firma TechCo.", "Ich heiße Markus, hi!", "Markus bin ich.", "Ich Markus."], answer: "Ich bin Markus Braun von der Firma TechCo.", explanation: "In formal settings use full name + company. 'Ich bin [Name] von der Firma [Company].'"},
          { kind: "fill-blank", prompt: "Complete: 'Guten Tag, ich ___ Frau Müller.'", options: ["bin", "bist", "ist", "sind"], answer: "bin", explanation: "'ich' always pairs with 'bin' (I am)." },
          { kind: "multiple-choice", prompt: "Which greeting fits a 3 PM business meeting?", options: ["Guten Tag", "Guten Morgen", "Tschüss", "Gute Nacht"], answer: "Guten Tag", explanation: "'Guten Tag' covers late morning through afternoon." },
          { kind: "reorder", prompt: "Put in order: 'Nice to meet you (formal)'", words: ["mich", "Freut", "Sie", "kennenzulernen", ","], answer: "Freut mich, Sie kennenzulernen", explanation: "Literally: 'Pleases me, to get to know you.'" },
          { kind: "translation", prompt: "Translate: 'How can I help you? (formal)'", answer: "Wie kann ich Ihnen helfen?", explanation: "'Ihnen' = formal dative 'you'. Standard professional phrase." },
        ],
        reviewHint: "Practice introducing yourself with your real job title. Say it aloud 3 times.",
      },
      travel: {
        goal: "Greet locals and introduce yourself when travelling",
        vocabulary: [
          { german: "Hallo", english: "Hello (informal)", example: "Hallo, ich bin Tourist." },
          { german: "Guten Tag", english: "Good day" },
          { german: "Entschuldigung", english: "Excuse me" },
          { german: "Ich komme aus ...", english: "I come from ..." },
          { german: "Sprechen Sie Englisch?", english: "Do you speak English?" },
          { german: "Ich spreche ein bisschen Deutsch", english: "I speak a little German" },
          { german: "Tschüss", english: "Bye (informal)" },
          { german: "Danke schön", english: "Thank you very much" },
        ],
        dialogue: [
          { speaker: "Tourist", german: "Entschuldigung, sprechen Sie Englisch?", english: "Excuse me, do you speak English?" },
          { speaker: "Einheimischer", german: "Ein bisschen. Woher kommen Sie?", english: "A little. Where are you from?" },
          { speaker: "Tourist", german: "Ich komme aus England. Ich heiße James.", english: "I come from England. My name is James." },
          { speaker: "Einheimischer", german: "Willkommen! Ich bin Stefan. Kann ich Ihnen helfen?", english: "Welcome! I'm Stefan. Can I help you?" },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "You need help at a train station. How do you start?", options: ["Entschuldigung, sprechen Sie Englisch?", "Hey, English?", "Ich will Hilfe.", "Wo ist mein Zug?"], answer: "Entschuldigung, sprechen Sie Englisch?", explanation: "Always start with 'Entschuldigung' (excuse me) to be polite." },
          { kind: "fill-blank", prompt: "Complete: 'Ich ___ aus Frankreich.'", options: ["komme", "bin", "heiße", "spreche"], answer: "komme", explanation: "'Ich komme aus ...' = I come from ..." },
          { kind: "reorder", prompt: "Say: 'I speak a little German'", words: ["ein", "Ich", "Deutsch", "bisschen", "spreche"], answer: "Ich spreche ein bisschen Deutsch", explanation: "Subject first, verb second, then the rest." },
          { kind: "translation", prompt: "Translate: 'Thank you very much'", answer: "Danke schön", explanation: "'Danke' = thanks, 'schön' = beautifully/nicely." },
          { kind: "match-pair", prompt: "Match the greetings to their meaning", pairs: [{ left: "Guten Morgen", right: "Good morning" }, { left: "Guten Tag", right: "Good day" }, { left: "Guten Abend", right: "Good evening" }, { left: "Tschüss", right: "Bye" }], answer: "matched", explanation: "These cover greetings from morning to night." },
        ],
        reviewHint: "Practice saying 'Entschuldigung, sprechen Sie Englisch?' naturally 5 times.",
      },
      study: {
        goal: "Introduce yourself in a university or classroom setting",
        vocabulary: [
          { german: "der Student / die Studentin", english: "student (m/f)" },
          { german: "Ich studiere ...", english: "I study ..." },
          { german: "die Universität", english: "the university" },
          { german: "die Vorlesung", english: "the lecture" },
          { german: "der Professor / die Professorin", english: "professor (m/f)" },
          { german: "das Semester", english: "the semester" },
          { german: "Ich bin im ... Semester", english: "I'm in my ... semester" },
          { german: "Freut mich", english: "Nice to meet you" },
        ],
        dialogue: [
          { speaker: "Lena", german: "Hallo! Ich bin Lena. Studierst du auch Informatik?", english: "Hi! I'm Lena. Do you also study computer science?" },
          { speaker: "Tom", german: "Ja! Ich heiße Tom. Ich bin im zweiten Semester.", english: "Yes! My name is Tom. I'm in my second semester." },
          { speaker: "Lena", german: "Cool, ich auch. Hast du die Vorlesung bei Professor Meier?", english: "Cool, me too. Do you have the lecture with Professor Meier?" },
          { speaker: "Tom", german: "Ja, die ist sehr gut. Freut mich!", english: "Yes, it's very good. Nice to meet you!" },
        ],
        exercises: [
          { kind: "fill-blank", prompt: "Complete: 'Ich ___ Informatik an der Universität München.'", options: ["studiere", "studie", "studiert", "studieren"], answer: "studiere", explanation: "'ich studiere' — regular verb conjugation with -e ending." },
          { kind: "multiple-choice", prompt: "How do you ask 'What do you study?' (informal)?", options: ["Was studierst du?", "Was studieren Sie?", "Was ist dein Studium?", "Wo lernst du?"], answer: "Was studierst du?", explanation: "'du studierst' uses informal register. 'Was studierst du?'" },
          { kind: "reorder", prompt: "Say: 'I am in my third semester'", words: ["dritten", "Ich", "bin", "Semester", "im"], answer: "Ich bin im dritten Semester", explanation: "'im' = in dem (in the). Ordinal: dritten = third." },
          { kind: "translation", prompt: "Translate: 'Nice to meet you'", answer: "Freut mich", explanation: "Literally 'It pleases me'. Standard greeting response." },
          { kind: "match-pair", prompt: "Match university vocabulary", pairs: [{ left: "die Vorlesung", right: "lecture" }, { left: "das Semester", right: "semester" }, { left: "der Professor", right: "professor" }, { left: "die Studentin", right: "female student" }], answer: "matched", explanation: "Essential university vocabulary." },
        ],
        reviewHint: "Write a 3-sentence intro about yourself as a student. Read it aloud.",
      },
      default: {
        goal: "Introduce yourself, greet people, and ask about others",
        vocabulary: [
          { german: "Hallo", english: "Hello", example: "Hallo, ich bin Anna." },
          { german: "Guten Morgen", english: "Good morning" },
          { german: "Guten Tag", english: "Good day (formal hello)" },
          { german: "Tschüss", english: "Bye (informal)" },
          { german: "Auf Wiedersehen", english: "Goodbye (formal)" },
          { german: "Wie heißen Sie?", english: "What is your name? (formal)" },
          { german: "Woher kommen Sie?", english: "Where are you from?" },
          { german: "Freut mich", english: "Nice to meet you" },
        ],
        dialogue: [
          { speaker: "Anna", german: "Guten Tag! Ich heiße Anna. Und Sie?", english: "Good day! My name is Anna. And you?" },
          { speaker: "Herr Müller", german: "Ich bin Thomas Müller. Freut mich.", english: "I'm Thomas Müller. Nice to meet you." },
          { speaker: "Anna", german: "Freut mich auch! Woher kommen Sie?", english: "Nice to meet you too! Where are you from?" },
          { speaker: "Herr Müller", german: "Ich komme aus München.", english: "I come from Munich." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "How do you say 'My name is Anna' in German?", options: ["Ich heiße Anna.", "Ich habe Anna.", "Ich bin Anna heiße.", "Ich Anna heiße."], answer: "Ich heiße Anna.", explanation: "'heißen' means 'to be called'. Verb goes in position 2." },
          { kind: "fill-blank", prompt: "Complete: 'Guten Tag, ich ___ Thomas.'", options: ["bin", "bist", "ist", "sind"], answer: "bin", explanation: "'ich' always pairs with 'bin' (I am)." },
          { kind: "multiple-choice", prompt: "Which greeting works at 3 PM?", options: ["Guten Tag", "Guten Morgen", "Guten Abend", "Tschüss"], answer: "Guten Tag", explanation: "'Guten Tag' is used from late morning through afternoon." },
          { kind: "reorder", prompt: "Say: 'Where do you come from? (formal)'", words: ["kommen", "Woher", "Sie", "?"], answer: "Woher kommen Sie?", explanation: "Question word first, verb position 2, then subject." },
          { kind: "translation", prompt: "Translate: 'Nice to meet you'", answer: "Freut mich", explanation: "Literally 'It pleases me'. Standard greeting." },
        ],
        reviewHint: "Practice introducing yourself out loud 3 times. Review again tomorrow.",
      },
    },
  },

  /* ── 2. Numbers, Time & Appointments ── */
  {
    lessonId: "numbers-time",
    grammarPoints: [
      {
        rule: "German numbers reverse after 20: einundzwanzig (one-and-twenty = 21).",
        table: {
          headers: ["Number", "German"],
          rows: [
            ["1-10", "eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn"],
            ["11-12", "elf, zwölf"],
            ["20,30...", "zwanzig, dreißig, vierzig, fünfzig..."],
            ["21,22...", "einundzwanzig, zweiundzwanzig..."],
          ],
        },
      },
      {
        rule: "Time: 'Es ist ... Uhr'. 'halb' = half TO the next hour (halb vier = 3:30).",
        table: {
          headers: ["Time", "German"],
          rows: [
            ["3:00", "Es ist drei Uhr"],
            ["3:15", "Es ist Viertel nach drei"],
            ["3:30", "Es ist halb vier (half TO four!)"],
            ["3:45", "Es ist Viertel vor vier"],
          ],
        },
      },
    ],
    overlays: {
      work: {
        goal: "Schedule meetings and discuss deadlines",
        vocabulary: [
          { german: "der Termin", english: "the appointment/meeting" },
          { german: "die Besprechung", english: "the meeting" },
          { german: "um ... Uhr", english: "at ... o'clock" },
          { german: "bis wann?", english: "until when?" },
          { german: "die Frist", english: "the deadline" },
          { german: "morgen", english: "tomorrow" },
          { german: "nächste Woche", english: "next week" },
          { german: "Passt Ihnen ...?", english: "Does ... suit you?" },
        ],
        dialogue: [
          { speaker: "Herr Klein", german: "Wann ist die Besprechung?", english: "When is the meeting?" },
          { speaker: "Frau Lang", german: "Um halb drei. Passt Ihnen das?", english: "At 2:30. Does that suit you?" },
          { speaker: "Herr Klein", german: "Ja, perfekt. Und die Frist für den Bericht?", english: "Yes, perfect. And the deadline for the report?" },
          { speaker: "Frau Lang", german: "Bis Freitag, siebzehn Uhr.", english: "By Friday, 5 PM." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "Your meeting is at 2:30. What does 'halb drei' mean?", options: ["2:30", "3:30", "2:00", "3:00"], answer: "2:30", explanation: "'halb drei' = half TO three = 2:30. Not 3:30!" },
          { kind: "fill-blank", prompt: "Complete: 'Die Besprechung ist ___ zehn Uhr.'", options: ["um", "an", "in", "bei"], answer: "um", explanation: "'um' is used with specific clock times." },
          { kind: "translation", prompt: "Translate: 'Does Thursday suit you?'", answer: "Passt Ihnen Donnerstag?", explanation: "'Passt Ihnen ...?' is the standard formal way to propose a time." },
          { kind: "reorder", prompt: "Say: 'The deadline is next Friday'", words: ["Freitag", "Die", "nächsten", "Frist", "ist", "am"], answer: "Die Frist ist am nächsten Freitag", explanation: "'am' (an dem) for specific days." },
          { kind: "multiple-choice", prompt: "'Viertel vor vier' means:", options: ["3:45", "4:15", "3:15", "4:45"], answer: "3:45", explanation: "Viertel vor = quarter to. Viertel vor vier = 3:45." },
        ],
        reviewHint: "Describe your daily work schedule in German, using 'um ... Uhr' for each task.",
      },
      travel: {
        goal: "Handle prices, train times, and hotel check-in",
        vocabulary: [
          { german: "Wie viel kostet das?", english: "How much does that cost?" },
          { german: "der Zug", english: "the train" },
          { german: "die Abfahrt", english: "departure" },
          { german: "die Ankunft", english: "arrival" },
          { german: "das Ticket", english: "the ticket" },
          { german: "eine Nacht", english: "one night" },
          { german: "Euro", english: "euro" },
          { german: "Wann fährt der Zug?", english: "When does the train leave?" },
        ],
        dialogue: [
          { speaker: "Tourist", german: "Wann fährt der nächste Zug nach Berlin?", english: "When does the next train to Berlin leave?" },
          { speaker: "Schalter", german: "Um vierzehn Uhr fünfundvierzig.", english: "At 14:45." },
          { speaker: "Tourist", german: "Wie viel kostet ein Ticket?", english: "How much does a ticket cost?" },
          { speaker: "Schalter", german: "Neunundzwanzig Euro fünfzig.", english: "Twenty-nine euros fifty." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "What number is 'neunundzwanzig'?", options: ["29", "92", "19", "39"], answer: "29", explanation: "neun-und-zwanzig = nine-and-twenty = 29." },
          { kind: "fill-blank", prompt: "You ask about cost: 'Wie ___ kostet das?'", options: ["viel", "groß", "gut", "oft"], answer: "viel", explanation: "'Wie viel' = how much." },
          { kind: "translation", prompt: "Translate: 'When does the train leave?'", answer: "Wann fährt der Zug?", explanation: "'Wann' = when, 'fährt' = drives/leaves." },
          { kind: "reorder", prompt: "Say: 'One ticket to Munich, please'", words: ["bitte", "Ticket", "nach", "Ein", "München", ","], answer: "Ein Ticket nach München, bitte", explanation: "'nach' = to (for cities). 'bitte' at the end for politeness." },
          { kind: "multiple-choice", prompt: "'Halb zwei' means:", options: ["1:30", "2:30", "2:00", "12:30"], answer: "1:30", explanation: "'halb zwei' = half TO two = 1:30." },
        ],
        reviewHint: "Practice saying prices aloud: 5,50€ → 'fünf Euro fünfzig'. Do 10 random prices.",
      },
      default: {
        goal: "Handle numbers, tell time, and manage simple appointments",
        vocabulary: [
          { german: "die Uhr", english: "clock / o'clock" },
          { german: "halb", english: "half (to the next hour!)" },
          { german: "Viertel nach", english: "quarter past" },
          { german: "Viertel vor", english: "quarter to" },
          { german: "Montag", english: "Monday" },
          { german: "Mittwoch", english: "Wednesday" },
          { german: "Wie viel kostet das?", english: "How much does that cost?" },
          { german: "der Termin", english: "the appointment" },
        ],
        dialogue: [
          { speaker: "Kunde", german: "Entschuldigung, wie viel kostet das?", english: "Excuse me, how much does that cost?" },
          { speaker: "Verkäufer", german: "Das kostet fünf Euro fünfzig.", english: "That costs five euros fifty." },
          { speaker: "Kunde", german: "Und wann schließen Sie?", english: "And when do you close?" },
          { speaker: "Verkäufer", german: "Um halb sieben.", english: "At half past six." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "What number is 'dreiundzwanzig'?", options: ["23", "32", "13", "33"], answer: "23", explanation: "drei-und-zwanzig = three-and-twenty = 23." },
          { kind: "fill-blank", prompt: "'Halb vier' means ___", options: ["3:30", "4:30", "3:15", "4:00"], answer: "3:30", explanation: "'Halb vier' = half TO four = 3:30." },
          { kind: "translation", prompt: "Translate: 'How much does that cost?'", answer: "Wie viel kostet das?", explanation: "'Wie viel' = how much, 'kostet' = costs." },
          { kind: "reorder", prompt: "Say: 'It is quarter past three'", words: ["nach", "Es", "drei", "Viertel", "ist"], answer: "Es ist Viertel nach drei", explanation: "'Viertel nach' = quarter past." },
          { kind: "multiple-choice", prompt: "'Viertel vor vier' means:", options: ["3:45", "4:15", "3:15", "4:45"], answer: "3:45", explanation: "Viertel vor = quarter to. Viertel vor vier = 3:45." },
        ],
        reviewHint: "Practice counting backwards from 30. Say today's date and time in German.",
      },
    },
  },

  /* ── 3. Personal Pronouns ── */
  {
    lessonId: "personal-pronouns",
    grammarPoints: [
      {
        rule: "German has 7 pronoun forms. 'Sie' (capital) = formal you. 'sie' (lower) = she/they.",
        table: {
          headers: ["Pronoun", "English", "Usage"],
          rows: [
            ["ich", "I", "yourself"],
            ["du", "you (informal)", "friends, family, children"],
            ["er / sie / es", "he / she / it", "third person singular"],
            ["wir", "we", "your group"],
            ["ihr", "you all (informal)", "group of friends"],
            ["sie", "they", "third person plural"],
            ["Sie", "you (formal)", "strangers, professional"],
          ],
        },
      },
    ],
    overlays: {
      work: {
        goal: "Address colleagues and clients with the correct formality level",
        vocabulary: [
          { german: "Sie", english: "you (formal) — clients, management" },
          { german: "du", english: "you (informal) — after being offered" },
          { german: "Können wir uns duzen?", english: "Can we use 'du' with each other?" },
          { german: "der Chef / die Chefin", english: "the boss (m/f)" },
          { german: "das Team", english: "the team" },
          { german: "Wir arbeiten zusammen", english: "We work together" },
          { german: "er/sie ist zuständig für", english: "he/she is responsible for" },
          { german: "Wie geht es Ihnen?", english: "How are you? (formal)" },
        ],
        dialogue: [
          { speaker: "Frau Braun", german: "Guten Morgen! Wie geht es Ihnen?", english: "Good morning! How are you?" },
          { speaker: "Markus", german: "Gut, danke, Frau Braun. Und Ihnen?", english: "Good, thanks, Ms. Braun. And you?" },
          { speaker: "Frau Braun", german: "Auch gut. Wir duzen uns im Team — sag einfach Lisa!", english: "Also good. We use 'du' in the team — just say Lisa!" },
          { speaker: "Markus", german: "Oh, danke Lisa! Das finde ich toll.", english: "Oh, thanks Lisa! I think that's great." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "A client you've never met asks how you're doing. You respond with:", options: ["Gut, danke. Und Ihnen?", "Gut, und dir?", "Geht so, und du?", "Mir geht's."], answer: "Gut, danke. Und Ihnen?", explanation: "Use 'Ihnen' (formal) with clients you haven't met." },
          { kind: "fill-blank", prompt: "Your team lead says 'Wir duzen ___ im Team.'", options: ["uns", "Sie", "euch", "dich"], answer: "uns", explanation: "'uns duzen' = we use 'du' among ourselves." },
          { kind: "reorder", prompt: "Say: 'She is responsible for the project'", words: ["das", "ist", "Projekt", "Sie", "zuständig", "für"], answer: "Sie ist zuständig für das Projekt", explanation: "'sie ist zuständig für' = she is responsible for." },
          { kind: "translation", prompt: "Translate: 'How are you?' (formal)", answer: "Wie geht es Ihnen?", explanation: "'Ihnen' = formal dative 'you'." },
          { kind: "multiple-choice", prompt: "When can you switch from 'Sie' to 'du' at work?", options: ["When the other person offers it", "After one week", "Immediately with everyone", "Only with interns"], answer: "When the other person offers it", explanation: "The higher-ranking or older person offers the 'du'. Never assume." },
        ],
        reviewHint: "List 5 people at work and decide: Sie or du? Practice a short greeting for each.",
      },
      default: {
        goal: "Use all pronouns correctly and understand Sie/du register",
        vocabulary: [
          { german: "Sie", english: "you (formal)" },
          { german: "du", english: "you (informal)" },
          { german: "wir", english: "we" },
          { german: "ihr", english: "you all (informal)" },
          { german: "Wie geht es Ihnen?", english: "How are you? (formal)" },
          { german: "Wie geht es dir?", english: "How are you? (informal)" },
          { german: "er / sie / es", english: "he / she / it" },
          { german: "sie (plural)", english: "they" },
        ],
        dialogue: [
          { speaker: "Lehrer", german: "Guten Tag. Wie heißen Sie?", english: "Good day. What's your name?" },
          { speaker: "Student", german: "Ich heiße Max. Und wie heißen Sie?", english: "My name is Max. And what's your name?" },
          { speaker: "Lehrer", german: "Ich bin Frau Schmidt. Wir duzen uns hier — sag einfach du!", english: "I'm Ms. Schmidt. We use du here — just use du!" },
          { speaker: "Student", german: "Okay, danke! Woher kommst du?", english: "Okay, thanks! Where are you from?" },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "How do you ask 'How are you?' to your friend?", options: ["Wie geht es dir?", "Wie geht es Ihnen?", "Wie sind Sie?", "Was machst Sie?"], answer: "Wie geht es dir?", explanation: "'dir' = informal dative. Use with friends." },
          { kind: "fill-blank", prompt: "'___ sind aus Deutschland.' (They are from Germany)", options: ["Sie", "Er", "Wir", "Ihr"], answer: "Sie", explanation: "'Sie' (lowercase context = they) + 'sind'." },
          { kind: "reorder", prompt: "Say: 'We are from Austria'", words: ["aus", "Wir", "Österreich", "sind"], answer: "Wir sind aus Österreich", explanation: "Subject + verb + rest. Standard word order." },
          { kind: "translation", prompt: "Translate: 'Are you (formal) from Munich?'", answer: "Kommen Sie aus München?", explanation: "Verb first for yes/no questions. 'Sie kommen' → 'Kommen Sie?'" },
          { kind: "match-pair", prompt: "Match the pronoun to its use", pairs: [{ left: "du", right: "friend" }, { left: "Sie", right: "boss" }, { left: "ihr", right: "group of friends" }, { left: "wir", right: "our group" }], answer: "matched", explanation: "Register matters in German more than English." },
        ],
        reviewHint: "For each pronoun, say one sentence about someone you know. Practice aloud.",
      },
    },
  },

  /* ── 4. Articles & Gender ── */
  {
    lessonId: "articles-gender",
    grammarPoints: [
      {
        rule: "Every German noun has a gender: der (masculine), die (feminine), das (neuter). Always learn the article WITH the noun.",
        table: {
          headers: ["Gender", "Definite", "Indefinite", "Patterns"],
          rows: [
            ["Masculine (der)", "der Tisch", "ein Tisch", "-er, -ling, -ismus endings"],
            ["Feminine (die)", "die Lampe", "eine Lampe", "-ung, -keit, -heit, -schaft endings"],
            ["Neuter (das)", "das Buch", "ein Buch", "-chen, -lein, -ment, -um endings"],
            ["Plural (die)", "die Bücher", "— Bücher", "All plurals use 'die'"],
          ],
        },
      },
    ],
    overlays: {
      work: {
        goal: "Name office items and workplace tools correctly",
        vocabulary: [
          { german: "der Computer", english: "the computer" },
          { german: "die E-Mail", english: "the email" },
          { german: "das Büro", english: "the office" },
          { german: "der Drucker", english: "the printer" },
          { german: "die Tastatur", english: "the keyboard" },
          { german: "das Telefon", english: "the phone" },
          { german: "der Schreibtisch", english: "the desk" },
          { german: "die Besprechung", english: "the meeting" },
        ],
        dialogue: [
          { speaker: "Markus", german: "Wo ist der Drucker?", english: "Where is the printer?" },
          { speaker: "Kollegin", german: "Der Drucker ist im Flur. Neben dem Büro von Frau Klein.", english: "The printer is in the hallway. Next to Ms. Klein's office." },
          { speaker: "Markus", german: "Danke! Und wo finde ich eine Tastatur?", english: "Thanks! And where can I find a keyboard?" },
          { speaker: "Kollegin", german: "Frag die IT-Abteilung. Die haben alles.", english: "Ask the IT department. They have everything." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "What article does 'Büro' (office) take?", options: ["das Büro", "der Büro", "die Büro", "ein Büro"], answer: "das Büro", explanation: "'Büro' is neuter → das Büro." },
          { kind: "fill-blank", prompt: "'Wo ist ___ Drucker?'", options: ["der", "die", "das", "ein"], answer: "der", explanation: "'Drucker' is masculine → der Drucker." },
          { kind: "match-pair", prompt: "Match the office item to its article", pairs: [{ left: "der", right: "Computer" }, { left: "die", right: "E-Mail" }, { left: "das", right: "Telefon" }, { left: "die", right: "Tastatur" }], answer: "matched", explanation: "Each noun's article must be memorized." },
          { kind: "reorder", prompt: "Say: 'The email is important'", words: ["wichtig", "Die", "E-Mail", "ist"], answer: "Die E-Mail ist wichtig", explanation: "'E-Mail' is feminine → Die E-Mail." },
          { kind: "translation", prompt: "Translate: 'I need a computer'", answer: "Ich brauche einen Computer", explanation: "'brauchen' takes accusative. Masculine ein → einen." },
        ],
        reviewHint: "Label 5 objects at your desk in German with their article. Say them aloud.",
      },
      default: {
        goal: "Name everyday things around you with the right article",
        vocabulary: [
          { german: "der Tisch", english: "the table" },
          { german: "die Lampe", english: "the lamp" },
          { german: "das Buch", english: "the book" },
          { german: "der Stuhl", english: "the chair" },
          { german: "die Tür", english: "the door" },
          { german: "das Fenster", english: "the window" },
          { german: "der Schlüssel", english: "the key" },
          { german: "die Tasche", english: "the bag" },
        ],
        dialogue: [
          { speaker: "Anna", german: "Wo ist der Schlüssel?", english: "Where is the key?" },
          { speaker: "Tom", german: "Der Schlüssel ist auf dem Tisch.", english: "The key is on the table." },
          { speaker: "Anna", german: "Und das Buch? Ich brauche das Buch.", english: "And the book? I need the book." },
          { speaker: "Tom", german: "Das Buch ist in der Tasche.", english: "The book is in the bag." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "What's the article for 'Buch' (book)?", options: ["das", "der", "die", "ein"], answer: "das", explanation: "'Buch' is neuter → das Buch." },
          { kind: "fill-blank", prompt: "'___ Lampe ist kaputt.' (The lamp is broken)", options: ["Die", "Der", "Das", "Ein"], answer: "Die", explanation: "'Lampe' is feminine → Die Lampe." },
          { kind: "match-pair", prompt: "Match articles to nouns", pairs: [{ left: "der", right: "Tisch" }, { left: "die", right: "Tür" }, { left: "das", right: "Fenster" }, { left: "die", right: "Tasche" }], answer: "matched", explanation: "Gender must be memorized with each noun." },
          { kind: "reorder", prompt: "Say: 'The chair is here'", words: ["hier", "Der", "ist", "Stuhl"], answer: "Der Stuhl ist hier", explanation: "'Stuhl' is masculine → Der Stuhl." },
          { kind: "translation", prompt: "Translate: 'Where is the door?'", answer: "Wo ist die Tür?", explanation: "'Tür' is feminine → die Tür." },
        ],
        reviewHint: "Point to 5 objects at home and say their name with the article in German.",
      },
    },
  },

  /* ── 5. Present Tense ── */
  {
    lessonId: "present-tense",
    grammarPoints: [
      {
        rule: "Remove -en from the infinitive to get the stem, then add personal endings: -e, -st, -t, -en, -t, -en.",
        table: {
          headers: ["Person", "machen", "arbeiten", "haben"],
          rows: [
            ["ich", "mache", "arbeite", "habe"],
            ["du", "machst", "arbeitest", "hast"],
            ["er/sie/es", "macht", "arbeitet", "hat"],
            ["wir", "machen", "arbeiten", "haben"],
            ["ihr", "macht", "arbeitet", "habt"],
            ["sie/Sie", "machen", "arbeiten", "haben"],
          ],
        },
      },
    ],
    overlays: {
      work: {
        goal: "Describe what you and your team do at work",
        vocabulary: [
          { german: "arbeiten", english: "to work" },
          { german: "schreiben", english: "to write" },
          { german: "lesen", english: "to read" },
          { german: "planen", english: "to plan" },
          { german: "telefonieren", english: "to make phone calls" },
          { german: "organisieren", english: "to organize" },
          { german: "der Bericht", english: "the report" },
          { german: "das Projekt", english: "the project" },
        ],
        dialogue: [
          { speaker: "Chefin", german: "Was machst du heute?", english: "What are you doing today?" },
          { speaker: "Markus", german: "Ich schreibe den Bericht und plane das Meeting.", english: "I'm writing the report and planning the meeting." },
          { speaker: "Chefin", german: "Gut. Und was macht das Team?", english: "Good. And what's the team doing?" },
          { speaker: "Markus", german: "Sie arbeiten am Projekt. Lisa telefoniert mit dem Kunden.", english: "They're working on the project. Lisa is calling the client." },
        ],
        exercises: [
          { kind: "fill-blank", prompt: "'Ich ___ den Bericht.' (I write the report)", options: ["schreibe", "schreibst", "schreibt", "schreiben"], answer: "schreibe", explanation: "'ich' + stem 'schreib' + ending '-e'." },
          { kind: "multiple-choice", prompt: "How do you say 'She plans the meeting'?", options: ["Sie plant das Meeting.", "Sie planen das Meeting.", "Sie planst das Meeting.", "Sie plannt das Meeting."], answer: "Sie plant das Meeting.", explanation: "'sie (she)' takes '-t' ending: plant." },
          { kind: "reorder", prompt: "Say: 'We work on the project'", words: ["am", "arbeiten", "Projekt", "Wir"], answer: "Wir arbeiten am Projekt", explanation: "'am' = an dem. Verb in position 2." },
          { kind: "translation", prompt: "Translate: 'What are you doing today?'", answer: "Was machst du heute?", explanation: "'machst' = 'du' form of 'machen'." },
          { kind: "fill-blank", prompt: "'Lisa ___ mit dem Kunden.' (Lisa calls the client)", options: ["telefoniert", "telefoniere", "telefonierst", "telefonieren"], answer: "telefoniert", explanation: "'er/sie/es' takes '-t' ending: telefoniert." },
        ],
        reviewHint: "Write 5 sentences about what you do at work using different verbs. Say them aloud.",
      },
      default: {
        goal: "Describe daily routines and what people around you do",
        vocabulary: [
          { german: "machen", english: "to do/make" },
          { german: "gehen", english: "to go" },
          { german: "sprechen", english: "to speak" },
          { german: "wohnen", english: "to live" },
          { german: "kochen", english: "to cook" },
          { german: "lernen", english: "to learn" },
          { german: "spielen", english: "to play" },
          { german: "kaufen", english: "to buy" },
        ],
        dialogue: [
          { speaker: "Anna", german: "Was machst du am Wochenende?", english: "What do you do on the weekend?" },
          { speaker: "Tom", german: "Ich koche und gehe spazieren. Und du?", english: "I cook and go for a walk. And you?" },
          { speaker: "Anna", german: "Wir spielen Fußball. Kommst du mit?", english: "We play football. Will you come along?" },
          { speaker: "Tom", german: "Ja, gerne! Wann spielen wir?", english: "Yes, gladly! When do we play?" },
        ],
        exercises: [
          { kind: "fill-blank", prompt: "'Er ___ in Berlin.' (He lives in Berlin)", options: ["wohnt", "wohne", "wohnst", "wohnen"], answer: "wohnt", explanation: "'er' takes '-t' ending: wohnt." },
          { kind: "multiple-choice", prompt: "How do you say 'We learn German'?", options: ["Wir lernen Deutsch.", "Wir lernst Deutsch.", "Wir lernt Deutsch.", "Wir lerne Deutsch."], answer: "Wir lernen Deutsch.", explanation: "'wir' takes '-en' ending: lernen." },
          { kind: "reorder", prompt: "Say: 'She cooks on the weekend'", words: ["Wochenende", "Sie", "am", "kocht"], answer: "Sie kocht am Wochenende", explanation: "Verb in position 2. 'am' = on the." },
          { kind: "translation", prompt: "Translate: 'I go to the store'", answer: "Ich gehe in den Laden", explanation: "'gehe' = ich-form of 'gehen'. 'in den' = into the (accusative)." },
          { kind: "fill-blank", prompt: "'Ihr ___ Fußball.' (You all play football)", options: ["spielt", "spielen", "spielst", "spiele"], answer: "spielt", explanation: "'ihr' takes '-t' ending: spielt." },
        ],
        reviewHint: "Describe your morning routine in 5 German sentences using present tense.",
      },
    },
  },

  /* ── 6. Survival Phrases ── */
  {
    lessonId: "everyday-phrases",
    grammarPoints: [
      { rule: "Fixed expressions are complete phrases to memorize as units. Most use 'bitte' (please) or 'können' (can)." },
      { rule: "Polite requests: 'Können Sie mir bitte ...?' or 'Ich hätte gern ...' (I would like)." },
    ],
    overlays: {
      work: {
        goal: "Make polite requests and handle common office situations",
        vocabulary: [
          { german: "Können Sie mir bitte helfen?", english: "Can you please help me?" },
          { german: "Ich hätte gern ...", english: "I would like ..." },
          { german: "Entschuldigung für die Störung", english: "Sorry for the interruption" },
          { german: "Könnten Sie das wiederholen?", english: "Could you repeat that?" },
          { german: "Ich verstehe", english: "I understand" },
          { german: "Darf ich eine Frage stellen?", english: "May I ask a question?" },
          { german: "Einen Moment bitte", english: "One moment please" },
          { german: "Ich bin dran", english: "It's my turn" },
        ],
        dialogue: [
          { speaker: "Markus", german: "Entschuldigung für die Störung. Darf ich eine Frage stellen?", english: "Sorry for the interruption. May I ask a question?" },
          { speaker: "Kollegin", german: "Natürlich! Was brauchst du?", english: "Of course! What do you need?" },
          { speaker: "Markus", german: "Könnten Sie mir den Bericht schicken?", english: "Could you send me the report?" },
          { speaker: "Kollegin", german: "Ja, klar. Einen Moment bitte.", english: "Yes, sure. One moment please." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "You want to politely interrupt a colleague:", options: ["Entschuldigung für die Störung.", "Hey, hör mal!", "Ich brauche dich jetzt.", "Stopp!"], answer: "Entschuldigung für die Störung.", explanation: "Polite workplace interruption formula." },
          { kind: "fill-blank", prompt: "'Könnten ___ das bitte wiederholen?'", options: ["Sie", "du", "ich", "wir"], answer: "Sie", explanation: "'Könnten Sie' = Could you (formal). Standard polite request." },
          { kind: "translation", prompt: "Translate: 'May I ask a question?'", answer: "Darf ich eine Frage stellen?", explanation: "'Darf ich' = May I. 'eine Frage stellen' = ask a question." },
          { kind: "reorder", prompt: "Say: 'I would like a coffee, please'", words: ["einen", "hätte", "bitte", "Ich", "Kaffee", "gern", ","], answer: "Ich hätte gern einen Kaffee, bitte", explanation: "'Ich hätte gern' is the polite way to order." },
          { kind: "multiple-choice", prompt: "'Ich verstehe' means:", options: ["I understand", "I need", "I'm sorry", "I want"], answer: "I understand", explanation: "'verstehen' = to understand. 'Ich verstehe' = I understand." },
        ],
        reviewHint: "Practice saying 'Könnten Sie mir bitte ...' with 3 different requests.",
      },
      default: {
        goal: "Handle basic everyday interactions politely",
        vocabulary: [
          { german: "Entschuldigung", english: "Excuse me / Sorry" },
          { german: "Bitte", english: "Please / You're welcome" },
          { german: "Danke schön", english: "Thank you very much" },
          { german: "Ich hätte gern ...", english: "I would like ..." },
          { german: "Wo ist ...?", english: "Where is ...?" },
          { german: "Können Sie mir helfen?", english: "Can you help me?" },
          { german: "Ich verstehe nicht", english: "I don't understand" },
          { german: "Sprechen Sie langsamer bitte", english: "Speak more slowly please" },
        ],
        dialogue: [
          { speaker: "Tourist", german: "Entschuldigung, wo ist der Bahnhof?", english: "Excuse me, where is the train station?" },
          { speaker: "Passant", german: "Gehen Sie geradeaus, dann rechts.", english: "Go straight ahead, then right." },
          { speaker: "Tourist", german: "Könnten Sie das bitte wiederholen? Langsamer bitte.", english: "Could you repeat that? More slowly please." },
          { speaker: "Passant", german: "Klar! Geradeaus. Dann rechts.", english: "Sure! Straight ahead. Then right." },
        ],
        exercises: [
          { kind: "fill-blank", prompt: "'___, wo ist der Bahnhof?'", options: ["Entschuldigung", "Hallo", "Danke", "Bitte"], answer: "Entschuldigung", explanation: "'Entschuldigung' = Excuse me. To get attention politely." },
          { kind: "multiple-choice", prompt: "You don't understand. You say:", options: ["Ich verstehe nicht.", "Ich weiß alles.", "Das ist gut.", "Kein Problem."], answer: "Ich verstehe nicht.", explanation: "'Ich verstehe nicht' = I don't understand." },
          { kind: "translation", prompt: "Translate: 'I would like a coffee please'", answer: "Ich hätte gern einen Kaffee bitte", explanation: "'Ich hätte gern' is the standard polite ordering phrase." },
          { kind: "reorder", prompt: "Say: 'Can you help me?'", words: ["helfen", "Können", "Sie", "mir", "?"], answer: "Können Sie mir helfen?", explanation: "Modal verb first in questions, main verb at end." },
          { kind: "match-pair", prompt: "Match phrases to situations", pairs: [{ left: "Entschuldigung", right: "get attention" }, { left: "Danke schön", right: "after receiving help" }, { left: "Bitte", right: "making a request" }, { left: "Tschüss", right: "saying goodbye" }], answer: "matched", explanation: "Essential politeness formulas." },
        ],
        reviewHint: "Practice ordering 3 different things using 'Ich hätte gern ...'",
      },
    },
  },

  /* ── 7. Negation ── */
  {
    lessonId: "negation",
    grammarPoints: [
      {
        rule: "'nicht' negates verbs, adjectives, and specific things. 'kein' negates indefinite nouns (replaces ein/eine).",
        table: {
          headers: ["Type", "Positive", "Negative"],
          rows: [
            ["Verb", "Ich arbeite.", "Ich arbeite nicht."],
            ["Adjective", "Das ist gut.", "Das ist nicht gut."],
            ["Indefinite noun", "Ich habe ein Auto.", "Ich habe kein Auto."],
            ["Indefinite plural", "Ich habe Fragen.", "Ich habe keine Fragen."],
          ],
        },
      },
    ],
    overlays: {
      work: {
        goal: "Express what you don't have or can't do at work",
        vocabulary: [
          { german: "nicht", english: "not (for verbs/adjectives)" },
          { german: "kein/keine", english: "no/not a (for nouns)" },
          { german: "Ich habe keine Zeit", english: "I have no time" },
          { german: "Das funktioniert nicht", english: "That doesn't work" },
          { german: "Ich verstehe das nicht", english: "I don't understand that" },
          { german: "Leider nicht", english: "Unfortunately not" },
          { german: "noch nicht", english: "not yet" },
          { german: "Das ist nicht möglich", english: "That's not possible" },
        ],
        dialogue: [
          { speaker: "Chef", german: "Ist der Bericht fertig?", english: "Is the report finished?" },
          { speaker: "Markus", german: "Nein, leider noch nicht. Ich habe keine Daten vom Marketing.", english: "No, unfortunately not yet. I have no data from marketing." },
          { speaker: "Chef", german: "Funktioniert das Tool nicht?", english: "Doesn't the tool work?" },
          { speaker: "Markus", german: "Das Tool funktioniert, aber ich habe keinen Zugang.", english: "The tool works, but I don't have access." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "How do you say 'I have no time'?", options: ["Ich habe keine Zeit.", "Ich habe nicht Zeit.", "Ich nicht habe Zeit.", "Ich habe Zeit kein."], answer: "Ich habe keine Zeit.", explanation: "'Zeit' is feminine noun → 'kein' becomes 'keine'." },
          { kind: "fill-blank", prompt: "'Das funktioniert ___.'", options: ["nicht", "kein", "keine", "nichts"], answer: "nicht", explanation: "'nicht' negates verbs. 'funktioniert nicht' = doesn't work." },
          { kind: "reorder", prompt: "Say: 'I don't understand the email'", words: ["nicht", "die", "verstehe", "Ich", "E-Mail"], answer: "Ich verstehe die E-Mail nicht", explanation: "'nicht' goes at the end when negating a specific verb action." },
          { kind: "translation", prompt: "Translate: 'That's not possible'", answer: "Das ist nicht möglich", explanation: "'nicht' before adjective: 'nicht möglich'." },
          { kind: "fill-blank", prompt: "'Ich habe ___ Fragen.' (I have no questions)", options: ["keine", "nicht", "kein", "nichts"], answer: "keine", explanation: "'Fragen' is plural → 'kein' → 'keine'." },
        ],
        reviewHint: "Write 5 sentences about things you don't have at work, alternating nicht and kein.",
      },
      default: {
        goal: "Express what you don't have or don't do in daily life",
        vocabulary: [
          { german: "nicht", english: "not" },
          { german: "kein/keine", english: "no, not a" },
          { german: "Ich habe kein Geld", english: "I have no money" },
          { german: "Das ist nicht richtig", english: "That's not correct" },
          { german: "Ich weiß nicht", english: "I don't know" },
          { german: "noch nicht", english: "not yet" },
          { german: "nie / niemals", english: "never" },
          { german: "nichts", english: "nothing" },
        ],
        dialogue: [
          { speaker: "Anna", german: "Hast du Hunger?", english: "Are you hungry?" },
          { speaker: "Tom", german: "Nein, ich habe keinen Hunger.", english: "No, I'm not hungry." },
          { speaker: "Anna", german: "Möchtest du nicht mitkommen?", english: "Don't you want to come along?" },
          { speaker: "Tom", german: "Leider nicht. Ich habe keine Zeit.", english: "Unfortunately not. I have no time." },
        ],
        exercises: [
          { kind: "multiple-choice", prompt: "How do you say 'I don't know'?", options: ["Ich weiß nicht.", "Ich weiß kein.", "Ich nicht weiß.", "Ich kenne nicht."], answer: "Ich weiß nicht.", explanation: "'nicht' after the verb to negate it." },
          { kind: "fill-blank", prompt: "'Ich habe ___ Auto.' (I have no car)", options: ["kein", "nicht", "keine", "nichts"], answer: "kein", explanation: "'Auto' is neuter → 'kein Auto'. No change for neuter." },
          { kind: "reorder", prompt: "Say: 'That is not correct'", words: ["nicht", "ist", "richtig", "Das"], answer: "Das ist nicht richtig", explanation: "'nicht' before the adjective it negates." },
          { kind: "translation", prompt: "Translate: 'I have no time'", answer: "Ich habe keine Zeit", explanation: "'Zeit' is feminine → 'keine Zeit'." },
          { kind: "match-pair", prompt: "Match: nicht or kein?", pairs: [{ left: "nicht", right: "verbs & adjectives" }, { left: "kein", right: "indefinite nouns" }, { left: "nichts", right: "nothing at all" }, { left: "nie", right: "never" }], answer: "matched", explanation: "nicht = verbs/adjectives, kein = replaces ein/eine." },
        ],
        reviewHint: "Say 5 things you don't have and 5 things you don't do. Alternate nicht / kein.",
      },
    },
  },

  /* ── 8. W-Questions ── */
  {
    lessonId: "w-questions",
    grammarPoints: [
      {
        rule: "W-questions: W-word in position 1, verb in position 2, subject in position 3.",
        table: {
          headers: ["W-Word", "English", "Example"],
          rows: [
            ["Was", "What", "Was machst du?"],
            ["Wer", "Who", "Wer ist das?"],
            ["Wo", "Where (at)", "Wo wohnst du?"],
            ["Woher", "Where from", "Woher kommen Sie?"],
            ["Wohin", "Where to", "Wohin gehst du?"],
            ["Wann", "When", "Wann fängt es an?"],
            ["Warum", "Why", "Warum lernst du Deutsch?"],
            ["Wie", "How", "Wie geht es Ihnen?"],
          ],
        },
      },
    ],
    overlays: {
      work: {
        goal: "Ask clear questions in meetings and work contexts",
        vocabulary: [
          { german: "Wann ist die Besprechung?", english: "When is the meeting?" },
          { german: "Wo finde ich ...?", english: "Where can I find ...?" },
          { german: "Wer ist zuständig?", english: "Who is responsible?" },
          { german: "Wie funktioniert das?", english: "How does that work?" },
          { german: "Was brauchen Sie?", english: "What do you need?" },
          { german: "Warum ist das wichtig?", english: "Why is that important?" },
          { german: "Bis wann?", english: "By when?" },
          { german: "Wie viele Teilnehmer?", english: "How many participants?" },
        ],
        dialogue: [
          { speaker: "Markus", german: "Wann ist die nächste Besprechung?", english: "When is the next meeting?" },
          { speaker: "Kollegin", german: "Am Mittwoch um zehn. Warum fragst du?", english: "On Wednesday at ten. Why do you ask?" },
          { speaker: "Markus", german: "Wer ist zuständig für die Präsentation?", english: "Who is responsible for the presentation?" },
          { speaker: "Kollegin", german: "Das macht Herr Schmidt. Was brauchst du von ihm?", english: "Mr. Schmidt does that. What do you need from him?" },
        ],
        exercises: [
          { kind: "fill-blank", prompt: "'___ ist die Besprechung?' (When is the meeting?)", options: ["Wann", "Wo", "Was", "Wer"], answer: "Wann", explanation: "'Wann' = When. For asking about time." },
          { kind: "multiple-choice", prompt: "You want to know who handles the project:", options: ["Wer ist zuständig für das Projekt?", "Was macht das Projekt?", "Wo ist das Projekt?", "Warum das Projekt?"], answer: "Wer ist zuständig für das Projekt?", explanation: "'Wer' = Who. 'zuständig für' = responsible for." },
          { kind: "reorder", prompt: "Ask: 'How does that work?'", words: ["das", "funktioniert", "Wie", "?"], answer: "Wie funktioniert das?", explanation: "W-word → verb → subject/rest." },
          { kind: "translation", prompt: "Translate: 'Where can I find the printer?'", answer: "Wo finde ich den Drucker?", explanation: "'Wo' = where. 'finde ich' = can I find." },
          { kind: "fill-blank", prompt: "'___ brauchen Sie noch?' (What else do you need?)", options: ["Was", "Wann", "Wo", "Wer"], answer: "Was", explanation: "'Was' = What. Standard question for needs." },
        ],
        reviewHint: "Write one question with each W-word about your workday. Practice asking aloud.",
      },
      default: {
        goal: "Ask the right questions in any everyday situation",
        vocabulary: [
          { german: "Was machst du?", english: "What are you doing?" },
          { german: "Wo ist die Toilette?", english: "Where is the toilet?" },
          { german: "Wann kommst du?", english: "When are you coming?" },
          { german: "Warum lernst du Deutsch?", english: "Why are you learning German?" },
          { german: "Wie geht es dir?", english: "How are you?" },
          { german: "Wer ist das?", english: "Who is that?" },
          { german: "Woher kommst du?", english: "Where are you from?" },
          { german: "Wohin gehst du?", english: "Where are you going?" },
        ],
        dialogue: [
          { speaker: "Anna", german: "Wohin gehst du heute Abend?", english: "Where are you going tonight?" },
          { speaker: "Tom", german: "Ich gehe ins Kino. Warum fragst du?", english: "I'm going to the cinema. Why do you ask?" },
          { speaker: "Anna", german: "Was läuft? Und wann fängt der Film an?", english: "What's playing? And when does the movie start?" },
          { speaker: "Tom", german: "Um acht. Kommst du mit?", english: "At eight. Want to come along?" },
        ],
        exercises: [
          { kind: "fill-blank", prompt: "'___ gehst du?' (Where are you going?)", options: ["Wohin", "Wo", "Woher", "Wann"], answer: "Wohin", explanation: "'Wohin' = Where to (direction). 'Wo' = where (location)." },
          { kind: "multiple-choice", prompt: "You want to ask 'Why do you learn German?'", options: ["Warum lernst du Deutsch?", "Warum du Deutsch lernst?", "Wann lernst du Deutsch?", "Was lernst du Deutsch?"], answer: "Warum lernst du Deutsch?", explanation: "W-word first, then verb, then subject." },
          { kind: "reorder", prompt: "Ask: 'When does the film start?'", words: ["an", "der", "Wann", "fängt", "Film", "?"], answer: "Wann fängt der Film an?", explanation: "'anfangen' is separable: fängt...an." },
          { kind: "translation", prompt: "Translate: 'Who is that?'", answer: "Wer ist das?", explanation: "'Wer' = Who. Simple and essential question." },
          { kind: "match-pair", prompt: "Match W-words to their meaning", pairs: [{ left: "Wo", right: "Where (location)" }, { left: "Wohin", right: "Where (direction)" }, { left: "Woher", right: "Where from" }, { left: "Wann", right: "When" }], answer: "matched", explanation: "Wo = at, Wohin = to, Woher = from." },
        ],
        reviewHint: "Write one question with each W-word about your daily life. Practice asking a partner.",
      },
    },
  },
]

/* ── Build final content by merging skeleton + overlay ── */
function resolveLesson(skeleton: LessonSkeleton, purpose: Purpose | null): LessonContent {
  const p = purpose ?? "daily"
  const overlay = skeleton.overlays[p] ?? skeleton.overlays["default"]!
  return {
    lessonId: skeleton.lessonId,
    goal: overlay.goal,
    grammarPoints: skeleton.grammarPoints,
    vocabulary: overlay.vocabulary,
    dialogue: overlay.dialogue,
    exercises: overlay.exercises,
    reviewHint: overlay.reviewHint,
  }
}

/* ── Public API ── */

/** Get lesson content personalized for the learner's purpose */
export function getLessonContent(lessonId: string, purpose?: Purpose | null): LessonContent | null {
  const skeleton = skeletons.find(s => s.lessonId === lessonId)
  if (!skeleton) return null
  return resolveLesson(skeleton, purpose ?? null)
}

/** Get all lesson content using default overlay (for backwards compat) */
export function getLessonContentDefault(lessonId: string): LessonContent | null {
  return getLessonContent(lessonId, null)
}

/* ── Practice tab helpers ── */
export interface PracticeExercise {
  id: string
  lessonId: string
  lessonTitle: string
  kind: ExerciseKind
  prompt: string
  answer: string
  options?: string[]
  words?: string[]
  pairs?: { left: string; right: string }[]
  explanation?: string
}

/** Flatten all exercises from all lessons for a given purpose */
export function getAllPracticeExercises(purpose?: Purpose | null): PracticeExercise[] {
  const result: PracticeExercise[] = []
  for (const skeleton of skeletons) {
    const content = resolveLesson(skeleton, purpose ?? null)
    content.exercises.forEach((ex, i) => {
      result.push({
        id: `${content.lessonId}-ex-${i}`,
        lessonId: content.lessonId,
        lessonTitle: LESSON_TITLES[content.lessonId] ?? content.lessonId,
        kind: ex.kind,
        prompt: ex.prompt,
        answer: ex.answer,
        options: ex.options,
        words: ex.words,
        pairs: ex.pairs,
        explanation: ex.explanation,
      })
    })
  }
  return result
}

/** Ability-based short names for practice tab filter */
const LESSON_TITLES: Record<string, string> = {
  "greetings-intro":    "Greet & Introduce",
  "numbers-time":       "Numbers & Scheduling",
  "personal-pronouns":  "Formal vs Informal",
  "articles-gender":    "Name Things Correctly",
  "present-tense":      "Describe Actions",
  "everyday-phrases":   "Polite Requests",
  "negation":           "Express What You Don't",
  "w-questions":        "Ask Clear Questions",
}

export function getLessonNames(): { id: string; title: string }[] {
  return skeletons.map(s => ({
    id: s.lessonId,
    title: LESSON_TITLES[s.lessonId] ?? s.lessonId,
  }))
}
