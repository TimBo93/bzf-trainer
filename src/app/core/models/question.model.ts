export interface Question {
  number: number;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface ShuffledAnswer {
  label: string;      // 'A', 'B', 'C', 'D' (display label)
  text: string;       // The answer text
  isCorrect: boolean; // true if this was originally 'A'
  originalKey: string; // 'A', 'B', 'C', 'D' (original key)
}

export interface ShuffledQuestion {
  original: Question;
  shuffledAnswers: ShuffledAnswer[];
}
