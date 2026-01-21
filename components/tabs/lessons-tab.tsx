"use client"

import { useState } from "react"
import type { TabType } from "@/app/page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, BookText, Layers, Target, Zap, CheckCircle2, Clock, Star, AlertCircle, Lightbulb, GitBranch, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface LessonsTabProps {
  onNavigate: (tab: TabType) => void
}

// Tree structure for verb lessons
type LessonTable = {
  title?: string
  headers: string[]
  rows: string[][]
}

type LessonContent = {
  concept: string
  keyPoints: string[]
  table: LessonTable | LessonTable[]
  examples: Array<{ german: string; english: string }>
  tip: string
}

const verbTree = {
  id: "verbs",
  title: "VERBS (Das Verb)",
  description: "The engine of every German sentence - master verbs and you master German!",
  intro: "The verb is the engine. It tells us: What happens (action), When it happens (tense), How it happens (active/passive/mood). Everything else is just additional information.",
  rootLabel: "VERBS",
  branches: [
    {
      id: "level1",
      title: "Level 1: Verb Basics",
      color: "bg-green-100 border-green-400",
      topics: [
        {
          id: "infinitive",
          title: "1.1 What is a Verb + Infinitive",
          content: {
            concept: "The infinitive is the base form of a verb - like 'to go', 'to make' in English. In German, infinitives end in -en or -n. This is the form you find in the dictionary.",
            keyPoints: [
              "Infinitive ends with -en or -n: machen, spielen, lernen, arbeiten",
              "This is the dictionary form",
              "Conjugation = changing the verb to match the subject",
              "Regular verbs follow predictable patterns",
            ],
            table: {
              headers: ["Infinitive", "English", "Stem"],
              rows: [
                ["machen", "to make/do", "mach-"],
                ["spielen", "to play", "spiel-"],
                ["lernen", "to learn", "lern-"],
                ["arbeiten", "to work", "arbeit-"],
                ["studieren", "to study", "studier-"],
              ],
            },
            examples: [
              { german: "Ich lerne Deutsch.", english: "I learn German. (verb = lerne)" },
              { german: "Was machst du?", english: "What are you doing? (verb = machst)" },
            ],
            tip: "Verbs ending in '-ieren' are ALWAYS regular: studieren → ich studiere / habe studiert",
          }
        },
        {
          id: "conjugation",
          title: "1.2 Conjugation in Present (Präsens)",
          content: {
            concept: "Conjugation means changing the verb ending to match who is doing the action. There are 3 patterns: Regular, Irregular (vowel change), and Mixed.",
            keyPoints: [
              "Regular: remove -en, add endings (e, st, t, en, t, en)",
              "Irregular: vowel changes in du/er forms (a→ä, e→i/ie)",
              "Mixed: both vowel change AND irregular past",
              "Verbs ending in -ieren are ALWAYS regular",
            ],
            table: {
              headers: ["Person", "Regular (machen)", "Irregular (fahren)", "Irregular (lesen)"],
              rows: [
                ["ich", "mache", "fahre", "lese"],
                ["du", "machst", "fährst (a→ä)", "liest (e→ie)"],
                ["er/sie/es", "macht", "fährt (a→ä)", "liest (e→ie)"],
                ["wir", "machen", "fahren", "lesen"],
                ["ihr", "macht", "fahrt", "lest"],
                ["sie/Sie", "machen", "fahren", "lesen"],
              ],
            },
            examples: [
              { german: "Ich mache meine Hausaufgaben.", english: "I do my homework." },
              { german: "Er fährt nach Berlin.", english: "He drives to Berlin." },
              { german: "Sie liest ein Buch.", english: "She reads a book." },
            ],
            tip: "Vowel changes only happen with du and er/sie/es - never with ich, wir, ihr, sie!",
          }
        },
      ]
    },
    {
      id: "level2",
      title: "Level 2: Verb Position",
      color: "bg-blue-100 border-blue-400",
      topics: [
        {
          id: "position-main",
          title: "2.1 Verb = Position 2 in Main Sentences",
          content: {
            concept: "The core rule of German: In a main sentence, the conjugated verb is ALWAYS in position 2. It doesn't matter what comes first - the verb stays in position 2.",
            keyPoints: [
              "Verb is ALWAYS in position 2 in main clauses",
              "Subject can come before or after the verb",
              "Time/place can start the sentence - verb still position 2",
              "This is called 'verb-second' (V2) word order",
            ],
            table: {
              headers: ["Position 1", "Position 2 (VERB)", "Rest"],
              rows: [
                ["Ich", "gehe", "heute ins Büro."],
                ["Heute", "gehe", "ich ins Büro."],
                ["Ins Büro", "gehe", "ich heute."],
                ["Morgen", "arbeite", "ich nicht."],
              ],
            },
            examples: [
              { german: "Ich gehe heute ins Kino.", english: "I'm going to the cinema today." },
              { german: "Heute gehe ich ins Kino.", english: "Today I'm going to the cinema." },
              { german: "Ins Kino gehe ich heute.", english: "To the cinema I'm going today." },
            ],
            tip: "Whatever comes first (time, place, object) - the verb is ALWAYS second!",
          }
        },
        {
          id: "position-sub",
          title: "2.2 Verb at END in Subordinate Clauses",
          content: {
            concept: "With subordinating conjunctions (or just remember it as few connectors if 'subordinating conjunctions' seems too technical) (weil, dass, wenn, obwohl...), the verb moves to the END of the clause. This creates 'verb clusters' with modal verbs and perfect tense.",
            keyPoints: [
              "Subordinating conjunctions (or some connectors) push verb to END. Click here to see the complete list",
              "Common: weil (because), dass (that), wenn (if/when), obwohl (although)",
              "Creates verb clusters: ...weil ich schwimmen kann",
              "Comma separates main and subordinate clause",
            ],
            table: {
              headers: ["Connector Type", "Connectors", "Verb Position"],
              rows: [
                ["Type 0 (Coordinating)", "und, oder, aber, denn", "Normal (position 2)"],
                ["Type 1 (Subordinating)", "weil, dass, wenn, obwohl", "END of clause"],
                ["Type 2 (Adverbs)", "deshalb, trotzdem, dann", "After connector"],
              ],
            },
            examples: [
              { german: "Ich bleibe zu Hause, weil ich krank bin.", english: "I'm staying home because I'm sick." },
              { german: "Er sagt, dass er morgen kommt.", english: "He says that he's coming tomorrow." },
              { german: "Weil ich müde bin, gehe ich schlafen.", english: "Because I'm tired, I'm going to sleep." },
            ],
            tip: "When subordinate clause comes FIRST, you get verb-verb: 'Weil ich müde BIN, GEHE ich...'",
          }
        },
      ]
    },
    {
      id: "level3",
      title: "Level 3: Special Verb Types",
      color: "bg-orange-100 border-orange-400",
      topics: [
        {
          id: "separable",
          title: "3.1 Separable Verbs (Trennbare Verben)",
          content: {
            concept: "Some verbs split! The prefix goes to the end in main clauses. In Perfekt, the 'ge-' goes between prefix and verb: aufgestanden.",
            keyPoints: [
              "Prefix goes to END in present/simple past",
              "Common prefixes: an, auf, aus, ein, mit, vor, zu",
              "Perfekt: prefix + ge + stem: aufgestanden",
              "In subordinate clauses: verb stays together at end",
            ],
            table: {
              headers: ["Infinitive", "Present", "Perfekt", "Meaning"],
              rows: [
                ["aufstehen", "Ich stehe auf.", "Ich bin aufgestanden.", "to get up"],
                ["anfangen", "Es fängt an.", "Es hat angefangen.", "to begin"],
                ["mitkommen", "Kommst du mit?", "Bist du mitgekommen?", "to come along"],
                ["einkaufen", "Ich kaufe ein.", "Ich habe eingekauft.", "to shop"],
              ],
            },
            examples: [
              { german: "Ich stehe um 7 Uhr auf.", english: "I get up at 7 o'clock." },
              { german: "Der Film fängt um 8 an.", english: "The movie starts at 8." },
              { german: "...weil ich früh aufstehe.", english: "...because I get up early. (stays together)" },
            ],
            tip: "In subordinate clauses, the verb STAYS TOGETHER: '...weil ich um 7 Uhr aufstehe.'",
          }
        },
        {
          id: "reflexive",
          title: "3.2 Reflexive Verbs (Reflexive Verben)",
          content: {
            concept: "Reflexive verbs need a reflexive pronoun (mich, dich, sich...). Many German verbs are reflexive that aren't in English!",
            keyPoints: [
              "sich freuen = to be happy (not 'to happy oneself')",
              "Accusative: mich, dich, sich, uns, euch, sich",
              "Dative: mir, dir, sich, uns, euch, sich",
              "Always learn: sich + verb + preposition (if any)",
            ],
            table: {
              headers: ["Person", "Accusative", "Dative", "Example"],
              rows: [
                ["ich", "mich", "mir", "Ich wasche mich."],
                ["du", "dich", "dir", "Du freust dich."],
                ["er/sie/es", "sich", "sich", "Er rasiert sich."],
                ["wir", "uns", "uns", "Wir treffen uns."],
                ["ihr", "euch", "euch", "Ihr beeilt euch."],
                ["sie/Sie", "sich", "sich", "Sie setzen sich."],
              ],
            },
            examples: [
              { german: "Ich freue mich auf das Wochenende.", english: "I'm looking forward to the weekend." },
              { german: "Er interessiert sich für Musik.", english: "He's interested in music." },
              { german: "Wir treffen uns um 8 Uhr.", english: "We're meeting at 8." },
            ],
            tip: "Learn as chunks: sich freuen auf + Akk, sich interessieren für + Akk, sich treffen mit + Dat",
          }
        },
        {
          id: "verbs-prepositions",
          title: "3.3 Verbs with Fixed Prepositions",
          content: {
            concept: "Many verbs always go with a specific preposition. You MUST learn them as a unit: warten auf (to wait for), denken an (to think of).",
            keyPoints: [
              "Learn as phrases: verb + preposition + case",
              "The preposition determines the case",
              "These are high-frequency - memorize as chunks!",
              "Question: wo+prep for things, prep+wem/wen for people",
            ],
            table: {
              headers: ["Verb + Prep", "Case", "Meaning", "Example"],
              rows: [
                ["warten auf", "Akk", "to wait for", "Ich warte auf den Bus."],
                ["denken an", "Akk", "to think of", "Ich denke an dich."],
                ["sich freuen auf", "Akk", "to look forward to", "Ich freue mich auf..."],
                ["Angst haben vor", "Dat", "to be afraid of", "Ich habe Angst vor..."],
                ["helfen bei", "Dat", "to help with", "Ich helfe dir bei..."],
                ["sprechen mit", "Dat", "to speak with", "Ich spreche mit ihm."],
              ],
            },
            examples: [
              { german: "Worauf wartest du? - Auf den Bus.", english: "What are you waiting for? - For the bus." },
              { german: "An wen denkst du? - An meine Mutter.", english: "Who are you thinking of? - My mother." },
            ],
            tip: "For THINGS: wo+prep (worauf?). For PEOPLE: prep+wen/wem (auf wen? mit wem?)",
          }
        },
      ]
    },
        {
      id: "level4",
      title: "Level 4: Tenses (Active Voice)",
      color: "bg-yellow-100 border-yellow-400",
      topics: [
        {
          id: "praesens",
          title: "4.1 Present (Präsens)",
          content: {
            concept: "Present tense is used for current actions, habits, general truths, AND often for near future. Germans frequently use present tense where English would use future!",
            keyPoints: [
              "Used for: now, habits, general truths, near future",
              "Formula: verb stem + ending",
              "Most common tense in conversation",
              "Often replaces future: 'Ich gehe morgen' = I'll go tomorrow",
            ],
            table: {
              headers: ["Usage", "German Example", "English"],
              rows: [
                ["Now", "Ich arbeite jetzt.", "I'm working now."],
                ["Habit", "Ich trinke Kaffee.", "I drink coffee."],
                ["Future", "Morgen fliege ich.", "I'm flying tomorrow."],
                ["Truth", "Die Erde ist rund.", "The Earth is round."],
              ],
            },
            examples: [
              { german: "Ich lese ein Buch.", english: "I read / am reading a book." },
              { german: "Er arbeitet jeden Tag.", english: "He works every day." },
              { german: "Nächste Woche fahre ich nach Berlin.", english: "Next week I'm going to Berlin." },
            ],
            tip: "Germans often skip Futur I and just use Präsens + time word: 'Morgen arbeite ich.'",
          }
        },
        {
          id: "perfekt",
          title: "4.2 Perfect (Perfekt) - Spoken Past",
          content: {
            concept: "Perfekt is THE spoken past tense in German! Use haben or sein + Partizip II. Movement/change verbs use sein, most others use haben.",
            keyPoints: [
              "Formula: haben/sein + Partizip II",
              "sein for: movement (gehen, fahren) & change of state (werden, sterben)",
              "haben for: most other verbs",
              "Partizip II: ge- + stem + -t (regular) or ge- + stem + -en (irregular)",
              "-ieren verbs: no ge-! studiert, telefoniert",
            ],
            table: {
              headers: ["Type", "Infinitive", "Partizip II", "Perfect"],
              rows: [
                ["haben + regular", "machen", "gemacht", "Ich habe gemacht."],
                ["haben + irregular", "schreiben", "geschrieben", "Ich habe geschrieben."],
                ["sein + movement", "gehen", "gegangen", "Ich bin gegangen."],
                ["sein + change", "werden", "geworden", "Ich bin geworden."],
                ["-ieren (no ge-)", "studieren", "studiert", "Ich habe studiert."],
              ],
            },
            examples: [
              { german: "Ich habe gestern gearbeitet.", english: "I worked yesterday." },
              { german: "Sie ist nach Hause gegangen.", english: "She went home." },
              { german: "Wir haben einen Film gesehen.", english: "We watched a movie." },
            ],
            tip: "sein verbs: 'be-go-stay-happen-die' - verbs of motion, change of state, or staying!",
          }
        },
        {
          id: "praeteritum",
          title: "4.3 Simple Past (Präteritum) - Written Past",
          content: {
            concept: "Präteritum is mainly for written German and for sein/haben/modal verbs in speech. In conversation, Germans prefer Perfekt except for these common verbs.",
            keyPoints: [
              "Mainly for: sein, haben, werden, modal verbs",
              "Used in written narrative, news, stories",
              "Conversational for: war, hatte, konnte, musste, wollte",
              "Regular verbs: stem + -te endings",
            ],
            table: {
              headers: ["Verb", "ich", "du", "er/sie", "wir/sie"],
              rows: [
                ["sein", "war", "warst", "war", "waren"],
                ["haben", "hatte", "hattest", "hatte", "hatten"],
                ["werden", "wurde", "wurdest", "wurde", "wurden"],
                ["können", "konnte", "konntest", "konnte", "konnten"],
                ["müssen", "musste", "musstest", "musste", "mussten"],
              ],
            },
            examples: [
              { german: "Ich war gestern müde.", english: "I was tired yesterday." },
              { german: "Er hatte keine Zeit.", english: "He had no time." },
              { german: "Sie konnte nicht kommen.", english: "She couldn't come." },
            ],
            tip: "In conversation, use Präteritum for: war, hatte, wurde, wollte, konnte, musste, sollte, durfte",
          }
        },
        {
          id: "plusquamperfekt",
          title: "4.4 Past Perfect (Plusquamperfekt)",
          content: {
            concept: "Plusquamperfekt = 'had done' - something happened BEFORE another past event. Use hatte/war + Partizip II.",
            keyPoints: [
              "Formula: hatte/war + Partizip II",
              "Meaning: 'had done' - earlier past",
              "Used to show sequence of past events",
              "Same sein/haben rules as Perfekt",
            ],
            table: {
              headers: ["Type", "Formula", "Example", "English"],
              rows: [
                ["haben verbs", "hatte + Partizip II", "Ich hatte gegessen.", "I had eaten."],
                ["sein verbs", "war + Partizip II", "Ich war gegangen.", "I had gone."],
              ],
            },
            examples: [
              { german: "Ich hatte gegessen, bevor ich ging.", english: "I had eaten before I left." },
              { german: "Er war schon gegangen, als ich ankam.", english: "He had already left when I arrived." },
              { german: "Nachdem sie gearbeitet hatte, ging sie.", english: "After she had worked, she left." },
            ],
            tip: "Perfekt = have done, Plusquamperfekt = had done (one step further in the past)",
          }
        },
        {
          id: "futur1",
          title: "4.5 Future I (Futur I)",
          content: {
            concept: "Future I uses werden + Infinitive. But remember: Germans often use Präsens for future instead! Futur I emphasizes certainty or makes predictions.",
            keyPoints: [
              "Formula: werden + Infinitiv (at end)",
              "Often replaced by Präsens + time word",
              "Used for: emphasis, predictions, assumptions",
              "werden conjugates: werde, wirst, wird, werden, werdet, werden",
            ],
            table: {
              headers: ["Person", "werden", "Example", "English"],
              rows: [
                ["ich", "werde", "Ich werde arbeiten.", "I will work."],
                ["du", "wirst", "Du wirst es schaffen.", "You will make it."],
                ["er/sie", "wird", "Er wird kommen.", "He will come."],
                ["wir", "werden", "Wir werden sehen.", "We will see."],
              ],
            },
            examples: [
              { german: "Ich werde morgen arbeiten.", english: "I will work tomorrow." },
              { german: "Es wird regnen.", english: "It will rain." },
              { german: "Er wird wohl krank sein.", english: "He's probably sick. (assumption)" },
            ],
            tip: "Reality check: 'Morgen arbeite ich' and 'Morgen werde ich arbeiten' mean the same thing!",
          }
        },
        {
          id: "futur2",
          title: "4.6 Future II (Futur II)",
          content: {
            concept: "Future II = 'will have done' - something will be completed by a certain time. Formula: werden + Partizip II + haben/sein.",
            keyPoints: [
              "Formula: werden + Partizip II + haben/sein",
              "Meaning: will have done by then",
              "Also used for assumptions about the past",
              "Rare in spoken German",
            ],
            table: {
              headers: ["Type", "Formula", "Example"],
              rows: [
                ["haben verbs", "werden + P.II + haben", "Ich werde gegessen haben."],
                ["sein verbs", "werden + P.II + sein", "Er wird angekommen sein."],
              ],
            },
            examples: [
              { german: "Bis 18 Uhr werde ich gegessen haben.", english: "By 6pm I will have eaten." },
              { german: "Er wird schon angekommen sein.", english: "He will have arrived by now." },
              { german: "Sie werden es vergessen haben.", english: "They will have forgotten it." },
            ],
            tip: "Futur II is often used to express assumptions: 'Er wird wohl gegangen sein' = He probably left",
          }
        },
      ]
    },
    {
      id: "level5",
      title: "Level 5: Passive Voice",
      color: "bg-purple-100 border-purple-400",
      topics: [
        {
          id: "passive-intro",
          title: "5.1 What is Passive Voice?",
          content: {
            concept: "Active = subject DOES the action. Passive = subject RECEIVES the action. German passive uses werden + Partizip II.",
            keyPoints: [
              "Active: Der Mechaniker repariert das Auto.",
              "Passive: Das Auto wird repariert.",
              "Core formula: werden + Partizip II",
              "The object becomes the subject",
            ],
            table: {
              headers: ["Voice", "Focus", "Example", "English"],
              rows: [
                ["Active", "Who does it", "Der Koch kocht das Essen.", "The cook cooks the food."],
                ["Passive", "What is done", "Das Essen wird gekocht.", "The food is being cooked."],
              ],
            },
            examples: [
              { german: "Active: Sie baut ein Haus.", english: "She builds a house." },
              { german: "Passive: Ein Haus wird gebaut.", english: "A house is being built." },
              { german: "Active: Man spricht Deutsch.", english: "One speaks German." },
              { german: "Passive: Deutsch wird gesprochen.", english: "German is spoken." },
            ],
            tip: "Passive is useful when: you don't know who did it, or it doesn't matter who did it!",
          }
        },
        {
          id: "passive-tenses",
          title: "5.2 Passive in All Tenses",
          content: {
            concept: "Passive can be formed in all tenses. The key is knowing how werden changes and what happens to the Partizip II.",
            keyPoints: [
              "Present: wird + Partizip II",
              "Präteritum: wurde + Partizip II",
              "Perfekt: ist + Partizip II + worden (NOT geworden!)",
              "Plusquamperfekt: war + Partizip II + worden",
              "Futur I: wird + Partizip II + werden",
            ],
            table: {
              headers: ["Tense", "Formula", "Example", "English"],
              rows: [
                ["Präsens", "wird + P.II", "Das Auto wird repariert.", "The car is being repaired."],
                ["Präteritum", "wurde + P.II", "Das Auto wurde repariert.", "The car was repaired."],
                ["Perfekt", "ist + P.II + worden", "Das Auto ist repariert worden.", "The car has been repaired."],
                ["Plusquamperf.", "war + P.II + worden", "Das Auto war repariert worden.", "The car had been repaired."],
                ["Futur I", "wird + P.II + werden", "Das Auto wird repariert werden.", "The car will be repaired."],
              ],
            },
            examples: [
              { german: "Die Tür wird geöffnet.", english: "The door is being opened." },
              { german: "Die Bücher wurden gelesen.", english: "The books were read." },
              { german: "Die Tür ist geöffnet worden.", english: "The door has been opened." },
            ],
            tip: "In Perfekt passive, use 'worden' NOT 'geworden'! 'geworden' = became, 'worden' = been (passive)",
          }
        },
        {
          id: "werden-overview",
          title: "5.3 WERDEN - The Multi-Purpose Verb",
          content: {
            concept: "Werden is incredibly versatile: it can mean 'to become' (full verb), form future (auxiliary), or create passive voice (auxiliary). Master werden, master German!",
            keyPoints: [
              "Vollverb (full verb): werden = to become",
              "Hilfsverb for Future: werden + Infinitiv",
              "Hilfsverb for Passive: werden + Partizip II",
              "Konjunktiv II: würde + Infinitiv (would)",
            ],
            table: {
              headers: ["Function", "Formula", "Example", "English"],
              rows: [
                ["Full verb", "werden alone", "Er wird müde.", "He becomes tired."],
                ["Future (Active)", "werden + Infinitiv", "Ich werde lernen.", "I will learn."],
                ["Passive (Present)", "werden + P.II", "Es wird gemacht.", "It is being done."],
                ["Konjunktiv II", "würde + Infinitiv", "Ich würde gehen.", "I would go."],
              ],
            },
            examples: [
              { german: "Er wird Arzt. (full verb)", english: "He's becoming a doctor." },
              { german: "Er wird arbeiten. (future)", english: "He will work." },
              { german: "Die Arbeit wird gemacht. (passive)", english: "The work is being done." },
              { german: "Ich würde gern helfen. (Konj. II)", english: "I would like to help." },
            ],
            tip: "werden + Infinitiv = Future. werden + Partizip II = Passive. Learn to spot the difference!",
          }
        },
        {
          id: "active-passive-compare",
          title: "5.4 Active vs Passive Comparison Tables",
          content: {
            concept: "Here are comprehensive tables comparing Active and Passive voice across all tenses, for both normal verbs and modal verbs.",
            keyPoints: [
              "Normal verbs: straightforward werden + Partizip II",
              "Modal verbs: modal (Infinitiv) + werden",
              "Active: focus on who does it",
              "Passive: focus on what is done",
            ],
            table: {
              headers: ["Tense", "Active (lesen)", "Passive (lesen)"],
              rows: [
                ["Präsens", "Ich lese ein Buch.", "Das Buch wird gelesen."],
                ["Präteritum", "Ich las ein Buch.", "Das Buch wurde gelesen."],
                ["Perfekt", "Ich habe ein Buch gelesen.", "Das Buch ist gelesen worden."],
                ["Plusquamperf.", "Ich hatte ein Buch gelesen.", "Das Buch war gelesen worden."],
                ["Futur I", "Ich werde ein Buch lesen.", "Das Buch wird gelesen werden."],
                ["Konj. II Präs.", "Ich würde ein Buch lesen.", "Das Buch würde gelesen werden."],
              ],
            },
            examples: [
              { german: "Das Buch muss gelesen werden.", english: "The book must be read. (modal passive)" },
              { german: "Das Buch musste gelesen werden.", english: "The book had to be read." },
              { german: "Das Buch hat gelesen werden müssen.", english: "The book has had to be read." },
            ],
            tip: "Modal + Passive formula: Modal + Partizip II + werden → Das muss gemacht werden.",
          }
        },
      ]
    },
    {
      id: "level6",
      title: "Level 6: Verb Moods",
      color: "bg-pink-100 border-pink-400",
      topics: [
        {
          id: "modal-verbs",
          title: "6.1 Modal Verbs - Present & Konjunktiv II",
          content: {
            concept: "Modal verbs express ability, permission, obligation, desire. They're used with another verb in infinitive at the END. Konjunktiv II forms (könnte, sollte) are like 'would/could/should'.",
            keyPoints: [
              "können = can, to be able to → könnte = could",
              "müssen = must, have to → müsste = would have to",
              "dürfen = may, allowed to → dürfte = might be allowed",
              "wollen = want to → wollte = would want",
              "sollen = should → sollte = should (softer)",
              "mögen = to like → möchte = would like",
            ],
            table: {
              headers: ["English", "German Present", "Konjunktiv II", "Example (Konj. II)"],
              rows: [
                ["I can do it", "Ich kann es machen", "Ich könnte es machen", "Ich könnte morgen kommen."],
                ["I may do it", "Ich darf es machen", "Ich dürfte es machen", "Ich dürfte länger bleiben."],
                ["I must do it", "Ich muss es machen", "Ich müsste es machen", "Ich müsste mehr lernen."],
                ["I shall do it", "Ich soll es machen", "Ich sollte es machen", "Ich sollte früher gehen."],
                ["I want to do it", "Ich will es machen", "Ich wollte es machen", "Ich wollte dir helfen."],
                ["I like to do it", "Ich mag es / ich mache es gern", "Ich möchte es machen", "Ich möchte einen Kaffee."],
              ],
            },
            examples: [
              { german: "Ich kann Deutsch sprechen.", english: "I can speak German." },
              { german: "Könnten Sie mir helfen?", english: "Could you help me? (polite)" },
              { german: "Ich möchte einen Kaffee.", english: "I would like a coffee." },
              { german: "Du solltest mehr schlafen.", english: "You should sleep more." },
            ],
            tip: "Konjunktiv II is SUPER useful for politeness: 'Könnten Sie...' is more polite than 'Können Sie...'",
          }
        },
        {
          id: "past-conditional",
          title: "6.2 Past Conditional (hätte/wäre + Partizip II)",
          content: {
            concept: "Past conditional = 'would have done' - expressing what would have happened (but didn't). Use hätte/wäre + Infinitiv + Modal (Infinitiv) OR hätte/wäre + Partizip II.",
            keyPoints: [
              "hätte + Partizip II = would have (haben verbs)",
              "wäre + Partizip II = would have (sein verbs)",
              "This is for counterfactual past situations",
              "Often used with 'wenn' (if) clauses",
            ],
            table: {
              headers: ["English", "German", "Example"],
              rows: [
                ["I could have done it", "Ich hätte es machen können", "Ich hätte das machen können."],
                ["I may have been allowed", "Ich hätte es machen dürfen", "Ich hätte länger bleiben dürfen."],
                ["I would have had to", "Ich hätte es machen müssen", "Ich hätte gestern arbeiten müssen."],
                ["I should have done it", "Ich hätte es machen sollen", "Ich hätte mehr lernen sollen."],
                ["I would have wanted", "Ich hätte es machen wollen", "Ich hätte helfen wollen."],
                ["I would have liked it", "Ich hätte es gemocht", "Ich hätte das gemocht."],
              ],
            },
            examples: [
              { german: "Ich hätte früher kommen sollen.", english: "I should have come earlier." },
              { german: "Wenn ich Zeit gehabt hätte, wäre ich gekommen.", english: "If I had had time, I would have come." },
              { german: "Das hättest du mir sagen können!", english: "You could have told me that!" },
            ],
            tip: "This chapter = missed/counterfactual past. 'Ich hätte... sollen' = I should have (but didn't)!",
          }
        },
        {
          id: "modal-perfect",
          title: "6.3 Modal + Perfect Infinitive (Assumptions)",
          content: {
            concept: "Modal (often Konjunktiv II) + Partizip II + haben/sein expresses assumptions about the past: 'may/might/must have done'.",
            keyPoints: [
              "Formula: Modal + Partizip II + haben/sein",
              "können/könnte: possibility (may/might have)",
              "müssen: deduction (must have)",
              "sollen: hearsay (is said to have)",
              "wollen: self-claim (claims to have)",
            ],
            table: {
              headers: ["Meaning", "German Pattern", "Example"],
              rows: [
                ["may/might have done", "kann/könnte + P.II + haben", "Er könnte das gesagt haben."],
                ["is likely to have done", "dürfte + P.II + haben", "Er dürfte schon angekommen sein."],
                ["must have done", "muss + P.II + haben", "Er muss den Fehler gemacht haben."],
                ["is said to have done", "soll + P.II + haben", "Er soll viel verdient haben."],
                ["claims to have done", "will + P.II + haben", "Er will das allein geschafft haben."],
              ],
            },
            examples: [
              { german: "Er könnte das gesagt haben.", english: "He may/might have said that." },
              { german: "Sie muss krank gewesen sein.", english: "She must have been sick." },
              { german: "Er soll sehr reich gewesen sein.", english: "He is said to have been very rich." },
            ],
            tip: "These are epistemic modals - expressing degrees of certainty about past events!",
          }
        },
        {
          id: "konjunktiv1",
          title: "6.4 Konjunktiv I (Indirect Speech)",
          content: {
            concept: "Konjunktiv I is used in formal/news German for indirect speech - reporting what someone said. Main forms to know: sei, habe, werde.",
            keyPoints: [
              "Used in news, reports, formal writing",
              "Reports what someone said/claims",
              "Key forms: sei (is), habe (has), werde (will)",
              "If Konj. I = Indikativ, use Konj. II instead",
            ],
            table: {
              headers: ["Direct", "Indirect (Konj. I)", "English"],
              rows: [
                ["'Ich bin krank.'", "Er sagt, er sei krank.", "He says he is sick."],
                ["'Ich habe Zeit.'", "Sie sagt, sie habe Zeit.", "She says she has time."],
                ["'Ich werde kommen.'", "Er sagt, er werde kommen.", "He says he will come."],
              ],
            },
            examples: [
              { german: "Der Minister sagte, er sei nicht informiert.", english: "The minister said he wasn't informed." },
              { german: "Sie behauptet, sie habe das nicht gewusst.", english: "She claims she didn't know that." },
            ],
            tip: "In everyday speech, Germans use Indikativ or Konjunktiv II. Konj. I is mainly for formal/written German.",
          }
        },
        {
          id: "konjunktiv2",
          title: "6.5 Konjunktiv II (Wishes & Hypotheticals)",
          content: {
            concept: "Konjunktiv II is for wishes, hypotheticals, and politeness. Use würde + Infinitiv (easy) or real Konj. II forms (wäre, hätte, könnte).",
            keyPoints: [
              "Politeness: Könnten Sie mir helfen?",
              "Wishes: Ich wünschte, ich wäre reich.",
              "Hypothetical: Wenn ich Zeit hätte, würde ich reisen.",
              "würde + Infinitiv = universal polite/hypothetical form",
            ],
            table: {
              headers: ["Usage", "Example", "English"],
              rows: [
                ["Politeness", "Könnten Sie mir helfen?", "Could you help me?"],
                ["Wish", "Ich hätte gern einen Kaffee.", "I would like a coffee."],
                ["Hypothetical", "Wenn ich reich wäre...", "If I were rich..."],
                ["würde form", "Ich würde das machen.", "I would do that."],
              ],
            },
            examples: [
              { german: "Wenn ich Zeit hätte, würde ich mehr lesen.", english: "If I had time, I would read more." },
              { german: "Ich wünschte, ich könnte fliegen.", english: "I wish I could fly." },
              { german: "Hätte ich das nur gewusst!", english: "If only I had known that!" },
            ],
            tip: "Learn these real Konj. II forms: wäre, hätte, könnte, müsste, dürfte, würde - they're everywhere!",
          }
        },
        {
          id: "imperativ",
          title: "6.6 Imperativ (Commands)",
          content: {
            concept: "Imperativ is for commands and requests. There's no tense - it's always 'NOW!' Three forms: du, ihr, Sie.",
            keyPoints: [
              "du-form: verb stem (+ e for some): Komm! Arbeite!",
              "ihr-form: like present: Kommt! Arbeitet!",
              "Sie-form: Infinitiv + Sie: Kommen Sie! Arbeiten Sie!",
              "Irregular verbs may have vowel change in du-form",
            ],
            table: {
              headers: ["Infinitive", "du", "ihr", "Sie"],
              rows: [
                ["kommen", "Komm!", "Kommt!", "Kommen Sie!"],
                ["machen", "Mach!", "Macht!", "Machen Sie!"],
                ["lesen", "Lies!", "Lest!", "Lesen Sie!"],
                ["fahren", "Fahr!", "Fahrt!", "Fahren Sie!"],
                ["sein", "Sei!", "Seid!", "Seien Sie!"],
              ],
            },
            examples: [
              { german: "Komm her!", english: "Come here! (informal)" },
              { german: "Bitte setzen Sie sich.", english: "Please sit down. (formal)" },
              { german: "Seid ruhig!", english: "Be quiet! (plural informal)" },
              { german: "Lies das Buch!", english: "Read the book! (e→ie)" },
            ],
            tip: "Add 'bitte' to make commands polite: 'Kommen Sie bitte!' 'Hilf mir bitte!'",
          }
        },
      ]
    },
  ],
}

