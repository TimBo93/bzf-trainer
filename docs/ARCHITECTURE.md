# BZF Trainer - Architektur

## Projektstruktur

```
bzf-trainer/
├── src/
│   ├── app/
│   │   ├── core/                     # Singleton Services & Core Logic
│   │   │   ├── services/
│   │   │   │   ├── question.service.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   ├── settings.service.ts
│   │   │   │   └── quiz.service.ts
│   │   │   ├── models/
│   │   │   │   ├── question.model.ts
│   │   │   │   ├── category.model.ts
│   │   │   │   ├── progress.model.ts
│   │   │   │   └── quiz-session.model.ts
│   │   │   └── db/
│   │   │       └── database.ts       # Dexie.js Database
│   │   │
│   │   ├── features/                 # Feature Modules (lazy-loaded)
│   │   │   ├── quiz/
│   │   │   │   ├── components/
│   │   │   │   │   ├── question-card/
│   │   │   │   │   ├── answer-button/
│   │   │   │   │   ├── quiz-progress/
│   │   │   │   │   └── feedback-overlay/
│   │   │   │   └── quiz.routes.ts
│   │   │   │
│   │   │   ├── statistics/
│   │   │   │   ├── components/
│   │   │   │   │   ├── progress-chart/
│   │   │   │   │   ├── category-progress/
│   │   │   │   │   └── streak-display/
│   │   │   │   └── statistics.routes.ts
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── components/
│   │   │       │   ├── theme-toggle/
│   │   │       │   └── data-management/
│   │   │       └── settings.routes.ts
│   │   │
│   │   ├── pages/                    # Page Components (Smart Components)
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.scss
│   │   │   ├── quiz/
│   │   │   │   ├── quiz.component.ts
│   │   │   │   ├── quiz.component.html
│   │   │   │   └── quiz.component.scss
│   │   │   ├── results/
│   │   │   │   ├── results.component.ts
│   │   │   │   ├── results.component.html
│   │   │   │   └── results.component.scss
│   │   │   ├── statistics/
│   │   │   │   ├── statistics.component.ts
│   │   │   │   ├── statistics.component.html
│   │   │   │   └── statistics.component.scss
│   │   │   └── settings/
│   │   │       ├── settings.component.ts
│   │   │       ├── settings.component.html
│   │   │       └── settings.component.scss
│   │   │
│   │   ├── shared/                   # Shared Components & Utilities
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── navigation/
│   │   │   │   └── loading-spinner/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── public/
│   │   ├── questions.json            # Prüfungsfragen BZF (Deutsch)
│   │   ├── questions-e.json          # Prüfungsfragen BZF‑E (Englisch)
│   │   └── categories.json           # Kategorie-Mapping (gemeinsam)
│   │
│   ├── styles/
│   │   ├── _variables.scss
│   │   └── _themes.scss
│   │
│   ├── styles.scss                   # Global Styles + Tailwind
│   └── index.html
│
├── docs/
│   ├── PLAN.md
│   ├── ARCHITECTURE.md
│   └── CATEGORIES.md
│
├── tailwind.config.js
├── angular.json
├── package.json
└── README.md
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│  │   Header    │  │  Navigation │  │      Router Outlet      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
                              ▼
│                        Pages (Smart)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │   Home   │ │   Quiz   │ │ Results  │ │  Stats   │ │Settings││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Core Services (Singleton)                    │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ QuizService   │  │QuestionService│  │  SettingsService  │   │
│  │               │  │               │  │                   │   │
│  │ - startQuiz() │  │ - getAll()    │  │ - theme           │   │
│  │ - answer()    │  │ - getByIds()  │  │ - immediateFB     │   │
│  │ - getNext()   │  │ - shuffle()   │  │ - save()          │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
│           │                │                    │               │
│           ▼                ▼                    ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   StorageService                         │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │              IndexedDB (Dexie.js)                │    │   │
│  │  │                                                  │    │   │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌───────┐ │    │   │
│  │  │  │questionProgress│ │ quizSessions │  │settings│ │    │   │
│  │  │  └──────────────┘  └──────────────┘  └───────┘ │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Static Assets                             │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────┐ │
│  │   questions.json   │  │  questions-e.json  │  │categories  │ │
│  │   (BZF, DE)        │  │  (BZF‑E, EN)       │  │ (Mapping)  │ │
│  └────────────────────┘  └────────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

Wir nutzen **Angular 20 Signals** für reaktives State Management:

```typescript
// quiz.service.ts
@Injectable({ providedIn: 'root' })
export class QuizService {
  // State als Signals
  private _currentSession = signal<QuizSession | null>(null);
  private _currentQuestionIndex = signal(0);
  private _isLoading = signal(false);

