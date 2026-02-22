"use client"
/* ═══════════════════════════════════════════════════
   DeutschMeister — Interactive Lesson Content
   
   Each lesson contains:
   (a) goal            — what the learner will achieve
   (b) grammarFocus    — key grammar teach points + table
   (c) vocabulary      — curated high-utility word set
   (d) dialogue        — micro-dialogue in context
   (e) exercises       — 5-6 mixed types per lesson
   (f) reviewHint      — spacing suggestion
   ═══════════════════════════════════════════════════ */

export type ExerciseKind =
  | "multiple-choice"
  | "fill-blank"
  | "reorder"
  | "translation"
  | "match-pair"

export interface Exercise {
  kind: ExerciseKind
  prompt: string
  /** For multiple-choice / fill-blank */
  options?: string[]
  /** The single correct answer string */
  answer: string
  /** Shown after answering */
  explanation?: string
  /** For reorder: the words to arrange */
  words?: string[]
  /** For match-pair: pairs to match */
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

/* ── LESSON 1: Greetings & Introductions ── */
const greetingsIntro: LessonContent = {
  lessonId: "greetings-intro",
  goal: "Introduce yourself, greet people formally and informally, and ask basic questions about others.",
  grammarPoints: [
    {
      rule: "Use 'sein' (to be) and 'heiBen' (to be called) to introduce yourself. Verb always goes in position 2.",
      table: {
        headers: ["Person", "sein", "heiBen"],
        rows: [
          ["ich", "bin", "heiBe"],
          ["du", "bist", "heiBt"],
          ["er/sie", "ist", "heiBt"],
          ["Sie (formal)", "sind", "heiBen"],
        ],
      },
    },
    {
      rule: "Formal = Sie (capitalized), Informal = du. Use Sie with strangers and in professional settings.",
    },
  ],
  vocabulary: [
    { german: "Hallo", english: "Hello", example: "Hallo, ich bin Anna." },
    { german: "Guten Morgen", english: "Good morning" },
    { german: "Guten Tag", english: "Good day (formal hello)" },
    { german: "Guten Abend", english: "Good evening" },
    { german: "Tschuss", english: "Bye (informal)" },
    { german: "Auf Wiedersehen", english: "Goodbye (formal)" },
    { german: "Wie heiBen Sie?", english: "What is your name? (formal)" },
    { german: "Woher kommen Sie?", english: "Where are you from? (formal)" },
    { german: "Freut mich", english: "Nice to meet you" },
    { german: "Ich komme aus...", english: "I come from..." },
  ],
  dialogue: [
    { speaker: "Anna", german: "Guten Tag! Ich heiBe Anna. Und Sie?", english: "Good day! My name is Anna. And you?" },
    { speaker: "Herr Muller", german: "Guten Tag, ich bin Thomas Muller. Freut mich.", english: "Good day, I'm Thomas Muller. Nice to meet you." },
    { speaker: "Anna", german: "Freut mich auch! Woher kommen Sie?", english: "Nice to meet you too! Where are you from?" },
    { speaker: "Herr Muller", german: "Ich komme aus Munchen. Und Sie?", english: "I come from Munich. And you?" },
    { speaker: "Anna", german: "Ich komme aus Wien.", english: "I come from Vienna." },
  ],
  exercises: [
    {
      kind: "multiple-choice",
      prompt: "How do you say 'My name is Anna' in German?",
      options: ["Ich heiBe Anna.", "Ich habe Anna.", "Ich bin Anna heiBe.", "Ich Anna heiBe."],
      answer: "Ich heiBe Anna.",
      explanation: "'heiBen' means 'to be called'. The verb goes in position 2: Ich heiBe Anna.",
    },
    {
      kind: "fill-blank",
      prompt: "Complete: 'Guten Tag, ich ___ Thomas.'",
      options: ["bin", "bist", "ist", "sind"],
      answer: "bin",
      explanation: "'ich' always pairs with 'bin' (I am).",
    },
    {
      kind: "multiple-choice",
      prompt: "Which greeting is appropriate for a business meeting at 3 PM?",
      options: ["Guten Tag", "Guten Morgen", "Guten Abend", "Tschuss"],
      answer: "Guten Tag",
      explanation: "'Guten Tag' is used from late morning through afternoon. 'Guten Abend' starts around 6 PM.",
    },
    {
      kind: "reorder",
      prompt: "Put the words in correct order to say 'Where do you come from? (formal)'",
      words: ["kommen", "Woher", "Sie", "?"],
      answer: "Woher kommen Sie?",
      explanation: "Question word first, then verb in position 2, then subject.",
    },
    {
      kind: "translation",
      prompt: "Translate to German: 'Nice to meet you'",
      answer: "Freut mich",
      explanation: "Literally 'It pleases me'. A standard greeting response.",
    },
    {
      kind: "fill-blank",
      prompt: "For a formal goodbye, you say: 'Auf ___'",
      options: ["Wiedersehen", "Tschuss", "Morgen", "Hallo"],
      answer: "Wiedersehen",
      explanation: "'Auf Wiedersehen' = Until we see each other again. The formal goodbye.",
    },
  ],
  reviewHint: "Practice introducing yourself out loud 3 times. Review again tomorrow.",
}

/* ── LESSON 2: Numbers, Time & Dates ── */
const numbersTime: LessonContent = {
  lessonId: "numbers-time",
  goal: "Count from 0-100, tell time, and say days/months. Handle prices and appointments.",
  grammarPoints: [
    {
      rule: "German numbers are spoken 'backwards' after 20: einundzwanzig (one-and-twenty = 21).",
      table: {
        headers: ["Number", "German"],
        rows: [
          ["1-10", "eins, zwei, drei, vier, funf, sechs, sieben, acht, neun, zehn"],
          ["11-12", "elf, zwolf"],
          ["13-19", "dreizehn, vierzehn... (add -zehn)"],
          ["20,30...", "zwanzig, dreiBig, vierzig, funfzig..."],
          ["21,22...", "einundzwanzig, zweiundzwanzig..."],
        ],
      },
    },
    {
      rule: "Time: 'Es ist ... Uhr' for full hours. Use 'halb' (half TO the next hour, not past!).",
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
  vocabulary: [
    { german: "die Uhr", english: "clock / o'clock" },
    { german: "halb", english: "half (to the next hour!)" },
    { german: "Viertel nach", english: "quarter past" },
    { german: "Viertel vor", english: "quarter to" },
    { german: "Montag", english: "Monday" },
    { german: "Dienstag", english: "Tuesday" },
    { german: "Mittwoch", english: "Wednesday" },
    { german: "Januar", english: "January" },
    { german: "Wie viel kostet das?", english: "How much does that cost?" },
    { german: "der Termin", english: "the appointment" },
  ],
  dialogue: [
    { speaker: "Kunde", german: "Entschuldigung, wie viel kostet das?", english: "Excuse me, how much does that cost?" },
    { speaker: "Verkaufer", german: "Das kostet funf Euro funfzig.", english: "That costs five euros fifty." },
    { speaker: "Kunde", german: "Und wann schlieBen Sie?", english: "And when do you close?" },
    { speaker: "Verkaufer", german: "Um halb sieben.", english: "At half past six (half TO seven)." },
  ],
  exercises: [
    {
      kind: "multiple-choice",
      prompt: "What number is 'dreiundzwanzig'?",
      options: ["23", "32", "13", "33"],
      answer: "23",
      explanation: "'drei-und-zwanzig' = three-and-twenty = 23. Remember: units before tens!",
    },
    {
      kind: "fill-blank",
      prompt: "'Halb vier' in German means ___",
      options: ["3:30", "4:30", "3:15", "4:00"],
      answer: "3:30",
      explanation: "'Halb vier' means half TO four = 3:30. This trips up most learners!",
    },
    {
      kind: "multiple-choice",
      prompt: "How do you say 15:45 in conversational German?",
      options: ["Viertel vor vier", "Viertel nach vier", "halb vier", "vier Uhr"],
      answer: "Viertel vor vier",
      explanation: "15:45 = quarter to four = Viertel vor vier.",
    },
    {
      kind: "translation",
      prompt: "Translate: 'How much does that cost?'",
      answer: "Wie viel kostet das?",
      explanation: "Wie viel = how much, kostet = costs, das = that.",
    },
    {
      kind: "reorder",
      prompt: "Order the days correctly: Which comes after Dienstag?",
      words: ["Mittwoch", "Montag", "Freitag", "Donnerstag"],
      answer: "Mittwoch",
      explanation: "Montag, Dienstag, Mittwoch, Donnerstag, Freitag...",
    },
  ],
  reviewHint: "Practice counting backwards from 30. Say today's date and time in German.",
}

/* ── LESSON 3: Personal Pronouns ── */
const personalPronouns: LessonContent = {
  lessonId: "personal-pronouns",
  goal: "Use all personal pronouns correctly and understand the Sie/du distinction in real situations.",
  grammarPoints: [
    {
      rule: "German has 7 personal pronoun forms. 'Sie' (capitalized) = formal you. 'sie' (lowercase) = she/they.",
      table: {
        headers: ["Pronoun", "English", "Usage"],
        rows: [
          ["ich", "I", "yourself"],
          ["du", "you (informal)", "friends, family, children"],
          ["er / sie / es", "he / she / it", "third person singular"],
          ["wir", "we", "your group"],
          ["ihr", "you all (informal)", "group of friends"],
          ["sie", "they", "third person plural"],
          ["Sie", "you (formal)", "strangers, professional, respect"],
        ],
      },
    },
  ],
  vocabulary: [
    { german: "du", english: "you (informal)", example: "Du bist mein Freund." },
    { german: "Sie", english: "you (formal)", example: "Sind Sie Herr Muller?" },
    { german: "wir", english: "we", example: "Wir lernen Deutsch." },
    { german: "ihr", english: "you all", example: "Ihr seid nett." },
    { german: "er/sie/es", english: "he/she/it", example: "Er ist Student." },
  ],
  dialogue: [
    { speaker: "Student", german: "Hallo! Bist du auch im Deutschkurs?", english: "Hi! Are you also in the German course?" },
    { speaker: "Lisa", german: "Ja! Ich bin Lisa. Und du?", english: "Yes! I'm Lisa. And you?" },
    { speaker: "Student", german: "Ich bin Max. Woher kommst du?", english: "I'm Max. Where are you from?" },
    { speaker: "Lisa", german: "Ich komme aus Spanien. Wir konnen zusammen uben!", english: "I come from Spain. We can practice together!" },
  ],
  exercises: [
    {
      kind: "multiple-choice",
      prompt: "Your boss asks 'How are you?' Which pronoun did they likely use?",
      options: ["Sie (formal)", "du (informal)", "ihr (plural)", "er (he)"],
      answer: "Sie (formal)",
      explanation: "In the workplace, especially with your boss, use 'Sie' until they offer 'du'.",
    },
    {
      kind: "fill-blank",
      prompt: "'___ lernen Deutsch.' (We learn German.)",
      options: ["Wir", "Sie", "Ihr", "Du"],
      answer: "Wir",
      explanation: "'Wir' = we. 'Wir lernen' = we learn.",
    },
    {
      kind: "multiple-choice",
      prompt: "'sie ist nett' vs 'Sie sind nett' - what's the difference?",
      options: [
        "'sie ist' = she is, 'Sie sind' = you are (formal)",
        "Both mean 'she is nice'",
        "'sie ist' = they are, 'Sie sind' = she is",
        "No difference"
      ],
      answer: "'sie ist' = she is, 'Sie sind' = you are (formal)",
      explanation: "Lowercase 'sie' + ist = she is. Capitalized 'Sie' + sind = you are (formal).",
    },
    {
      kind: "fill-blank",
      prompt: "Talking to a group of friends: '___ seid toll!' (You all are great!)",
      options: ["Ihr", "Sie", "Wir", "Du"],
      answer: "Ihr",
      explanation: "'Ihr' = you all (informal plural). Used when addressing a group of people you're close with.",
    },
    {
      kind: "reorder",
      prompt: "Arrange: 'She comes from Berlin'",
      words: ["Sie", "kommt", "aus", "Berlin", "."],
      answer: "Sie kommt aus Berlin.",
      explanation: "Subject (Sie) + verb position 2 (kommt) + rest (aus Berlin).",
    },
  ],
  reviewHint: "Write 5 sentences using different pronouns. Read your dialogue aloud with a friend.",
}

/* ── LESSON 4: Articles & Gender ── */
const articlesGender: LessonContent = {
  lessonId: "articles-gender",
  goal: "Identify noun genders using patterns and use der/die/das correctly with common nouns.",
  grammarPoints: [
    {
      rule: "Every German noun has a gender: masculine (der), feminine (die), or neuter (das). Always learn the article WITH the noun!",
      table: {
        headers: ["Gender", "Article", "Patterns / Hints"],
        rows: [
          ["Masculine (der)", "der", "Male people, days, months, seasons, -er/-ling endings"],
          ["Feminine (die)", "die", "Female people, -ung/-heit/-keit/-tion/-ie endings"],
          ["Neuter (das)", "das", "Ge- prefix, -chen/-lein (diminutive), -um/-ment"],
          ["Plural (die)", "die", "All plurals use 'die' regardless of singular gender"],
        ],
      },
    },
    {
      rule: "ein/eine/ein = a/an. kein/keine/kein = not a / no.",
    },
  ],
  vocabulary: [
    { german: "der Mann", english: "the man" },
    { german: "die Frau", english: "the woman" },
    { german: "das Kind", english: "the child" },
    { german: "der Tisch", english: "the table" },
    { german: "die Zeitung", english: "the newspaper (-ung = feminine!)" },
    { german: "das Madchen", english: "the girl (-chen = always neuter!)" },
    { german: "die Freiheit", english: "freedom (-heit = feminine)" },
    { german: "der Computer", english: "the computer (-er ending = often masc)" },
  ],
  dialogue: [
    { speaker: "Anna", german: "Ist das ein Tisch oder ein Stuhl?", english: "Is that a table or a chair?" },
    { speaker: "Lehrer", german: "Das ist ein Tisch. Der Tisch ist braun.", english: "That is a table. The table is brown." },
    { speaker: "Anna", german: "Und die Zeitung? Ist die neu?", english: "And the newspaper? Is it new?" },
    { speaker: "Lehrer", german: "Ja, die Zeitung ist von heute.", english: "Yes, the newspaper is from today." },
  ],
  exercises: [
    {
      kind: "multiple-choice",
      prompt: "What article does 'Zeitung' (newspaper) take?",
      options: ["die", "der", "das", "ein"],
      answer: "die",
      explanation: "Words ending in -ung are ALWAYS feminine = die Zeitung.",
    },
    {
      kind: "fill-blank",
      prompt: "'___ Madchen spielt im Garten.' (The girl plays in the garden.)",
      options: ["Das", "Die", "Der", "Ein"],
      answer: "Das",
      explanation: "'Madchen' ends in -chen (diminutive) = always neuter = das Madchen.",
    },
    {
      kind: "multiple-choice",
      prompt: "Which ending ALWAYS signals feminine?",
      options: ["-ung", "-er", "-chen", "-um"],
      answer: "-ung",
      explanation: "-ung endings are always feminine: die Zeitung, die Ubung, die Wohnung.",
    },
    {
      kind: "fill-blank",
      prompt: "Ich habe ___ Bruder. (I have a brother.)",
      options: ["einen", "eine", "ein", "einer"],
      answer: "einen",
      explanation: "'Bruder' is masculine. As a direct object (accusative), 'ein' becomes 'einen'.",
    },
    {
      kind: "reorder",
      prompt: "Arrange: 'The woman reads a newspaper.'",
      words: ["Die", "Frau", "liest", "eine", "Zeitung", "."],
      answer: "Die Frau liest eine Zeitung.",
      explanation: "Subject (Die Frau) + verb in position 2 (liest) + object (eine Zeitung).",
    },
  ],
  reviewHint: "Walk around your room and say the German article for 10 objects. Check them later!",
}

/* ── LESSON 5: Present Tense Verbs ── */
const presentTense: LessonContent = {
  lessonId: "present-tense",
  goal: "Conjugate regular and key irregular verbs in present tense and build simple sentences.",
  grammarPoints: [
    {
      rule: "Regular conjugation: remove -en from infinitive, add endings: -e, -st, -t, -en, -t, -en.",
      table: {
        headers: ["Person", "machen (do)", "arbeiten (work)", "fahren (drive)"],
        rows: [
          ["ich", "mache", "arbeite", "fahre"],
          ["du", "machst", "arbeitest", "fahrst"],
          ["er/sie/es", "macht", "arbeitet", "fahrt"],
          ["wir", "machen", "arbeiten", "fahren"],
          ["ihr", "macht", "arbeitet", "fahrt"],
          ["sie/Sie", "machen", "arbeiten", "fahren"],
        ],
      },
    },
    {
      rule: "Irregular verbs change their vowel in du and er/sie/es forms only: fahren -> du fahrst, lesen -> du liest.",
    },
  ],
  vocabulary: [
    { german: "machen", english: "to do/make", example: "Ich mache meine Hausaufgaben." },
    { german: "arbeiten", english: "to work", example: "Er arbeitet im Buro." },
    { german: "gehen", english: "to go", example: "Wir gehen ins Kino." },
    { german: "sprechen", english: "to speak", example: "Sie spricht Deutsch." },
    { german: "lesen", english: "to read", example: "Du liest ein Buch." },
    { german: "schreiben", english: "to write", example: "Ich schreibe eine E-Mail." },
  ],
  dialogue: [
    { speaker: "Max", german: "Was machst du heute?", english: "What are you doing today?" },
    { speaker: "Lisa", german: "Ich arbeite bis funf und dann gehe ich einkaufen.", english: "I work until five and then I go shopping." },
    { speaker: "Max", german: "Sprichst du auch Englisch?", english: "Do you also speak English?" },
    { speaker: "Lisa", german: "Ja, ich spreche Englisch und Spanisch.", english: "Yes, I speak English and Spanish." },
  ],
  exercises: [
    {
      kind: "fill-blank",
      prompt: "Er ___ ein Buch. (He reads a book.) - lesen",
      options: ["liest", "lest", "lesen", "lese"],
      answer: "liest",
      explanation: "'lesen' is irregular. du liest, er/sie liest (e -> ie change).",
    },
    {
      kind: "multiple-choice",
      prompt: "Which conjugation is correct for 'du + fahren'?",
      options: ["du fahrst", "du fahrest", "du fahrst", "du fehrst"],
      answer: "du fahrst",
      explanation: "'fahren' has a vowel change a->a in du form: du fahrst.",
    },
    {
      kind: "fill-blank",
      prompt: "Wir ___ Deutsch. (We learn German.)",
      options: ["lernen", "lernst", "lernt", "lerne"],
      answer: "lernen",
      explanation: "'wir' always takes the same ending as the infinitive: wir lernen.",
    },
    {
      kind: "reorder",
      prompt: "Arrange: 'She speaks German and English.'",
      words: ["Sie", "spricht", "Deutsch", "und", "Englisch", "."],
      answer: "Sie spricht Deutsch und Englisch.",
      explanation: "'sprechen' with er/sie/es becomes 'spricht' (e -> i vowel change).",
    },
    {
      kind: "translation",
      prompt: "Translate: 'I am writing an email.'",
      answer: "Ich schreibe eine E-Mail.",
      explanation: "'schreiben' is regular: ich schreibe. 'E-Mail' is feminine: eine E-Mail.",
    },
  ],
  reviewHint: "Conjugate 3 regular and 2 irregular verbs from memory. Use each in a sentence.",
}

/* ── LESSON 6: Everyday Survival Phrases ── */
const everydayPhrases: LessonContent = {
  lessonId: "everyday-phrases",
  goal: "Handle essential daily situations: asking for help, being polite, shopping, and basic interactions.",
  grammarPoints: [
    {
      rule: "Polite requests use 'Konnte ich...?' or 'Ich hatte gern...' (I would like). Add 'bitte' for extra politeness.",
    },
    {
      rule: "Key survival pattern: Ich mochte / Ich hatte gern + noun = I would like + thing.",
    },
  ],
  vocabulary: [
    { german: "Entschuldigung", english: "Excuse me / Sorry" },
    { german: "bitte", english: "please / you're welcome" },
    { german: "danke", english: "thank you" },
    { german: "Ich hatte gern...", english: "I would like..." },
    { german: "Wie viel kostet das?", english: "How much does that cost?" },
    { german: "Wo ist...?", english: "Where is...?" },
    { german: "Ich verstehe nicht", english: "I don't understand" },
    { german: "Konnen Sie das wiederholen?", english: "Can you repeat that?" },
    { german: "Sprechen Sie Englisch?", english: "Do you speak English?" },
    { german: "Die Rechnung, bitte", english: "The bill, please" },
  ],
  dialogue: [
    { speaker: "Tourist", german: "Entschuldigung, wo ist der Bahnhof?", english: "Excuse me, where is the train station?" },
    { speaker: "Passant", german: "Gehen Sie geradeaus und dann links.", english: "Go straight ahead and then left." },
    { speaker: "Tourist", german: "Danke! Und wie viel kostet ein Ticket?", english: "Thanks! And how much does a ticket cost?" },
    { speaker: "Passant", german: "Das weiss ich nicht, fragen Sie am Schalter.", english: "I don't know, ask at the counter." },
  ],
  exercises: [
    {
      kind: "multiple-choice",
      prompt: "You're at a bakery and want to order. What do you say?",
      options: [
        "Ich hatte gern ein Brotchen, bitte.",
        "Gib mir Brot!",
        "Ich will das Brot.",
        "Brot, schnell!"
      ],
      answer: "Ich hatte gern ein Brotchen, bitte.",
      explanation: "'Ich hatte gern' + bitte is the polite way to order in German.",
    },
    {
      kind: "fill-blank",
      prompt: "You don't understand something. You say: 'Ich ___ nicht.'",
      options: ["verstehe", "verstehst", "versteht", "verstehen"],
      answer: "verstehe",
      explanation: "'ich' + verstehen = ich verstehe. A crucial survival phrase!",
    },
    {
      kind: "translation",
      prompt: "Translate: 'Do you speak English?'",
      answer: "Sprechen Sie Englisch?",
      explanation: "Formal 'you' (Sie) + sprechen = Sprechen Sie. Always capitalize Sie!",
    },
    {
      kind: "reorder",
      prompt: "Arrange: 'Excuse me, where is the train station?'",
      words: ["Entschuldigung", ",", "wo", "ist", "der", "Bahnhof", "?"],
      answer: "Entschuldigung, wo ist der Bahnhof?",
      explanation: "Question word (wo) + verb position 2 (ist) + subject (der Bahnhof).",
    },
    {
      kind: "multiple-choice",
      prompt: "At a restaurant, how do you ask for the bill?",
      options: ["Die Rechnung, bitte.", "Geld, bitte!", "Zahlen, danke.", "Ich mochte gehen."],
      answer: "Die Rechnung, bitte.",
      explanation: "'Die Rechnung, bitte' is the standard way to ask for the bill at a restaurant.",
    },
  ],
  reviewHint: "Roleplay a shopping scenario out loud. Practice these phrases until they feel automatic.",
}

/* ── LESSON 7: Negation: nicht & kein ── */
const negation: LessonContent = {
  lessonId: "negation",
  goal: "Negate sentences correctly using 'nicht' and 'kein' and understand when to use which.",
  grammarPoints: [
    {
      rule: "'kein' negates nouns with ein/eine or no article. 'nicht' negates everything else (verbs, adjectives, adverbs).",
      table: {
        headers: ["Type", "Positive", "Negative"],
        rows: [
          ["Noun (ein)", "Ich habe ein Auto.", "Ich habe kein Auto."],
          ["Noun (no article)", "Ich trinke Kaffee.", "Ich trinke keinen Kaffee."],
          ["Verb/Adj", "Das ist gut.", "Das ist nicht gut."],
          ["Verb/Adj", "Ich komme.", "Ich komme nicht."],
        ],
      },
    },
    {
      rule: "'nicht' usually goes at the end, or before what it specifically negates. 'kein' takes the same endings as 'ein'.",
    },
  ],
  vocabulary: [
    { german: "nicht", english: "not" },
    { german: "kein/keine/keinen", english: "no / not a" },
    { german: "nie / niemals", english: "never" },
    { german: "nichts", english: "nothing" },
    { german: "niemand", english: "nobody" },
  ],
  dialogue: [
    { speaker: "Max", german: "Hast du ein Auto?", english: "Do you have a car?" },
    { speaker: "Lisa", german: "Nein, ich habe kein Auto. Ich fahre mit dem Bus.", english: "No, I don't have a car. I take the bus." },
    { speaker: "Max", german: "Ist das nicht teuer?", english: "Isn't that expensive?" },
    { speaker: "Lisa", german: "Nein, das ist nicht teuer. Nur 60 Euro im Monat.", english: "No, it's not expensive. Only 60 euros a month." },
  ],
  exercises: [
    {
      kind: "multiple-choice",
      prompt: "'Ich habe ___ Bruder.' (I have no brother.) Which negation?",
      options: ["keinen", "nicht", "kein", "nein"],
      answer: "keinen",
      explanation: "Negating a noun with 'ein' -> use 'kein'. Bruder is masc accusative -> keinen.",
    },
    {
      kind: "fill-blank",
      prompt: "'Das Wetter ist ___ gut.' (The weather is not good.)",
      options: ["nicht", "kein", "keinen", "nein"],
      answer: "nicht",
      explanation: "'nicht' negates adjectives. 'kein' only negates nouns.",
    },
    {
      kind: "multiple-choice",
      prompt: "Which is correct: 'Ich trinke ___ Kaffee'?",
      options: ["keinen", "nicht", "kein", "keine"],
      answer: "keinen",
      explanation: "Kaffee is masculine, and as direct object (accusative) with no article -> keinen Kaffee.",
    },
    {
      kind: "reorder",
      prompt: "Arrange: 'I am not coming today.'",
      words: ["Ich", "komme", "heute", "nicht", "."],
      answer: "Ich komme heute nicht.",
      explanation: "'nicht' goes at the end when negating the whole statement.",
    },
    {
      kind: "fill-blank",
      prompt: "'Er hat ___ Zeit.' (He has no time.)",
      options: ["keine", "nicht", "kein", "keinen"],
      answer: "keine",
      explanation: "'Zeit' is feminine -> keine Zeit. Negating a noun without article = kein.",
    },
  ],
  reviewHint: "Convert 5 positive sentences to negative. Alternate between nicht and kein.",
}

/* ── LESSON 8: Question Words (W-Fragen) ── */
const questionWords: LessonContent = {
  lessonId: "question-words",
  goal: "Ask all major question types in German and understand V2 word order with question words.",
  grammarPoints: [
    {
      rule: "W-questions: Question word in position 1, verb in position 2, subject in position 3.",
      table: {
        headers: ["W-Word", "English", "Example"],
        rows: [
          ["Wer", "Who", "Wer ist das?"],
          ["Was", "What", "Was machst du?"],
          ["Wo", "Where (location)", "Wo wohnst du?"],
          ["Wohin", "Where to", "Wohin gehst du?"],
          ["Woher", "Where from", "Woher kommst du?"],
          ["Wann", "When", "Wann kommst du?"],
          ["Warum", "Why", "Warum lernst du Deutsch?"],
          ["Wie", "How", "Wie geht es Ihnen?"],
          ["Wie viel", "How much", "Wie viel kostet das?"],
        ],
      },
    },
    {
      rule: "Yes/No questions: Verb in position 1, subject in position 2. 'Kommst du morgen?'",
    },
  ],
  vocabulary: [
    { german: "Wer", english: "Who" },
    { german: "Was", english: "What" },
    { german: "Wo", english: "Where" },
    { german: "Wann", english: "When" },
    { german: "Warum", english: "Why" },
    { german: "Wie", english: "How" },
    { german: "Welcher/Welche/Welches", english: "Which" },
  ],
  dialogue: [
    { speaker: "Lehrer", german: "Wer hat eine Frage?", english: "Who has a question?" },
    { speaker: "Student", german: "Wann ist die Prufung?", english: "When is the exam?" },
    { speaker: "Lehrer", german: "Am Freitag. Und wo schreiben wir?", english: "On Friday. And where do we write it?" },
    { speaker: "Student", german: "Warum nicht am Montag?", english: "Why not on Monday?" },
    { speaker: "Lehrer", german: "Weil Montag ein Feiertag ist.", english: "Because Monday is a holiday." },
  ],
  exercises: [
    {
      kind: "fill-blank",
      prompt: "'___ wohnst du?' (Where do you live?)",
      options: ["Wo", "Was", "Wer", "Wann"],
      answer: "Wo",
      explanation: "'Wo' = where (location). Wo wohnst du? = Where do you live?",
    },
    {
      kind: "multiple-choice",
      prompt: "What's the difference between 'Wo' and 'Wohin'?",
      options: [
        "Wo = location (static), Wohin = direction (movement)",
        "Wo = direction, Wohin = location",
        "No difference, interchangeable",
        "Wo = formal, Wohin = informal"
      ],
      answer: "Wo = location (static), Wohin = direction (movement)",
      explanation: "Wo bist du? (Where ARE you?) vs. Wohin gehst du? (Where are you GOING?)",
    },
    {
      kind: "reorder",
      prompt: "Arrange a yes/no question: 'Are you coming tomorrow?'",
      words: ["Kommst", "du", "morgen", "?"],
      answer: "Kommst du morgen?",
      explanation: "Yes/No question = verb FIRST, then subject. No question word needed.",
    },
    {
      kind: "fill-blank",
      prompt: "'___ lernst du Deutsch?' (Why do you learn German?)",
      options: ["Warum", "Wann", "Wo", "Wie"],
      answer: "Warum",
      explanation: "'Warum' = why. Warum + verb in position 2 + subject.",
    },
    {
      kind: "translation",
      prompt: "Translate: 'How are you? (formal)'",
      answer: "Wie geht es Ihnen?",
      explanation: "Literally: 'How goes it to you?' Ihnen = formal dative of Sie.",
    },
  ],
  reviewHint: "Write one question with each W-word about your daily life. Practice asking a partner.",
}

/* ── Export map ── */
export const lessonContentMap: Record<string, LessonContent> = {
  "greetings-intro": greetingsIntro,
  "numbers-time": numbersTime,
  "personal-pronouns": personalPronouns,
  "articles-gender": articlesGender,
  "present-tense": presentTense,
  "everyday-phrases": everydayPhrases,
  "negation": negation,
  "question-words": questionWords,
}

export function getLessonContent(lessonId: string): LessonContent | null {
  return lessonContentMap[lessonId] ?? null
}

/* ── Flatten all exercises for the practice tab ── */
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

export function getAllPracticeExercises(): PracticeExercise[] {
  const result: PracticeExercise[] = []
  for (const content of Object.values(lessonContentMap)) {
    content.exercises.forEach((ex, i) => {
      result.push({
        id: `${content.lessonId}-ex-${i}`,
        lessonId: content.lessonId,
        lessonTitle: content.goal.split(",")[0].split(".")[0],
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

/** Short lesson names for the filter dropdown */
const LESSON_TITLES: Record<string, string> = {
  "greetings-intro":    "Greetings",
  "numbers-time":       "Numbers & Time",
  "personal-pronouns":  "Pronouns",
  "articles-gender":    "Articles & Gender",
  "present-tense":      "Present Tense",
  "everyday-phrases":   "Survival Phrases",
  "negation":           "Negation",
  "w-questions":        "W-Questions",
}

export function getLessonNames(): { id: string; title: string }[] {
  return Object.values(lessonContentMap).map(c => ({
    id: c.lessonId,
    title: LESSON_TITLES[c.lessonId] ?? c.lessonId,
  }))
}