const casesTree = {
  id: "cases",
  title: "CASES (Der Fall)",
  description: "See how cases show roles and change German words.",
  intro: "Cases are simply labels for sentence roles: who does what, who receives it, where it happens, and whose it is. Think of them as a roadmap for meaning.",
  rootLabel: "CASES",
  branches: [
    {
      id: "cases-level1",
      title: "Level 1: Case Foundations",
      color: "bg-amber-100 border-amber-400",
      topics: [
        {
          id: "nominativ",
          title: "1.1 Nominativ - The Subject",
          content: {
            concept: "Nominativ is the subject of a sentence: the person or thing doing the action. Do not be scared by the word. It simply means the doer, just like the English subject.",
            keyPoints: [
              "Nominativ = who or what is doing the action",
              "It matches the subject in English",
              "Question test: Wer? (who) or Was? (what)",
              "Articles and pronouns use nominative forms",
            ],
            table: {
              headers: ["Role", "Question", "Example"],
              rows: [
                ["Subject", "Wer? / Was?", "Der Mann liest."],
                ["Subject", "Wer?", "Ich lerne Deutsch."],
                ["Subject", "Was?", "Das Buch ist neu."],
              ],
            },
            examples: [
              { german: "Die Frau kocht.", english: "The woman cooks." },
              { german: "Mein Bruder arbeitet.", english: "My brother works." },
            ],
            tip: "If you can replace the noun with 'he/she/it' or 'I', you are usually in Nominativ.",
          },
        },
        {
          id: "akkusativ",
          title: "1.2 Akkusativ - The Direct Object",
          content: {
            concept: "Akkusativ is the direct object, similar to English. It answers who/what receives the action. Sometimes English calls it an indirect object, but the key test is the question: Wen? or Was?",
            keyPoints: [
              "Akkusativ = who/what the action happens to",
              "Question test: Wen? (who) or Was? (what)",
              "Many verbs need an Akkusativ object",
              "Prepositions like durch, für, gegen, ohne, um take Akkusativ",
            ],
            table: {
              headers: ["Question", "Answer", "Example"],
              rows: [
                ["Wen siehst du?", "Meinen Freund.", "Ich sehe meinen Freund."],
                ["Was kaufst du?", "Das Brot.", "Ich kaufe das Brot."],
                ["Wen ruft sie an?", "Ihre Mutter.", "Sie ruft ihre Mutter an."],
              ],
            },
            examples: [
              { german: "Ich lese ein Buch.", english: "I read a book." },
              { german: "Er liebt seine Familie.", english: "He loves his family." },
            ],
            tip: "If the object answers Wen or Was, it is Akkusativ.",
          },
        },
        {
          id: "dativ",
          title: "1.3 Dativ - The Indirect Object",
          content: {
            concept: "Dativ is similar to the English indirect object: to whom/for whom something happens. It also shows location without movement and time expressions.",
            keyPoints: [
              "Dativ = to whom/for whom",
              "Question test: Wem? (to whom)",
              "Location without movement and time are often Dativ",
              "Common verbs: helfen, danken, geben",
            ],
            table: {
              headers: ["Use", "Question", "Example"],
              rows: [
                ["Indirect object", "Wem?", "Ich gebe dem Kind ein Buch."],
                ["Location", "Wo?", "Ich bin in der Schule."],
                ["Time", "Wann?", "Am Montag arbeite ich."],
              ],
            },
            examples: [
              { german: "Ich helfe meinem Bruder.", english: "I help my brother." },
              { german: "Wir wohnen in der Stadt.", english: "We live in the city." },
            ],
            tip: "If you can ask Wo? or Wem?, you are likely in Dativ.",
          },
        },
        {
          id: "genitiv",
          title: "1.4 Genitiv - Possession",
          content: {
            concept: "Genitiv shows possession or relationship, like English 's or 'of'. In the beginning, just see it as ownership. It has rules, but the idea is simple.",
            keyPoints: [
              "Genitiv = possession/relationship",
              "English parallel: my father's book = das Buch meines Vaters",
              "Question test: Wessen? (whose)",
              "Some prepositions also require Genitiv",
            ],
            table: {
              headers: ["Question", "Answer", "Example"],
              rows: [
                ["Wessen Buch?", "Meines Vaters.", "Das ist das Buch meines Vaters."],
                ["Wessen Auto?", "Der Lehrerin.", "Das ist das Auto der Lehrerin."],
              ],
            },
            examples: [
              { german: "Die Farbe des Hauses ist blau.", english: "The color of the house is blue." },
              { german: "Das Ende der Woche kommt bald.", english: "The end of the week is soon." },
            ],
            tip: "Start by recognizing Genitiv as possession. You can learn the endings after the idea feels clear.",
          },
        },
      ],
    },
    {
      id: "cases-level2",
      title: "Level 2: Finding the Case",
      color: "bg-blue-100 border-blue-400",
      topics: [
        {
          id: "question-test",
          title: "2.1 The Question Test",
          content: {
            concept: "The easiest way to find the case is to ask a question about the noun: Wer/Was for Nominativ, Wen/Was for Akkusativ, Wem for Dativ, Wessen for Genitiv.",
            keyPoints: [
              "Wer/Was -> Nominativ",
              "Wen/Was -> Akkusativ",
              "Wem -> Dativ",
              "Wessen -> Genitiv",
            ],
            table: {
              headers: ["Case", "Question", "Example"],
              rows: [
                ["Nominativ", "Wer? / Was?", "Wer lernt? Ich lerne."],
                ["Akkusativ", "Wen? / Was?", "Was liest du? Ein Buch."],
                ["Dativ", "Wem?", "Wem gibst du das? Meiner Schwester."],
                ["Genitiv", "Wessen?", "Wessen Fahrrad? Meines Bruders."],
              ],
            },
            examples: [
              { german: "Wen siehst du? Ich sehe den Lehrer.", english: "Who do you see? I see the teacher." },
              { german: "Wem hilfst du? Ich helfe meinem Freund.", english: "Who are you helping? I help my friend." },
            ],
            tip: "If you are unsure, ask the question out loud and see which answer fits.",
          },
        },
        {
          id: "movement-location",
          title: "2.2 Movement vs Location",
          content: {
            concept: "With two-way prepositions, movement uses Akkusativ and location uses Dativ. Think: Where are you? (Dativ) Where to? (Akkusativ).",
            keyPoints: [
              "Wo? (where) -> Dativ",
              "Wohin? (where to) -> Akkusativ",
              "Two-way prepositions: in, an, auf, über, unter, vor, hinter, neben, zwischen",
              "Same preposition, different case based on movement",
            ],
            table: {
              headers: ["Question", "Case", "Example"],
              rows: [
                ["Wo?", "Dativ", "Ich bin im Park."],
                ["Wohin?", "Akkusativ", "Ich gehe in den Park."],
                ["Wo?", "Dativ", "Das Buch liegt auf dem Tisch."],
                ["Wohin?", "Akkusativ", "Ich lege das Buch auf den Tisch."],
              ],
            },
            examples: [
              { german: "Wir sitzen an dem Fenster.", english: "We sit by the window." },
              { german: "Wir setzen uns an das Fenster.", english: "We sit down by the window." },
            ],
            tip: "Movement = change of location. No movement = Dativ.",
          },
        },
        {
          id: "double-objects",
          title: "2.3 Two Objects in One Sentence",
          content: {
            concept: "Many German verbs take two objects: one Dativ (person) and one Akkusativ (thing). The person usually gets Dativ.",
            keyPoints: [
              "Dativ = person, Akkusativ = thing",
              "Ich gebe dem Mann (Dat) das Buch (Akk)",
              "If a pronoun is involved, word order can shift",
              "Question test still works for each object",
            ],
            table: {
              headers: ["Verb", "Dativ (person)", "Akkusativ (thing)"],
              rows: [
                ["geben", "Ich gebe dem Kind", "ein Geschenk."],
                ["zeigen", "Er zeigt seiner Freundin", "die Wohnung."],
                ["schicken", "Wir schicken unserem Lehrer", "eine Email."],
              ],
            },
            examples: [
              { german: "Ich erkläre meinem Bruder die Regel.", english: "I explain the rule to my brother." },
              { german: "Sie kauft ihrer Mutter Blumen.", english: "She buys flowers for her mother." },
            ],
            tip: "Ask two questions: Wem? for the person, Was? for the thing.",
          },
        },
      ],
    },
    {
      id: "cases-level3",
      title: "Level 3: How Words Change",
      color: "bg-green-100 border-green-400",
      topics: [
        {
          id: "pronouns-reflexive",
          title: "3.1 Personal and Reflexive Pronouns",
          content: {
            concept: "Cases change personal and reflexive pronouns. Some forms look irregular, but the idea is the same as English: subject vs object. Compare 'I' to 'me' or 'he' to 'him'.",
            keyPoints: [
              "ich -> mich (Akk) -> mir (Dat)",
              "du -> dich (Akk) -> dir (Dat)",
              "er -> ihn (Akk) -> ihm (Dat)",
              "Reflexive: mich/dich/sich/uns/euch/sich",
              "Genitiv pronouns exist but are less common in modern speech",
            ],
            table: {
              headers: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
              rows: [
                ["ich", "mich", "mir", "meiner"],
                ["du", "dich", "dir", "deiner"],
                ["er", "ihn", "ihm", "seiner"],
                ["sie", "sie", "ihr", "ihrer"],
                ["es", "es", "ihm", "seiner"],
                ["wir", "uns", "uns", "unserer"],
                ["ihr", "euch", "euch", "eurer"],
                ["sie/Sie", "sie/Sie", "ihnen/Ihnen", "ihrer/Ihrer"],
              ],
            },
            examples: [
              { german: "Ich sehe ihn.", english: "I see him." },
              { german: "Er hilft mir.", english: "He helps me." },
              { german: "Wir gedenken ihrer.", english: "We remember them." },
            ],
            tip: "If it sounds like 'me/him/her' in English, it is probably Akkusativ or Dativ in German.",
          },
        },
        {
          id: "articles",
          title: "3.2 Definite and Indefinite Articles",
          content: {
            concept: "Articles change with case. The biggest change is the masculine Akkusativ (der -> den) and the Dativ/Genitiv endings.",
            keyPoints: [
              "Definite: der/die/das change per case",
              "Indefinite: ein/eine change per case",
              "Masculine Akkusativ: der -> den",
              "Dativ plural adds -n",
            ],
            table: {
              headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
              rows: [
                ["Nominativ", "der", "die", "das", "die"],
                ["Akkusativ", "den", "die", "das", "die"],
                ["Dativ", "dem", "der", "dem", "den"],
                ["Genitiv", "des", "der", "des", "der"],
              ],
            },
            examples: [
              { german: "Ich sehe den Mann.", english: "I see the man." },
              { german: "Ich helfe der Frau.", english: "I help the woman." },
            ],
            tip: "Focus on the masculine changes first: der -> den -> dem -> des.",
          },
        },
        {
          id: "prepositions",
          title: "3.3 Prepositions by Case",
          content: {
            concept: "Many prepositions force a specific case. Memorize them as chunks: mit + Dativ, für + Akkusativ, während + Genitiv.",
            keyPoints: [
              "Akkusativ: durch, für, gegen, ohne, um",
              "Dativ: aus, bei, mit, nach, seit, von, zu",
              "Genitiv: während, wegen, trotz",
              "Two-way: in, an, auf, über, unter, vor, hinter, neben, zwischen",
            ],
            table: {
              headers: ["Case", "Prepositions", "Example"],
              rows: [
                ["Akkusativ", "durch, für, gegen, ohne, um", "Ich gehe ohne den Hund."],
                ["Dativ", "aus, bei, mit, nach, seit, von, zu", "Ich fahre mit dem Bus."],
                ["Genitiv", "während, wegen, trotz", "Trotz des Regens gehe ich."],
                ["Two-way", "in, an, auf, über, unter, vor, hinter, neben, zwischen", "Ich bin im Zimmer."],
              ],
            },
            examples: [
              { german: "Wir warten auf den Zug.", english: "We are waiting for the train." },
              { german: "Er spricht mit seiner Schwester.", english: "He speaks with his sister." },
            ],
            tip: "Learn prepositions with their case, not separately.",
          },
        },
        {
          id: "adjective-declension",
          title: "3.4 Adjective Declension by Case",
          content: {
            concept: "Adjectives change their endings based on case and the article before them. Cases tell you which ending to use.",
            keyPoints: [
              "Adjective endings depend on case + article",
              "Nominativ and Akkusativ often look similar",
              "Dativ adds -en in many patterns",
              "Genitiv adds -en after most articles",
            ],
            table: [
              {
                title: "With Definite Articles (der, die, das, die)",
                headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
                rows: [
                  ["Nominativ", "der kleine Hund", "die kleine Katze", "das kleine Kind", "die kleinen Hunde"],
                  ["Akkusativ", "den kleinen Hund", "die kleine Katze", "das kleine Kind", "die kleinen Hunde"],
                  ["Dativ", "dem kleinen Hund", "der kleinen Katze", "dem kleinen Kind", "den kleinen Hunden"],
                  ["Genitiv", "des kleinen Hundes", "der kleinen Katze", "des kleinen Kindes", "der kleinen Hunde"],
                ],
              },
              {
                title: "With Indefinite Articles (ein, eine, ein)",
                headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural (no form)"],
                rows: [
                  ["Nominativ", "ein kleiner Hund", "eine kleine Katze", "ein kleines Kind", "kleine Hunde"],
                  ["Akkusativ", "einen kleinen Hund", "eine kleine Katze", "ein kleines Kind", "kleine Hunde"],
                  ["Dativ", "einem kleinen Hund", "einer kleinen Katze", "einem kleinen Kind", "kleinen Hunden"],
                  ["Genitiv", "eines kleinen Hundes", "einer kleinen Katze", "eines kleinen Kindes", "kleiner Hunde"],
                ],
              },
              {
                title: "With No Article",
                headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
                rows: [
                  ["Nominativ", "kleiner Hund", "kleine Katze", "kleines Kind", "kleine Hunde"],
                  ["Akkusativ", "kleinen Hund", "kleine Katze", "kleines Kind", "kleine Hunde"],
                  ["Dativ", "kleinem Hund", "kleiner Katze", "kleinem Kind", "kleinen Hunden"],
                  ["Genitiv", "kleinen Hundes", "kleiner Katze", "kleinen Kindes", "kleiner Hunde"],
                ],
              },
            ],
            examples: [
              { german: "Ich sehe den kleinen Hund.", english: "I see the small dog." },
              { german: "Wir helfen einer netten Frau.", english: "We help a nice woman." },
            ],
            tip: "If you know the article ending, the adjective ending often mirrors it.",
          },
        },
      ],
    },
  ],
}

