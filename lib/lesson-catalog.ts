export type LessonCatalogItem = {
  id: string
  title: string
  group: string
}

export const lessonCatalog: LessonCatalogItem[] = [
  { id: "personal-pronouns", title: "Personal Pronouns (Personalpronomen)", group: "Foundations" },
  { id: "possessive-articles", title: "Possessive Articles (Possessivartikel)", group: "Foundations" },
  { id: "articles-gender", title: "Articles & Gender", group: "Foundations" },
  { id: "prepositions-by-case", title: "Prepositions by Case", group: "Cases" },
  { id: "connectors-verb-position", title: "Connectors & Verb Position", group: "Word Order" },
  { id: "question-words", title: "Question Words (W-Fragen)", group: "Foundations" },
  { id: "modal-verbs", title: "Modal Verbs", group: "Verbs" },
  { id: "konjunktiv-2", title: "Konjunktiv II", group: "Verbs" },
  { id: "werden-forms", title: "Werden Forms", group: "Verbs" },
  { id: "verb-tenses", title: "Verb Tenses", group: "Verbs" },
  { id: "passive-voice", title: "Passive Voice", group: "Verbs" },
  { id: "reflexive-verbs", title: "Reflexive Verbs", group: "Verbs" },
  { id: "separable-verbs", title: "Separable Verbs", group: "Verbs" },
  { id: "cases-basics", title: "Cases: Nominativ, Akkusativ, Dativ, Genitiv", group: "Cases" },
  { id: "verbs-with-prep", title: "Verbs with Prepositions", group: "Verbs" },
]
