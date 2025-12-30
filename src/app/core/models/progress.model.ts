export interface QuestionProgress {
  questionId: number;
  correctCount: number;
  wrongCount: number;
  lastAnswered: Date;
  lastCorrect: boolean;
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: Date;
}

export type QuizMode = 'all' | 'random' | 'category' | 'weak' | 'exam';

export interface QuizSession {
  id: string;
  mode: QuizMode;
  categoryId?: string;
  startedAt: Date;
  completedAt?: Date;
  questionIds: number[];
  answers: QuizAnswer[];
  correctCount: number;
  wrongCount: number;
}

export interface QuizConfig {
  mode: QuizMode;
  categoryId?: string;
  questionCount?: number;
  timeLimitMinutes?: number;
}

export interface UserSettings {
  key: string;
  value: unknown;
}