// Regular lessons (non-verb)
const regularLessons = [
  {
    id: 101,
    title: "Personal Pronouns (Personalpronomen)",
    description: "Learn the subject pronouns - your first step to building sentences",
    level: "Beginner",
    duration: "10 min",
    content: {
      concept: `Personal pronouns in German work just like "I, you, he, she" in English - they replace nouns to avoid repetition. The key difference is that German has formal and informal ways to say "you".`,
      keyPoints: [
        "ich = I (always lowercase unless starting a sentence)",
        "du = you (informal, for friends/family/children)",
        "er/sie/es = he/she/it (same as English)",
        "wir = we, ihr = you all (informal plural)",
        "sie = they, Sie = you (formal, always capitalized)",
      ],
      table: {
        headers: ["German", "English", "Usage"],
        rows: [
          ["ich", "I", "Talking about yourself"],
          ["du", "you (singular)", "Informal - friends, family, kids"],
          ["er", "he", "Masculine person/noun"],
          ["sie", "she", "Feminine person/noun"],
          ["es", "it", "Neuter noun or impersonal"],
          ["wir", "we", "You + others"],
          ["ihr", "you (plural)", "Informal - group of friends"],
          ["sie", "they", "Multiple people/things"],
          ["Sie", "you (formal)", "Strangers, professional settings"],
        ],
      },
      examples: [
        { german: "Ich bin Student.", english: "I am a student." },
        { german: "Du bist mein Freund.", english: "You are my friend." },
        { german: "Sie sind sehr nett.", english: "You are very nice. (formal)" },
      ],
      tip: "Remember: 'Sie' (formal you) is always capitalized, while 'sie' (they/she) is lowercase!",
    },
  },
  {
    id: 102,
    title: "Possessive Articles (Possessivartikel)",
    description: "Express ownership - my, your, his, her, etc.",
    level: "Beginner",
    duration: "12 min",
    content: {
      concept: `Possessive articles show ownership, like "my book" or "your car". The base forms map to each pronoun.`,
      keyPoints: [
        "mein = my (from ich)",
        "dein = your (informal, from du)",
        "sein = his/its (from er/es)",
        "ihr = her/their (from sie)",
        "unser = our (from wir)",
        "euer = your plural (from ihr)",
        "Ihr = your formal (from Sie)",
      ],
      table: {
        headers: ["Pronoun", "Possessive", "Example", "Translation"],
        rows: [
          ["ich", "mein", "mein Buch", "my book"],
          ["du", "dein", "dein Auto", "your car"],
          ["er/es", "sein", "sein Haus", "his/its house"],
          ["sie", "ihr", "ihr Hund", "her dog"],
          ["wir", "unser", "unser Lehrer", "our teacher"],
          ["ihr", "euer", "euer Zimmer", "your (pl.) room"],
          ["sie", "ihr", "ihr Kind", "their child"],
          ["Sie", "Ihr", "Ihr Name", "your (formal) name"],
        ],
      },
      examples: [
        { german: "Das ist mein Bruder.", english: "This is my brother." },
        { german: "Wo ist dein Handy?", english: "Where is your phone?" },
      ],
      tip: "Possessives take the same endings as 'ein/eine'!",
    },
  },
  {
    id: 103,
    title: "Articles & Gender",
    description: "Master der/die/das - the key to German nouns",
    level: "Beginner",
    duration: "15 min",
    content: {
      concept: `German has three genders: masculine (der), feminine (die), neuter (das). Always learn nouns WITH their article!`,
      keyPoints: [
        "der = masculine (der Mann)",
        "die = feminine (die Frau) - also ALL plurals!",
        "das = neuter (das Kind)",
        "Noun endings often hint at gender",
        "Always learn: article + noun as one unit",
      ],
      table: {
        headers: ["Gender", "Article", "Ending Hints", "Example"],
        rows: [
          ["Masculine", "der", "-er (people), -ling, -ismus", "der Lehrer"],
          ["Feminine", "die", "-ung, -keit, -heit, -ion, -schaft", "die Zeitung"],
          ["Neuter", "das", "-chen, -lein, -um, -ment", "das Mädchen"],
          ["Plural", "die", "(all plurals)", "die Bücher"],
        ],
      },
      examples: [
        { german: "Der Mann liest.", english: "The man reads." },
        { german: "Die Zeitung ist interessant.", english: "The newspaper is interesting." },
      ],
      tip: "-ung, -keit, -heit, -schaft = ALWAYS feminine (die)!",
    },
  },
  {
    id: 104,
    title: "Prepositions & Intoduction to Cases",
    description: "Master prepositions - they determine which case to use!",
    level: "Intermediate",
    duration: "20 min",
    content: {
      concept: `Each preposition demands a specific CASE! Some always take Accusative, some always Dative, and some can take either.`,
      keyPoints: [
        "Accusative: durch, für, gegen, ohne, um (DOGFU)",
        "Dative: aus, bei, mit, nach, seit, von, zu",
        "Two-way: in, an, auf, über, unter, vor, hinter, neben, zwischen",
        "Two-way: motion → Akk, location → Dat",
      ],
      table: {
        headers: ["Case", "Prepositions", "Example"],
        rows: [
          ["Accusative", "für, ohne, durch, gegen, um", "Das ist für dich."],
          ["Dative", "mit, von, zu, bei, nach, aus, seit", "Ich fahre mit dem Bus."],
          ["Two-way (motion)", "in + Akk", "Ich gehe in die Schule."],
          ["Two-way (location)", "in + Dat", "Ich bin in der Schule."],
        ],
      },
      examples: [
        { german: "Ich warte auf dich. (Akk)", english: "I'm waiting for you." },
        { german: "Ich helfe dir bei der Arbeit. (Dat)", english: "I help you with work." },
      ],
      tip: "DOGFU = durch, ohne, gegen, für, um → Always Accusative!",
    },
  },
  {
    id: 105,
    title: "Question Words (W-Fragen)",
    description: "Ask questions - including wo+prep vs prep+wen/wem",
    level: "Beginner",
    duration: "15 min",
    content: {
      concept: `Question words mostly start with 'W'. For prepositional questions: THINGS use wo+prep, PEOPLE use prep+wen/wem.`,
      keyPoints: [
        "Was = What, Wer = Who, Wo = Where, Wann = When",
        "Warum = Why, Wie = How",
        "For THINGS: wo + prep (wofür, womit, worüber)",
        "For PEOPLE: prep + wen/wem (für wen, mit wem)",
      ],
      table: {
        headers: ["Question", "For Things", "For People"],
        rows: [
          ["about what/whom", "worüber", "über wen"],
          ["for what/whom", "wofür", "für wen"],
          ["with what/whom", "womit", "mit wem"],
          ["on what/whom", "worauf", "auf wen"],
        ],
      },
      examples: [
        { german: "Worüber sprichst du? (thing)", english: "What are you talking about?" },
        { german: "Über wen sprichst du? (person)", english: "Who are you talking about?" },
      ],
      tip: "If preposition starts with vowel, add 'r': wo + auf = worauf",
    },
  },
  {
    id: 106,
    title: "Connectors & Word Order",
    description: "Join sentences - but watch the verb position!",
    level: "Intermediate",
    duration: "18 min",
    content: {
      concept: `Different connectors change where the verb goes! Type 0: verb stays, Type 1: verb to end, Type 2: verb after connector.`,
      keyPoints: [
        "Type 0: und, oder, aber, denn → verb position unchanged",
        "Type 1: weil, dass, wenn, obwohl → verb goes to END",
        "Type 2: deshalb, trotzdem, dann → verb comes FIRST after",
        "Subordinate clause first? Get verb-verb!",
      ],
      table: {
        headers: ["Type", "Connectors", "Verb Position"],
        rows: [
          ["0 (Coordinating)", "und, oder, aber, denn", "Normal (position 2)"],
          ["1 (Subordinating)", "weil, dass, wenn, obwohl", "End of clause"],
          ["2 (Adverbs)", "deshalb, trotzdem, dann", "After connector"],
        ],
      },
      examples: [
        { german: "Ich bleibe, weil ich müde bin.", english: "I'm staying because I'm tired." },
        { german: "Weil ich müde bin, bleibe ich.", english: "Because I'm tired, I'm staying." },
      ],
      tip: "Type 1 clause first → verb-verb pattern: 'Weil ich müde BIN, GEHE ich.'",
    },
  },
]

