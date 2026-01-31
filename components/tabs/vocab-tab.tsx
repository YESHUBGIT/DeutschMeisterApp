"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Volume2, Star, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { lessonCatalog } from "@/lib/lesson-catalog"

const categories = [
  { id: "all", label: "All Words" },
  { id: "pronouns", label: "Pronouns" },
  { id: "possessives", label: "Possessives" },
  { id: "prepositions", label: "Prepositions" },
  { id: "connectors", label: "Connectors" },
  { id: "question-words", label: "Question Words" },
  { id: "modal-verbs", label: "Modal Verbs" },
  { id: "verb-tenses", label: "Verb Tenses" },
  { id: "werden", label: "Werden Uses" },
  { id: "passive", label: "Passive Voice" },
  { id: "konjunktiv", label: "Konjunktiv" },
  { id: "reflexive-verbs", label: "Reflexive Verbs" },
  { id: "separable-verbs", label: "Separable Verbs" },
  { id: "regular-verbs", label: "Regular Verbs" },
  { id: "irregular-verbs", label: "Irregular Verbs" },
  { id: "mixed-verbs", label: "Mixed Verbs" },
  { id: "nouns", label: "Nouns" },
  { id: "verbs", label: "Verbs + Prep" },
]

const vocabulary = [
  // Personal Pronouns
  { id: 1, german: "ich", english: "I", category: "pronouns", article: null, starred: true, note: "Always lowercase unless starting sentence" },
  { id: 2, german: "du", english: "you (informal singular)", category: "pronouns", article: null, starred: false, note: "For friends, family, children" },
  { id: 3, german: "er", english: "he", category: "pronouns", article: null, starred: false, note: "Masculine" },
  { id: 4, german: "sie", english: "she / they", category: "pronouns", article: null, starred: true, note: "Context determines meaning" },
  { id: 5, german: "es", english: "it", category: "pronouns", article: null, starred: false, note: "Neuter or impersonal" },
  { id: 6, german: "wir", english: "we", category: "pronouns", article: null, starred: false, note: "" },
  { id: 7, german: "ihr", english: "you (informal plural)", category: "pronouns", article: null, starred: false, note: "Group of friends" },
  { id: 8, german: "Sie", english: "you (formal)", category: "pronouns", article: null, starred: true, note: "Always capitalized!" },
  
  // Possessives
  { id: 9, german: "mein", english: "my", category: "possessives", article: null, starred: true, note: "From ich" },
  { id: 10, german: "dein", english: "your (informal)", category: "possessives", article: null, starred: false, note: "From du" },
  { id: 11, german: "sein", english: "his / its", category: "possessives", article: null, starred: false, note: "From er/es" },
  { id: 12, german: "ihr", english: "her / their", category: "possessives", article: null, starred: true, note: "From sie" },
  { id: 13, german: "unser", english: "our", category: "possessives", article: null, starred: false, note: "From wir" },
  { id: 14, german: "euer", english: "your (plural informal)", category: "possessives", article: null, starred: false, note: "From ihr - loses 'e' with endings" },
  { id: 15, german: "Ihr", english: "your (formal)", category: "possessives", article: null, starred: true, note: "From Sie - always capitalized" },

  // Prepositions - Accusative
  { id: 16, german: "durch", english: "through", category: "prepositions", article: null, starred: false, note: "Always Accusative - DOGFU" },
  { id: 17, german: "für", english: "for", category: "prepositions", article: null, starred: true, note: "Always Accusative - DOGFU" },
  { id: 18, german: "gegen", english: "against", category: "prepositions", article: null, starred: false, note: "Always Accusative - DOGFU" },
  { id: 19, german: "ohne", english: "without", category: "prepositions", article: null, starred: true, note: "Always Accusative - DOGFU" },
  { id: 20, german: "um", english: "around / at (time)", category: "prepositions", article: null, starred: false, note: "Always Accusative - DOGFU" },

  // Prepositions - Dative
  { id: 21, german: "aus", english: "out of / from", category: "prepositions", article: null, starred: true, note: "Always Dative" },
  { id: 22, german: "bei", english: "at / near / with", category: "prepositions", article: null, starred: false, note: "Always Dative" },
  { id: 23, german: "mit", english: "with", category: "prepositions", article: null, starred: true, note: "Always Dative" },
  { id: 24, german: "nach", english: "after / to (places)", category: "prepositions", article: null, starred: false, note: "Always Dative" },
  { id: 25, german: "seit", english: "since / for (time)", category: "prepositions", article: null, starred: false, note: "Always Dative" },
  { id: 26, german: "von", english: "from / of", category: "prepositions", article: null, starred: true, note: "Always Dative" },
  { id: 27, german: "zu", english: "to", category: "prepositions", article: null, starred: true, note: "Always Dative - zum/zur" },

  // Prepositions - Genitive
  { id: 200, german: "während", english: "during", category: "prepositions", article: null, starred: false, note: "Always Genitive" },
  { id: 201, german: "wegen", english: "because of", category: "prepositions", article: null, starred: true, note: "Always Genitive" },
  { id: 202, german: "trotz", english: "despite", category: "prepositions", article: null, starred: false, note: "Always Genitive" },

  // Prepositions - Two-way
  { id: 203, german: "in", english: "in / into", category: "prepositions", article: null, starred: true, note: "Two-way (Akk/Dativ)" },
  { id: 204, german: "an", english: "at / on", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 205, german: "auf", english: "on / onto", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 206, german: "über", english: "over / about", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 207, german: "unter", english: "under", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 208, german: "vor", english: "in front of / before", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 209, german: "hinter", english: "behind", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 210, german: "neben", english: "next to", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },
  { id: 211, german: "zwischen", english: "between", category: "prepositions", article: null, starred: false, note: "Two-way (Akk/Dativ)" },

  // Connectors - Type 0 (no verb change)
  { id: 28, german: "und", english: "and", category: "connectors", article: null, starred: true, note: "Type 0 - verb position unchanged" },
  { id: 29, german: "oder", english: "or", category: "connectors", article: null, starred: false, note: "Type 0 - verb position unchanged" },
  { id: 30, german: "aber", english: "but", category: "connectors", article: null, starred: true, note: "Type 0 - verb position unchanged" },
  { id: 31, german: "denn", english: "because (coord.)", category: "connectors", article: null, starred: false, note: "Type 0 - verb position unchanged" },
  { id: 32, german: "sondern", english: "but rather", category: "connectors", article: null, starred: false, note: "Type 0 - after negative" },
  { id: 213, german: "doch", english: "but / however", category: "connectors", article: null, starred: false, note: "Type 0 - often after negation" },

  // Connectors - Type 1 (verb to end)
  { id: 33, german: "weil", english: "because", category: "connectors", article: null, starred: true, note: "Type 1 - verb goes to END" },
  { id: 34, german: "dass", english: "that", category: "connectors", article: null, starred: true, note: "Type 1 - verb goes to END" },
  { id: 35, german: "wenn", english: "if / when", category: "connectors", article: null, starred: true, note: "Type 1 - verb goes to END" },
  { id: 36, german: "obwohl", english: "although", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 37, german: "als", english: "when (past)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 38, german: "bevor", english: "before", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 39, german: "nachdem", english: "after", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 214, german: "da", english: "since / because", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 215, german: "falls", english: "in case", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 216, german: "sofern", english: "provided that", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 217, german: "obgleich", english: "although (formal)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 218, german: "obschon", english: "although (formal/rare)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 219, german: "ehe", english: "before (formal)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 220, german: "seit", english: "since", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 221, german: "seitdem", english: "since (then)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 222, german: "sobald", english: "as soon as", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 223, german: "solange", english: "as long as", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 224, german: "während", english: "while", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 225, german: "bis", english: "until", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 226, german: "sowie", english: "as soon as / once", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 227, german: "damit", english: "so that", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 228, german: "indem", english: "by doing", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 229, german: "als ob", english: "as if", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 230, german: "als wenn", english: "as if (colloquial)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 231, german: "ob", english: "whether / if", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 232, german: "auch wenn", english: "even if", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 233, german: "nur wenn", english: "only if", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 234, german: "außer wenn", english: "except if", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 235, german: "ohne dass", english: "without (doing)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 236, german: "statt dass", english: "instead of (doing)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 237, german: "anstatt dass", english: "instead of (doing)", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 238, german: "so dass", english: "so that / so ... that", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 239, german: "sodass", english: "so that / so ... that", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },
  { id: 240, german: "je nachdem, ob", english: "depending on whether", category: "connectors", article: null, starred: false, note: "Type 1 - verb goes to END" },

  // Connectors - Type 2 (verb first after)
  { id: 40, german: "deshalb", english: "therefore", category: "connectors", article: null, starred: true, note: "Type 2 - verb comes FIRST after" },
  { id: 41, german: "trotzdem", english: "nevertheless", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 42, german: "dann", english: "then", category: "connectors", article: null, starred: true, note: "Type 2 - verb comes FIRST after" },
  { id: 43, german: "danach", english: "after that", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 212, german: "außerdem", english: "besides / furthermore", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 241, german: "deswegen", english: "for that reason", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 242, german: "daher", english: "therefore", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 243, german: "darum", english: "therefore", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 244, german: "also", english: "so / therefore", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 245, german: "folglich", english: "consequently", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 246, german: "somit", english: "thus", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 247, german: "dennoch", english: "nevertheless", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 248, german: "allerdings", english: "however / admittedly", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 249, german: "hingegen", english: "in contrast", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 250, german: "dagegen", english: "on the other hand", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 251, german: "ebenfalls", english: "likewise", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 252, german: "auch", english: "also / too", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 253, german: "dazu", english: "in addition", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 254, german: "später", english: "later", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 255, german: "zuerst", english: "first", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 256, german: "anschließend", english: "afterwards", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 257, german: "inzwischen", english: "meanwhile", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 258, german: "schließlich", english: "finally / after all", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 259, german: "zum Beispiel", english: "for example", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 260, german: "nämlich", english: "namely / because (explains)", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 261, german: "kurz gesagt", english: "in short", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 262, german: "tatsächlich", english: "actually / in fact", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },
  { id: 263, german: "sonst", english: "otherwise / else", category: "connectors", article: null, starred: false, note: "Type 2 - verb comes FIRST after" },

  // Question Words
  { id: 44, german: "was", english: "what", category: "question-words", article: null, starred: true, note: "" },
  { id: 45, german: "wer", english: "who", category: "question-words", article: null, starred: true, note: "Nominative" },
  { id: 46, german: "wen", english: "whom (acc)", category: "question-words", article: null, starred: false, note: "Accusative" },
  { id: 47, german: "wem", english: "whom (dat)", category: "question-words", article: null, starred: false, note: "Dative" },
  { id: 48, german: "wo", english: "where", category: "question-words", article: null, starred: true, note: "" },
  { id: 49, german: "wann", english: "when", category: "question-words", article: null, starred: true, note: "" },
  { id: 50, german: "warum", english: "why", category: "question-words", article: null, starred: true, note: "" },
  { id: 51, german: "wie", english: "how", category: "question-words", article: null, starred: true, note: "" },
  { id: 52, german: "worüber", english: "about what", category: "question-words", article: null, starred: true, note: "For THINGS only" },
  { id: 53, german: "womit", english: "with what", category: "question-words", article: null, starred: false, note: "For THINGS only" },
  { id: 54, german: "worauf", english: "on what / for what", category: "question-words", article: null, starred: true, note: "For THINGS only" },
  { id: 55, german: "mit wem", english: "with whom", category: "question-words", article: null, starred: true, note: "For PEOPLE only" },

  // Modal Verbs - Present
  { id: 56, german: "können (ich kann)", english: "can / to be able to", category: "modal-verbs", article: null, starred: true, note: "Present: Ich kann es machen" },
  { id: 57, german: "müssen (ich muss)", english: "must / have to", category: "modal-verbs", article: null, starred: true, note: "Present: Ich muss es machen" },
  { id: 58, german: "wollen (ich will)", english: "want to", category: "modal-verbs", article: null, starred: true, note: "Present: Ich will es machen" },
  { id: 59, german: "sollen (ich soll)", english: "should / supposed to", category: "modal-verbs", article: null, starred: false, note: "Present: Ich soll es machen" },
  { id: 60, german: "dürfen (ich darf)", english: "may / allowed to", category: "modal-verbs", article: null, starred: false, note: "Present: Ich darf es machen" },
  { id: 61, german: "mögen (ich mag)", english: "to like", category: "modal-verbs", article: null, starred: false, note: "Ich mache es gern (preferred)" },

  // Modal Verbs - Konjunktiv II
  { id: 62, german: "könnte", english: "could (Konj. II)", category: "modal-verbs", article: null, starred: true, note: "Ich könnte morgen kommen" },
  { id: 63, german: "müsste", english: "would have to", category: "modal-verbs", article: null, starred: false, note: "Ich müsste mehr lernen" },
  { id: 64, german: "dürfte", english: "might be allowed", category: "modal-verbs", article: null, starred: false, note: "Ich dürfte länger bleiben" },
  { id: 65, german: "sollte", english: "should (softer)", category: "modal-verbs", article: null, starred: true, note: "Ich sollte früher gehen" },
  { id: 66, german: "wollte", english: "would want", category: "modal-verbs", article: null, starred: false, note: "Ich wollte dir helfen" },
  { id: 67, german: "möchte", english: "would like to", category: "modal-verbs", article: null, starred: true, note: "Ich möchte einen Kaffee" },

  // Verb Tenses - Active Voice
  { id: 68, german: "Präsens: verb stem + ending", english: "Present: I do / am doing", category: "verb-tenses", article: null, starred: true, note: "Ich lese ein Buch. (I read)" },
  { id: 69, german: "Präteritum: stem + prät. ending", english: "Simple Past: I did (written)", category: "verb-tenses", article: null, starred: false, note: "Ich las ein Buch. (I read-past)" },
  { id: 70, german: "Perfekt: haben/sein + Partizip II", english: "Perfect: I have done (spoken)", category: "verb-tenses", article: null, starred: true, note: "Ich habe gelesen. / Ich bin gegangen." },
  { id: 71, german: "Plusquamperfekt: hatte/war + P.II", english: "Past Perfect: I had done", category: "verb-tenses", article: null, starred: false, note: "Ich hatte gelesen. / Ich war gegangen." },
  { id: 72, german: "Futur I: werden + Infinitiv", english: "Future: I will do", category: "verb-tenses", article: null, starred: true, note: "Ich werde lesen." },
  { id: 73, german: "Futur II: werden + P.II + haben/sein", english: "Future Perfect: I will have done", category: "verb-tenses", article: null, starred: false, note: "Ich werde gelesen haben." },

  // WERDEN - Multiple Uses
  { id: 74, german: "werden (Vollverb)", english: "to become", category: "werden", article: null, starred: true, note: "Er wird müde. (He becomes tired)" },
  { id: 75, german: "werden + Infinitiv", english: "will (Future)", category: "werden", article: null, starred: true, note: "Ich werde lernen. (I will learn)" },
  { id: 76, german: "werden + Partizip II", english: "is being done (Passive)", category: "werden", article: null, starred: true, note: "Es wird gemacht. (It is being done)" },
  { id: 77, german: "würde + Infinitiv", english: "would (Konjunktiv II)", category: "werden", article: null, starred: true, note: "Ich würde gehen. (I would go)" },

  // Werden as Full Verb (to become) - Tenses
  { id: 78, german: "Er wird müde.", english: "He becomes tired. (Präsens)", category: "werden", article: null, starred: false, note: "Full verb - present" },
  { id: 79, german: "Er wurde müde.", english: "He became tired. (Präteritum)", category: "werden", article: null, starred: false, note: "Full verb - simple past" },
  { id: 80, german: "Er ist müde geworden.", english: "He has become tired. (Perfekt)", category: "werden", article: null, starred: false, note: "Full verb - perfect (sein + geworden)" },
  { id: 81, german: "Er wird müde werden.", english: "He will become tired. (Futur I)", category: "werden", article: null, starred: false, note: "Full verb - future" },

  // Passive Voice Formulas
  { id: 82, german: "wird + Partizip II", english: "is being done (Present Passive)", category: "passive", article: null, starred: true, note: "Das Auto wird repariert." },
  { id: 83, german: "wurde + Partizip II", english: "was done (Präteritum Passive)", category: "passive", article: null, starred: true, note: "Das Auto wurde repariert." },
  { id: 84, german: "ist + P.II + worden", english: "has been done (Perfekt Passive)", category: "passive", article: null, starred: true, note: "Das Auto ist repariert worden." },
  { id: 85, german: "war + P.II + worden", english: "had been done (Plusquam. Passive)", category: "passive", article: null, starred: false, note: "Das Auto war repariert worden." },
  { id: 86, german: "wird + P.II + werden", english: "will be done (Futur Passive)", category: "passive", article: null, starred: false, note: "Das Auto wird repariert werden." },

  // Passive with Modal Verbs
  { id: 87, german: "muss + P.II + werden", english: "must be done", category: "passive", article: null, starred: true, note: "Das Buch muss gelesen werden." },
  { id: 88, german: "kann + P.II + werden", english: "can be done", category: "passive", article: null, starred: false, note: "Das kann gemacht werden." },

  // Konjunktiv II
  { id: 89, german: "würde + Infinitiv", english: "would (general)", category: "konjunktiv", article: null, starred: true, note: "Ich würde das machen." },
  { id: 90, german: "wäre", english: "would be (sein)", category: "konjunktiv", article: null, starred: true, note: "Das wäre toll!" },
  { id: 91, german: "hätte", english: "would have (haben)", category: "konjunktiv", article: null, starred: true, note: "Ich hätte gern einen Kaffee." },

  // Past Conditional (hätte/wäre + P.II)
  { id: 92, german: "hätte + P.II + können", english: "could have done", category: "konjunktiv", article: null, starred: true, note: "Ich hätte das machen können." },
  { id: 93, german: "hätte + P.II + müssen", english: "would have had to", category: "konjunktiv", article: null, starred: false, note: "Ich hätte gestern arbeiten müssen." },
  { id: 94, german: "hätte + P.II + sollen", english: "should have done", category: "konjunktiv", article: null, starred: true, note: "Ich hätte mehr lernen sollen." },
  { id: 95, german: "wäre + P.II (sein verbs)", english: "would have gone/been", category: "konjunktiv", article: null, starred: false, note: "Ich wäre gegangen." },

  // Modal + Perfect Infinitive (Assumptions)
  { id: 96, german: "könnte + P.II + haben", english: "may/might have done", category: "konjunktiv", article: null, starred: true, note: "Er könnte das gesagt haben." },
  { id: 97, german: "muss + P.II + haben", english: "must have done", category: "konjunktiv", article: null, starred: true, note: "Er muss den Fehler gemacht haben." },
  { id: 98, german: "soll + P.II + haben", english: "is said to have done", category: "konjunktiv", article: null, starred: false, note: "Er soll viel verdient haben." },

  // Reflexive Verbs
  { id: 99, german: "sich freuen auf + Akk", english: "to look forward to", category: "reflexive-verbs", article: null, starred: true, note: "Ich freue mich auf..." },
  { id: 100, german: "sich freuen über + Akk", english: "to be happy about", category: "reflexive-verbs", article: null, starred: true, note: "Sie freut sich über..." },
  { id: 101, german: "sich interessieren für", english: "to be interested in", category: "reflexive-verbs", article: null, starred: true, note: "Er interessiert sich für..." },
  { id: 102, german: "sich treffen", english: "to meet (each other)", category: "reflexive-verbs", article: null, starred: false, note: "Wir treffen uns" },
  { id: 103, german: "sich vorstellen", english: "to imagine / introduce", category: "reflexive-verbs", article: null, starred: true, note: "Ich stelle mir vor..." },
  { id: 104, german: "sich erinnern an + Akk", english: "to remember", category: "reflexive-verbs", article: null, starred: true, note: "Ich erinnere mich an..." },

  // Separable Verbs
  { id: 105, german: "aufstehen", english: "to get up", category: "separable-verbs", article: null, starred: true, note: "Ich stehe auf. / Ich bin aufgestanden." },
  { id: 106, german: "anfangen", english: "to begin", category: "separable-verbs", article: null, starred: true, note: "Es fängt an. / Es hat angefangen." },
  { id: 107, german: "mitkommen", english: "to come along", category: "separable-verbs", article: null, starred: false, note: "Kommst du mit? / Bist du mitgekommen?" },
  { id: 108, german: "einkaufen", english: "to shop", category: "separable-verbs", article: null, starred: false, note: "Ich kaufe ein. / Ich habe eingekauft." },
  { id: 109, german: "anrufen", english: "to call", category: "separable-verbs", article: null, starred: true, note: "Ich rufe an. / Ich habe angerufen." },
  { id: 110, german: "zurückkommen", english: "to come back", category: "separable-verbs", article: null, starred: false, note: "Er kommt zurück. / Er ist zurückgekommen." },

  // Nouns with Articles
  { id: 111, german: "der Mann", english: "the man", category: "nouns", article: "der", starred: false, note: "Masculine" },
  { id: 112, german: "die Frau", english: "the woman", category: "nouns", article: "die", starred: false, note: "Feminine" },
  { id: 113, german: "das Kind", english: "the child", category: "nouns", article: "das", starred: false, note: "Neuter" },
  { id: 114, german: "die Zeitung", english: "the newspaper", category: "nouns", article: "die", starred: true, note: "-ung = feminine" },
  { id: 115, german: "das Mädchen", english: "the girl", category: "nouns", article: "das", starred: true, note: "-chen = neuter (always!)" },
  { id: 116, german: "der Lehrer", english: "the teacher (m)", category: "nouns", article: "der", starred: false, note: "-er person = masculine" },

  // Verbs with Prepositions
  { id: 117, german: "warten auf + Akk", english: "to wait for", category: "verbs", article: null, starred: true, note: "Ich warte auf den Bus" },
  { id: 118, german: "denken an + Akk", english: "to think about", category: "verbs", article: null, starred: true, note: "Ich denke an dich" },
  { id: 119, german: "träumen von + Dat", english: "to dream of", category: "verbs", article: null, starred: false, note: "Er träumt von..." },
  { id: 120, german: "helfen + Dat", english: "to help", category: "verbs", article: null, starred: true, note: "DATIVE verb! Ich helfe dir" },
  { id: 121, german: "gefallen + Dat", english: "to please", category: "verbs", article: null, starred: true, note: "DATIVE verb! Es gefällt mir" },
  { id: 122, german: "Angst haben vor + Dat", english: "to be afraid of", category: "verbs", article: null, starred: false, note: "Sie hat Angst vor Spinnen" },

  // Regular Verbs
  { id: 264, german: "machen", english: "to do / make", category: "regular-verbs", article: null, starred: true, note: "ich mache, ich machte, ich habe gemacht" },
  { id: 265, german: "lernen", english: "to learn", category: "regular-verbs", article: null, starred: true, note: "ich lerne, ich lernte, ich habe gelernt" },
  { id: 266, german: "arbeiten", english: "to work", category: "regular-verbs", article: null, starred: false, note: "ich arbeite, ich arbeitete, ich habe gearbeitet" },
  { id: 267, german: "fragen", english: "to ask", category: "regular-verbs", article: null, starred: false, note: "ich frage, ich fragte, ich habe gefragt" },
  { id: 268, german: "antworten", english: "to answer", category: "regular-verbs", article: null, starred: false, note: "ich antworte, ich antwortete, ich habe geantwortet" },
  { id: 269, german: "spielen", english: "to play", category: "regular-verbs", article: null, starred: false, note: "ich spiele, ich spielte, ich habe gespielt" },
  { id: 270, german: "brauchen", english: "to need", category: "regular-verbs", article: null, starred: false, note: "ich brauche, ich brauchte, ich habe gebraucht" },
  { id: 271, german: "sagen", english: "to say", category: "regular-verbs", article: null, starred: true, note: "ich sage, ich sagte, ich habe gesagt" },
  { id: 272, german: "kaufen", english: "to buy", category: "regular-verbs", article: null, starred: false, note: "ich kaufe, ich kaufte, ich habe gekauft" },
  { id: 273, german: "wohnen", english: "to live / reside", category: "regular-verbs", article: null, starred: false, note: "ich wohne, ich wohnte, ich habe gewohnt" },

  // Irregular Verbs (Strong)
  { id: 274, german: "sein", english: "to be", category: "irregular-verbs", article: null, starred: true, note: "ich bin, ich war, ich bin gewesen" },
  { id: 275, german: "haben", english: "to have", category: "irregular-verbs", article: null, starred: true, note: "ich habe, ich hatte, ich habe gehabt" },
  { id: 276, german: "werden", english: "to become", category: "irregular-verbs", article: null, starred: true, note: "ich werde, ich wurde, ich bin geworden" },
  { id: 277, german: "gehen", english: "to go", category: "irregular-verbs", article: null, starred: true, note: "ich gehe, ich ging, ich bin gegangen" },
  { id: 278, german: "kommen", english: "to come", category: "irregular-verbs", article: null, starred: true, note: "ich komme, ich kam, ich bin gekommen" },
  { id: 279, german: "sehen", english: "to see", category: "irregular-verbs", article: null, starred: true, note: "ich sehe, ich sah, ich habe gesehen" },
  { id: 280, german: "geben", english: "to give", category: "irregular-verbs", article: null, starred: false, note: "ich gebe, ich gab, ich habe gegeben" },
  { id: 281, german: "nehmen", english: "to take", category: "irregular-verbs", article: null, starred: false, note: "ich nehme, ich nahm, ich habe genommen" },
  { id: 282, german: "sprechen", english: "to speak", category: "irregular-verbs", article: null, starred: false, note: "ich spreche, ich sprach, ich habe gesprochen" },
  { id: 283, german: "fahren", english: "to drive / ride", category: "irregular-verbs", article: null, starred: false, note: "ich fahre, ich fuhr, ich bin gefahren" },
  { id: 284, german: "essen", english: "to eat", category: "irregular-verbs", article: null, starred: false, note: "ich esse, ich aß, ich habe gegessen" },
  { id: 285, german: "trinken", english: "to drink", category: "irregular-verbs", article: null, starred: false, note: "ich trinke, ich trank, ich habe getrunken" },
  { id: 286, german: "lesen", english: "to read", category: "irregular-verbs", article: null, starred: false, note: "ich lese, ich las, ich habe gelesen" },
  { id: 287, german: "schreiben", english: "to write", category: "irregular-verbs", article: null, starred: false, note: "ich schreibe, ich schrieb, ich habe geschrieben" },
  { id: 288, german: "finden", english: "to find", category: "irregular-verbs", article: null, starred: false, note: "ich finde, ich fand, ich habe gefunden" },
  { id: 289, german: "stehen", english: "to stand", category: "irregular-verbs", article: null, starred: false, note: "ich stehe, ich stand, ich habe gestanden" },
  { id: 290, german: "liegen", english: "to lie", category: "irregular-verbs", article: null, starred: false, note: "ich liege, ich lag, ich habe gelegen" },
  { id: 291, german: "bringen", english: "to bring", category: "mixed-verbs", article: null, starred: false, note: "ich bringe, ich brachte, ich habe gebracht" },
  { id: 292, german: "denken", english: "to think", category: "mixed-verbs", article: null, starred: false, note: "ich denke, ich dachte, ich habe gedacht" },
  { id: 293, german: "wissen", english: "to know", category: "mixed-verbs", article: null, starred: false, note: "ich weiß, ich wusste, ich habe gewusst" },
  { id: 294, german: "kennen", english: "to know (someone/place)", category: "mixed-verbs", article: null, starred: false, note: "ich kenne, ich kannte, ich habe gekannt" },
  { id: 295, german: "rennen", english: "to run", category: "mixed-verbs", article: null, starred: false, note: "ich renne, ich rannte, ich bin gerannt" },
  { id: 296, german: "brennen", english: "to burn", category: "mixed-verbs", article: null, starred: false, note: "ich brenne, ich brannte, ich habe gebrannt" },
  { id: 297, german: "nennen", english: "to name", category: "mixed-verbs", article: null, starred: false, note: "ich nenne, ich nannte, ich habe genannt" },
  { id: 298, german: "denken an + Akk", english: "to think about", category: "verbs", article: null, starred: false, note: "Ich denke an dich" },
]