  // Computed Values
  currentQuestion = computed(() => {
    const session = this._currentSession();
    const index = this._currentQuestionIndex();
    if (!session) return null;
    return this.questionService.getById(session.questions[index]);
  });

  progress = computed(() => {
    const session = this._currentSession();
    if (!session) return 0;
    return (this._currentQuestionIndex() / session.questions.length) * 100;
  });

  // Public readonly signals
  currentSession = this._currentSession.asReadonly();
  isLoading = this._isLoading.asReadonly();
}
```

---

## Routing

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'quiz',
    loadComponent: () => import('./pages/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'quiz/:mode',
    loadComponent: () => import('./pages/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'results/:sessionId',
    loadComponent: () => import('./pages/results/results.component'),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./pages/statistics/statistics.component').then((m) => m.StatisticsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

---

## Datenbank Schema (Dexie.js)

```typescript
// core/db/database.ts

export interface QuestionProgress {
  questionId: number; // Primary Key
  correctCount: number;
  wrongCount: number;
  lastAnswered: Date;
  lastCorrect: boolean;
}

export interface QuizSession {
  id: string; // UUID
  mode: QuizMode;
  categoryId?: string;
  startedAt: Date;
  completedAt?: Date;
  questionIds: number[];
  answers: QuizAnswer[];
  correctCount: number;
  wrongCount: number;
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string; // 'A' | 'B' | 'C' | 'D'
  isCorrect: boolean;
  answeredAt: Date;
}

export interface Setting {
  key: string; // Primary Key
  value: any;
}

export class BZFDatabase extends Dexie {
  questionProgress!: Table<QuestionProgress, number>;
  quizSessions!: Table<QuizSession, string>;
  settings!: Table<Setting, string>;

  constructor() {
    super('bzf-trainer-db');

    this.version(1).stores({
      questionProgress: 'questionId, lastAnswered',
      quizSessions: 'id, mode, startedAt, completedAt',
      settings: 'key',
    });
  }
}

export const db = new BZFDatabase();
```

---

## Quiz-Modi

| Modus      | Beschreibung               | Parameter                             |
| ---------- | -------------------------- | ------------------------------------- |
| `all`      | Alle Fragen der Reihe nach | -                                     |
| `random`   | Zufällige Auswahl          | `count?: number`                      |
| `category` | Nur eine Kategorie         | `categoryId: string`                  |
| `weak`     | Falsch beantwortete Fragen | -                                     |
| `exam`     | Prüfungssimulation         | `count: number`, `timeLimit?: number` |

```typescript
export type QuizMode = 'all' | 'random' | 'category' | 'weak' | 'exam';

export interface QuizConfig {
  mode: QuizMode;
  categoryId?: string;
  questionCount?: number;
  timeLimitMinutes?: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean; // Always true
}
```

---

## Antwort-Shuffling Algorithmus

Da die richtige Antwort immer "A" ist, müssen wir beim Anzeigen die Antworten mischen und tracken, welche die richtige ist:

```typescript
interface ShuffledQuestion {
  original: Question;
  shuffledAnswers: {
    label: string; // 'A', 'B', 'C', 'D' (Anzeige)
    text: string; // Der Antworttext
    isCorrect: boolean; // true wenn original 'A'
  }[];
}

function shuffleAnswers(question: Question): ShuffledQuestion {
  const answers = [
    { text: question.A, isCorrect: true },
    { text: question.B, isCorrect: false },
    { text: question.C, isCorrect: false },
    { text: question.D, isCorrect: false },
  ];

  // Fisher-Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  return {
    original: question,
    shuffledAnswers: answers.map((a, i) => ({
      label: String.fromCharCode(65 + i), // A, B, C, D
      text: a.text,
      isCorrect: a.isCorrect,
    })),
  };
}
```