export function LessonsTab({ onNavigate }: LessonsTabProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [activeTree, setActiveTree] = useState<"verbs" | "cases" | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set())
  const casesTopicCount = casesTree.branches.reduce((acc, branch) => acc + branch.topics.length, 0)

  const openTree = (tree: "verbs" | "cases") => {
    setActiveTree(tree)
    setSelectedBranch(null)
    setSelectedTopic(null)
    setExpandedBranches(new Set())
  }

  const closeTree = () => {
    setActiveTree(null)
    setSelectedBranch(null)
    setSelectedTopic(null)
    setExpandedBranches(new Set())
  }

  const handleConnectorLink = () => {
    onNavigate("core")
    if (typeof window !== "undefined") {
      window.location.hash = "core-topic-11"
    }
  }

  const toggleBranch = (branchId: string) => {
    const newExpanded = new Set(expandedBranches)
    if (newExpanded.has(branchId)) {
      newExpanded.delete(branchId)
    } else {
      newExpanded.add(branchId)
    }
    setExpandedBranches(newExpanded)
  }

  const activeTreeData = activeTree === "cases" ? casesTree : verbTree
  const currentBranch = activeTree
    ? activeTreeData.branches.find(b => b.id === selectedBranch)
    : undefined
  const currentTopic = currentBranch?.topics.find(t => t.id === selectedTopic)

  // Render verb lesson content
  const renderVerbContent = (content: LessonContent) => {
    const tables = (Array.isArray(content.table)
      ? content.table
      : [content.table]) as Array<{
      title?: string
      headers: string[]
      rows: string[][]
    }>

    return (
      <div className="space-y-6">
      {/* Concept */}
      <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Core Concept
        </h4>
        <p className="text-foreground/80">{content.concept}</p>
      </div>

      {/* Key Points */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          Key Points
        </h4>
        <ul className="space-y-2">
          {content.keyPoints.map((point, i) => {
            const hasCoreLink = typeof point === "string" && point.includes("Click here")
            const linkParts = hasCoreLink ? point.split("Click here") : [point, ""]

            return (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm">
                  {hasCoreLink ? (
                    <>
                      {linkParts[0]}
                      <button
                        type="button"
                        onClick={handleConnectorLink}
                        className="text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        Click here
                      </button>
                      {linkParts[1]}
                    </>
                  ) : (
                    point
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Table */}
      <div>
        <h4 className="font-semibold mb-3">
          {tables.length > 1 ? "Reference Tables" : "Reference Table"}
        </h4>
        <div className="space-y-6">
          {tables.map((table, tableIndex) => (
            <div key={tableIndex}>
              {table.title && (
                <h5 className="font-semibold text-sm text-muted-foreground mb-2">
                  {table.title}
                </h5>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      {table.headers.map((header, i) => (
                        <th
                          key={i}
                          className="border border-border px-3 py-2 text-left font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        {row.map((cell, j) => (
                          <td key={j} className="border border-border px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <h4 className="font-semibold mb-3">Examples</h4>
        <div className="space-y-2">
          {content.examples.map((ex, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium text-primary">{ex.german}</p>
              <p className="text-sm text-muted-foreground">{ex.english}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Pro Tip
        </h4>
        <p className="text-yellow-900 text-sm">{content.tip}</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={() => onNavigate("vocab")} className="gap-2">
          <BookText className="h-4 w-4" />
          Study Vocabulary
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("cards")} className="gap-2">
          <Layers className="h-4 w-4" />
          Practice Flashcards
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("core")} className="gap-2">
          <Target className="h-4 w-4" />
          Full Grammar Reference
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("cheat")} className="gap-2">
          <Zap className="h-4 w-4" />
          Quick Cheat Sheet
        </Button>
      </div>
      </div>
    )
  }

  // Verb Tree View
  if (activeTree) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => {
            if (selectedTopic) {
              setSelectedTopic(null)
            } else if (selectedBranch) {
              setSelectedBranch(null)
            } else {
              closeTree()
            }
          }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">{activeTreeData.title}</h2>
            <p className="text-muted-foreground">{activeTreeData.description}</p>
          </div>
        </div>

        {/* Topic Content View */}
        {selectedTopic && currentTopic ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentTopic.title}</CardTitle>
              <CardDescription>
                {currentBranch?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderVerbContent(currentTopic.content)}
            </CardContent>
          </Card>
        ) : selectedBranch && currentBranch ? (
          /* Branch Topics View */
          <div className="space-y-4">
            <Card className={cn("border-2", currentBranch.color)}>
              <CardHeader>
                <CardTitle>{currentBranch.title}</CardTitle>
              </CardHeader>
            </Card>
            
            <div className="grid gap-3">
              {currentBranch.topics.map((topic) => (
                <Card
                  key={topic.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {topic.content.concept.slice(0, 80)}...
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Full Tree View */
          <div className="space-y-6">
            {/* Intro */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <CardContent className="p-6">
                <p className="text-lg font-medium text-center">{activeTreeData.intro}</p>
                <p className="text-center text-muted-foreground mt-2">
                  Click on any branch below to explore the topic tree.
                </p>
              </CardContent>
            </Card>

            {/* Tree Visualization */}
            <div className="flex justify-center">
              <div className="inline-block">
                {/* Root */}
                <div className="flex justify-center mb-4">
                  <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                    {activeTreeData.rootLabel}
                  </div>
                </div>
                
                {/* Connector line */}
                <div className="flex justify-center mb-4">
                  <div className="w-0.5 h-8 bg-primary/50"></div>
                </div>

                {/* Branches */}
                <div className="space-y-3">
                  {activeTreeData.branches.map((branch, index) => (
                    <div key={branch.id}>
                      <Card
                        className={cn(
                          "cursor-pointer transition-all border-2 hover:shadow-md",
                          branch.color,
                          expandedBranches.has(branch.id) && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedBranch(branch.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <GitBranch className="h-5 w-5" />
                              <div>
                                <h3 className="font-semibold">{branch.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {branch.topics.length} topics
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleBranch(branch.id)
                                }}
                              >
                                {expandedBranches.has(branch.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {/* Expanded topics preview */}
                          {expandedBranches.has(branch.id) && (
                            <div className="mt-4 pl-8 border-l-2 border-primary/30 space-y-2">
                              {branch.topics.map((topic) => (
                                <div
                                  key={topic.id}
                                  className="text-sm p-2 bg-background/50 rounded hover:bg-background cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedBranch(branch.id)
                                    setSelectedTopic(topic.id)
                                  }}
                                >
                                  {topic.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Connector between branches */}
                      {index < activeTreeData.branches.length - 1 && (
                        <div className="flex justify-center my-2">
                          <div className="w-0.5 h-4 bg-muted-foreground/30"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Regular lesson detail view
  if (selectedLesson !== null) {
    const lesson = regularLessons.find((l) => l.id === selectedLesson)
    if (!lesson) return null

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedLesson(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                lesson.level === "Beginner" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              )}>
                {lesson.level}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration}
              </span>
            </div>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderVerbContent(lesson.content as typeof verbTree.branches[0]["topics"][0]["content"])}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main lessons list
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">German Lessons</h2>
        <p className="text-muted-foreground">
          Master German step by step with structured lessons
        </p>
      </div>

      {/* Regular Lessons */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Foundation Lessons</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {regularLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedLesson(lesson.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        lesson.level === "Beginner" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {lesson.level}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </span>
                    </div>
                    <h4 className="font-medium mb-1">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Intermediate Lesson Trees */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Intermediate Lesson Trees</h3>
        <div className="space-y-4">
          {/* Featured: Verb Tree */}
          <Card 
            className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-primary/30 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openTree("verbs")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <GitBranch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">VERBS - The Complete Tree</h3>
                    <p className="text-muted-foreground">
                      Master all verb concepts: tenses, moods, passive voice, and more!
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        6 Levels
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <BookText className="h-4 w-4" />
                        20+ Topics
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Featured: Cases Tree */}
          <Card
            className="bg-gradient-to-r from-amber-100/70 via-amber-50 to-yellow-100/60 border-amber-300/60 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openTree("cases")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 text-white p-3 rounded-full">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-700">CASES - The Complete Tree</h3>
                    <p className="text-muted-foreground">
                      Nominativ, Akkusativ, Dativ, Genitiv and how they change words.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        {casesTree.branches.length} Levels
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <BookText className="h-4 w-4" />
                        {casesTopicCount} Topics
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        New
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Quick Navigation</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate("vocab")} className="gap-2">
              <BookText className="h-4 w-4" />
              Vocabulary
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("cards")} className="gap-2">
              <Layers className="h-4 w-4" />
              Flashcards
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("train")} className="gap-2">
              <Target className="h-4 w-4" />
              Practice
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("core")} className="gap-2">
              <BookText className="h-4 w-4" />
              Grammar Reference
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate("cheat")} className="gap-2">
              <Zap className="h-4 w-4" />
              Cheat Sheets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
