import Dexie, { Table } from 'dexie';
import { QuestionProgress, QuizSession, UserSettings } from '../models';

export class BZFDatabase extends Dexie {
  questionProgress!: Table<QuestionProgress, number>;
  quizSessions!: Table<QuizSession, string>;
  settings!: Table<UserSettings, string>;

  constructor() {
    super('bzf-trainer-db');

    this.version(1).stores({
      questionProgress: 'questionId, lastAnswered',
      quizSessions: 'id, mode, startedAt, completedAt',
      settings: 'key'
    });
  }
}

export const db = new BZFDatabase();