const lessonByCategory: Record<string, string> = {
  pronouns: "personal-pronouns",
  possessives: "possessive-articles",
  prepositions: "prepositions-by-case",
  connectors: "connectors-verb-position",
  "question-words": "question-words",
  "modal-verbs": "modal-verbs",
  "verb-tenses": "verb-tenses",
  werden: "werden-forms",
  passive: "passive-voice",
  konjunktiv: "konjunktiv-2",
  "reflexive-verbs": "reflexive-verbs",
  "separable-verbs": "separable-verbs",
  nouns: "cases-basics",
  verbs: "verbs-with-prep",
  "regular-verbs": "verb-tenses",
  "irregular-verbs": "verb-tenses",
  "mixed-verbs": "verb-tenses",
}

export function VocabTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedLesson, setSelectedLesson] = useState("all")
  const [starredWords, setStarredWords] = useState<number[]>(
    vocabulary.filter(v => v.starred).map(v => v.id)
  )

  const filteredVocab = vocabulary.filter((word) => {
    const matchesSearch =
      word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.note?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || word.category === activeCategory
    const lessonMatch = selectedLesson === "all" || lessonByCategory[word.category] === selectedLesson
    return matchesSearch && matchesCategory && lessonMatch
  })

  const toggleStar = (id: number) => {
    setStarredWords(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getArticleColor = (article: string | null) => {
    switch (article) {
      case "der": return "bg-blue-100 text-blue-700"
      case "die": return "bg-pink-100 text-pink-700"
      case "das": return "bg-green-100 text-green-700"
      default: return ""
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "pronouns": "bg-purple-100 text-purple-700",
      "possessives": "bg-indigo-100 text-indigo-700",
      "prepositions": "bg-cyan-100 text-cyan-700",
      "connectors": "bg-amber-100 text-amber-700",
      "question-words": "bg-rose-100 text-rose-700",
      "modal-verbs": "bg-emerald-100 text-emerald-700",
      "verb-tenses": "bg-blue-100 text-blue-700",
      "werden": "bg-violet-100 text-violet-700",
      "passive": "bg-fuchsia-100 text-fuchsia-700",
      "konjunktiv": "bg-pink-100 text-pink-700",
      "reflexive-verbs": "bg-teal-100 text-teal-700",
      "separable-verbs": "bg-lime-100 text-lime-700",
      "regular-verbs": "bg-emerald-100 text-emerald-700",
      "irregular-verbs": "bg-amber-100 text-amber-800",
      "mixed-verbs": "bg-indigo-100 text-indigo-700",
      "nouns": "bg-sky-100 text-sky-700",
      "verbs": "bg-orange-100 text-orange-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <h1 className="text-4xl font-bold text-foreground">Vocabulary</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Words organized by the lessons - verbs, tenses, passive voice, modal verbs, and more
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-primary">{vocabulary.length}</p>
            <p className="text-sm text-muted-foreground">Total Words</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-primary">{starredWords.length}</p>
            <p className="text-sm text-muted-foreground">Starred</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-primary">{categories.length - 1}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search vocabulary, notes, or meanings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
              </div>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger className="w-full md:w-[260px]">
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
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Word List</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredVocab.length} words
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredVocab.map((word) => (
              <div
                key={word.id}
                className="flex items-start justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {word.article ? (
                    <span className={cn("px-2 py-1 rounded text-xs font-medium shrink-0", getArticleColor(word.article))}>
                      {word.article}
                    </span>
                  ) : (
                    <span className={cn("px-2 py-1 rounded text-xs font-medium shrink-0", getCategoryColor(word.category))}>
                      {categories.find(c => c.id === word.category)?.label.split(" ")[0]}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{word.german}</p>
                    <p className="text-sm text-muted-foreground">{word.english}</p>
                    {word.note && (
                      <p className="text-xs text-primary mt-1">{word.note}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleStar(word.id)}
                  >
                    <Star
                      className={cn(
                        "w-4 h-4",
                        starredWords.includes(word.id)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
