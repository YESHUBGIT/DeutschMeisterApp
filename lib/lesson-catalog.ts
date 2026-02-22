import type { Purpose } from "./use-learner-profile"

/* ═══════════════════════════════════════════════════
   DeutschMeister — Context-Personalized Lesson Catalog

   Design principles:
   1. Every lesson has explicit `prerequisiteIds` so the pathway
      enforces a strict unlock order -- no random jumps.
   2. Grammar progresses A1 -> C1 in a consistent order.
   3. Each lesson targets a specific CEFR level.
   4. Context tags (`contexts`) link lessons to purposes (work,
      travel, study, relocation, exams, daily). When building
      the personalized pathway, we filter + reorder lessons so
      work learners get work-relevant vocabulary examples while
      still covering the same grammar skeleton.
   5. The S-curve phases:
      Phase 1 "Quick Wins" (first ~8)  -> immediate usefulness
      Phase 2 "Structured Growth" (~12) -> systematic expansion
      Phase 3 "Mastery" (last ~8)       -> nuance & fluency
   ═══════════════════════════════════════════════════ */

export type CEFRLevel = "a1" | "a2" | "b1" | "b2" | "c1"
export type Phase = 1 | 2 | 3

export interface LessonCatalogItem {
  id: string
  title: string
  group: string          // visual grouping label
  cefr: CEFRLevel
  phase: Phase
  prerequisiteIds: string[]  // must be completed before unlocking
  /** Which purpose contexts does this lesson prioritize?
   *  "all" = appears for everyone. Otherwise array of Purpose keys. */
  contexts: "all" | Purpose[]
  /** Short description of the grammar focus */
  grammarFocus: string
  /** Example high-utility vocab domains for this lesson */
  vocabHint: string
}

export const lessonCatalog: LessonCatalogItem[] = [
  /* ── PHASE 1: Quick Wins (A1) ── */
  {
    id: "greetings-intro",
    title: "Greetings & Introductions",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: [],
    contexts: "all",
    grammarFocus: "Sein/haben present, basic word order",
    vocabHint: "Hallo, Guten Tag, ich heiBe, woher kommen Sie",
  },
  {
    id: "numbers-time",
    title: "Numbers, Time & Dates",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["greetings-intro"],
    contexts: "all",
    grammarFocus: "Cardinal/ordinal numbers, time expressions",
    vocabHint: "eins-hundert, Uhr, Montag-Sonntag, Januar-Dezember",
  },
  {
    id: "personal-pronouns",
    title: "Personal Pronouns",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["greetings-intro"],
    contexts: "all",
    grammarFocus: "ich/du/er/sie/es/wir/ihr/Sie, formal vs informal",
    vocabHint: "Pronoun usage in context, Sie vs du register",
  },
  {
    id: "articles-gender",
    title: "Articles & Gender",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["personal-pronouns"],
    contexts: "all",
    grammarFocus: "der/die/das, ein/eine, gender patterns",
    vocabHint: "Common nouns with articles, gender heuristics",
  },
  {
    id: "present-tense",
    title: "Present Tense Verbs",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["personal-pronouns"],
    contexts: "all",
    grammarFocus: "Regular verb conjugation, haben/sein",
    vocabHint: "machen, arbeiten, wohnen, sprechen, gehen",
  },
  {
    id: "everyday-phrases",
    title: "Everyday Survival Phrases",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["numbers-time"],
    contexts: "all",
    grammarFocus: "Fixed expressions, polite requests",
    vocabHint: "Entschuldigung, bitte, danke, Wie viel kostet...",
  },
  {
    id: "negation",
    title: "Negation: nicht & kein",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["articles-gender", "present-tense"],
    contexts: "all",
    grammarFocus: "nicht vs kein placement rules",
    vocabHint: "Das ist nicht..., Ich habe kein...",
  },
  {
    id: "question-words",
    title: "Question Words (W-Fragen)",
    group: "Quick Wins",
    cefr: "a1", phase: 1,
    prerequisiteIds: ["present-tense"],
    contexts: "all",
    grammarFocus: "Wer/Was/Wo/Wann/Warum/Wie, V2 word order",
    vocabHint: "W-question sentence building",
  },

  /* ── PHASE 2: Structured Growth (A2 -> B1) ── */
  {
    id: "modal-verbs",
    title: "Modal Verbs",
    group: "Building Blocks",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["present-tense", "negation"],
    contexts: "all",
    grammarFocus: "konnen/mussen/wollen/durfen/sollen, bracket structure",
    vocabHint: "Ability, obligation, permission expressions",
  },
  {
    id: "accusative-case",
    title: "Accusative Case",
    group: "Building Blocks",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["articles-gender", "negation"],
    contexts: "all",
    grammarFocus: "den/einen, accusative pronouns, direct objects",
    vocabHint: "Ich sehe den Mann, Er kauft einen Kaffee",
  },
  {
    id: "dative-case",
    title: "Dative Case",
    group: "Building Blocks",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["accusative-case"],
    contexts: "all",
    grammarFocus: "dem/einem, dative pronouns, indirect objects",
    vocabHint: "Ich gebe dem Mann, mit/von/zu + dative",
  },
  {
    id: "separable-verbs",
    title: "Separable Verbs",
    group: "Building Blocks",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["modal-verbs"],
    contexts: "all",
    grammarFocus: "anfangen/aufhoren/mitbringen, prefix placement",
    vocabHint: "Daily routine: aufstehen, einkaufen, anrufen",
  },
  {
    id: "prepositions-by-case",
    title: "Prepositions by Case",
    group: "Building Blocks",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["dative-case"],
    contexts: "all",
    grammarFocus: "Accusative/dative/two-way prepositions",
    vocabHint: "in, an, auf, unter, neben + Wechselprapositionen",
  },
  {
    id: "past-perfekt",
    title: "Past Tense (Perfekt)",
    group: "Expressing the Past",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["separable-verbs", "accusative-case"],
    contexts: "all",
    grammarFocus: "haben/sein + Partizip II, regular & irregular",
    vocabHint: "Ich habe gemacht, Er ist gegangen, conversation past",
  },
  {
    id: "connectors-weil-dass",
    title: "Connectors: weil, dass, wenn",
    group: "Complex Sentences",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["past-perfekt"],
    contexts: "all",
    grammarFocus: "Subordinate clause word order, verb-final",
    vocabHint: "weil ich arbeite, dass er kommt, wenn es regnet",
  },
  {
    id: "reflexive-verbs",
    title: "Reflexive Verbs",
    group: "Complex Sentences",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["dative-case"],
    contexts: "all",
    grammarFocus: "sich + accusative/dative reflexive pronouns",
    vocabHint: "sich waschen, sich freuen, sich vorstellen",
  },
  {
    id: "possessive-articles",
    title: "Possessive Articles",
    group: "Complex Sentences",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["dative-case"],
    contexts: "all",
    grammarFocus: "mein/dein/sein/ihr/unser in all cases",
    vocabHint: "Family, belongings, workplace ownership",
  },
  {
    id: "comparatives-superlatives",
    title: "Comparatives & Superlatives",
    group: "Complex Sentences",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["connectors-weil-dass"],
    contexts: "all",
    grammarFocus: "groser als, am grosten, irregular forms",
    vocabHint: "gut/besser/am besten, gern/lieber/am liebsten",
  },
  {
    id: "relative-clauses",
    title: "Relative Clauses",
    group: "Complex Sentences",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["connectors-weil-dass", "dative-case"],
    contexts: "all",
    grammarFocus: "der/die/das as relative pronouns, clause structure",
    vocabHint: "Der Mann, der hier arbeitet... Die Frau, die...",
  },

  /* ── Context-specific lessons ── */
  {
    id: "work-office-comm",
    title: "Office Communication",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["modal-verbs", "everyday-phrases"],
    contexts: ["work"],
    grammarFocus: "Formal Sie register, email structure, polite requests",
    vocabHint: "Termin, Besprechung, Kollege, Projekt, Anhang",
  },
  {
    id: "work-meetings",
    title: "Meetings & Presentations",
    group: "Your Context",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["work-office-comm", "connectors-weil-dass"],
    contexts: ["work"],
    grammarFocus: "Structuring arguments, giving opinions, agreeing/disagreeing",
    vocabHint: "Ich schlage vor, Meiner Meinung nach, zusammenfassend",
  },
  {
    id: "travel-navigation",
    title: "Navigation & Transport",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["question-words", "everyday-phrases"],
    contexts: ["travel"],
    grammarFocus: "Direction prepositions, imperative basics",
    vocabHint: "Bahnhof, Fahrkarte, links, rechts, umsteigen",
  },
  {
    id: "travel-dining",
    title: "Dining & Ordering",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["travel-navigation", "accusative-case"],
    contexts: ["travel"],
    grammarFocus: "Ordering patterns, Ich hatte gern, Die Rechnung bitte",
    vocabHint: "Speisekarte, Vorspeise, Getrank, Trinkgeld",
  },
  {
    id: "relocation-registration",
    title: "Registration & Bureaucracy",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["everyday-phrases", "numbers-time"],
    contexts: ["relocation"],
    grammarFocus: "Form-filling vocabulary, formal requests",
    vocabHint: "Anmeldung, Burgeramt, Ausweis, Formular, Termin",
  },
  {
    id: "relocation-housing",
    title: "Housing & Contracts",
    group: "Your Context",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["relocation-registration", "dative-case"],
    contexts: ["relocation"],
    grammarFocus: "Reading contracts, condition descriptions, complaints",
    vocabHint: "Mietvertrag, Kaution, Nebenkosten, Kundigung",
  },
  {
    id: "study-university",
    title: "University Language",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["modal-verbs", "question-words"],
    contexts: ["study"],
    grammarFocus: "Academic register, email to professors, course admin",
    vocabHint: "Vorlesung, Seminar, Hausarbeit, Prufung, Sprechstunde",
  },
  {
    id: "study-presentations",
    title: "Academic Discussion",
    group: "Your Context",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["study-university", "relative-clauses"],
    contexts: ["study"],
    grammarFocus: "Presenting arguments, citing, structured discussion",
    vocabHint: "Erstens, daruber hinaus, im Gegensatz zu, abschliessend",
  },
  {
    id: "daily-shopping",
    title: "Shopping & Errands",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["numbers-time", "accusative-case"],
    contexts: ["daily"],
    grammarFocus: "Quantities, prices, polite requests, comparisons",
    vocabHint: "Supermarkt, Backer, Wie viel, Große, Angebot",
  },
  {
    id: "daily-health",
    title: "Doctor & Health",
    group: "Your Context",
    cefr: "a2", phase: 2,
    prerequisiteIds: ["daily-shopping", "reflexive-verbs"],
    contexts: ["daily", "relocation"],
    grammarFocus: "Body parts, symptoms, appointments",
    vocabHint: "Arzt, Kopfschmerzen, Rezept, Versicherung, Krankschreibung",
  },
  {
    id: "exams-writing",
    title: "Exam Writing (Brief/Email)",
    group: "Your Context",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["connectors-weil-dass", "past-perfekt"],
    contexts: ["exams"],
    grammarFocus: "Formal/informal letter structure, Goethe/TELC format",
    vocabHint: "Sehr geehrte, Mit freundlichen Grüssen, Betreff",
  },
  {
    id: "exams-speaking",
    title: "Exam Speaking Roleplay",
    group: "Your Context",
    cefr: "b1", phase: 2,
    prerequisiteIds: ["exams-writing", "modal-verbs"],
    contexts: ["exams"],
    grammarFocus: "Roleplay structures, agreeing/disagreeing, proposing",
    vocabHint: "Ich wurde vorschlagen, Konnten wir, Einverstanden",
  },

  /* ── PHASE 3: Mastery (B2 -> C1) ── */
  {
    id: "prateritum",
    title: "Prateritum (Narrative Past)",
    group: "Precision",
    cefr: "b1", phase: 3,
    prerequisiteIds: ["past-perfekt", "relative-clauses"],
    contexts: "all",
    grammarFocus: "Simple past for common verbs, written narrative",
    vocabHint: "war, hatte, ging, kam, written storytelling",
  },
  {
    id: "passive-voice",
    title: "Passive Voice",
    group: "Precision",
    cefr: "b2", phase: 3,
    prerequisiteIds: ["prateritum"],
    contexts: "all",
    grammarFocus: "werden + Partizip II, Vorgangs- vs Zustandspassiv",
    vocabHint: "Das Buch wird gelesen, Es wurde gebaut",
  },
  {
    id: "konjunktiv-2",
    title: "Konjunktiv II",
    group: "Precision",
    cefr: "b2", phase: 3,
    prerequisiteIds: ["passive-voice"],
    contexts: "all",
    grammarFocus: "Polite requests, hypotheticals, wurde + Infinitiv",
    vocabHint: "Ich wurde gern, Wenn ich konnte, hatte ich",
  },
  {
    id: "genitiv-case",
    title: "Genitive Case",
    group: "Precision",
    cefr: "b2", phase: 3,
    prerequisiteIds: ["prateritum"],
    contexts: "all",
    grammarFocus: "des/eines, genitive prepositions, n-declension",
    vocabHint: "trotz, wahrend, wegen, statt + Genitiv",
  },
  {
    id: "advanced-connectors",
    title: "Advanced Connectors",
    group: "Fluency",
    cefr: "b2", phase: 3,
    prerequisiteIds: ["konjunktiv-2", "relative-clauses"],
    contexts: "all",
    grammarFocus: "obwohl, trotzdem, indem, anstatt zu, um...zu",
    vocabHint: "Concession, purpose, manner clauses",
  },
  {
    id: "werden-forms",
    title: "All Werden Forms",
    group: "Fluency",
    cefr: "b2", phase: 3,
    prerequisiteIds: ["passive-voice", "konjunktiv-2"],
    contexts: "all",
    grammarFocus: "Future, passive, Konjunktiv II - werden overview",
    vocabHint: "Ich werde machen, Es wird gemacht, Er wurde",
  },
  {
    id: "verbs-with-prep",
    title: "Verbs with Prepositions",
    group: "Fluency",
    cefr: "b2", phase: 3,
    prerequisiteIds: ["advanced-connectors"],
    contexts: "all",
    grammarFocus: "Fixed verb-preposition combos, da-/wo- compounds",
    vocabHint: "sich freuen auf, warten auf, denken an, darauf/worauf",
  },
  {
    id: "konjunktiv-1",
    title: "Konjunktiv I (Reported Speech)",
    group: "Mastery",
    cefr: "c1", phase: 3,
    prerequisiteIds: ["konjunktiv-2", "advanced-connectors"],
    contexts: ["work", "study", "exams"],
    grammarFocus: "Indirect speech in formal/academic register",
    vocabHint: "Er sagte, er habe... Die Zeitung berichtet, dass...",
  },
  {
    id: "nominalization",
    title: "Nominalization & Academic Style",
    group: "Mastery",
    cefr: "c1", phase: 3,
    prerequisiteIds: ["konjunktiv-1", "genitiv-case"],
    contexts: ["work", "study", "exams"],
    grammarFocus: "Verb -> noun transformations, formal writing style",
    vocabHint: "die Besprechung, die Durchfuhrung, zur Verfugung stellen",
  },
]

/* ── Build personalized pathway ──
 *  Returns lessons in order, filtered to include:
 *  - all "all" context lessons (the grammar skeleton)
 *  - lessons matching the learner's purpose
 *  Maintains prerequisite ordering.
 */
export function buildPersonalizedCatalog(purpose: Purpose | null): LessonCatalogItem[] {
  const purposeKey = purpose ?? "daily"

  return lessonCatalog.filter((lesson) => {
    if (lesson.contexts === "all") return true
    return lesson.contexts.includes(purposeKey)
  })
}

/**
 * Check if a lesson is unlocked given the set of completed lesson IDs.
 * A lesson is unlocked when ALL its prerequisites are in `completed`.
 */
export function isLessonUnlocked(lesson: LessonCatalogItem, completed: Set<string>): boolean {
  return lesson.prerequisiteIds.every((pid) => completed.has(pid))
}

/**
 * Get the first unlockable-but-incomplete lesson in the catalog.
 */
export function getCurrentLesson(
  catalog: LessonCatalogItem[],
  completed: Set<string>
): LessonCatalogItem | null {
  return catalog.find((l) => !completed.has(l.id) && isLessonUnlocked(l, completed)) ?? null
}
