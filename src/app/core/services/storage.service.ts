import { Injectable, signal, computed } from '@angular/core';
import { db } from '../db/database';
import { QuestionProgress, QuizSession, QuizAnswer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _progressMap = signal<Map<number, QuestionProgress>>(new Map());
  private _sessions = signal<QuizSession[]>([]);
  private _isLoaded = signal<boolean>(false);

  progressMap = this._progressMap.asReadonly();
  sessions = this._sessions.asReadonly();
  isLoaded = this._isLoaded.asReadonly();

  totalCorrect = computed(() => {
    let count = 0;
    this._progressMap().forEach(p => {
      if (p.correctCount > 0) count++;
    });
    return count;
  });

  totalAnswered = computed(() => this._progressMap().size);

  async loadData(): Promise<void> {
    if (this._isLoaded()) return;

    try {
      const [progress, sessions] = await Promise.all([
        db.questionProgress.toArray(),
        db.quizSessions.orderBy('startedAt').reverse().limit(50).toArray()
      ]);

      const progressMap = new Map<number, QuestionProgress>();
      progress.forEach(p => progressMap.set(p.questionId, p));

      this._progressMap.set(progressMap);
      this._sessions.set(sessions);
      this._isLoaded.set(true);
    } catch (error) {
      console.error('Error loading storage data:', error);
      throw error;
    }
  }

  getProgress(questionId: number): QuestionProgress | undefined {
    return this._progressMap().get(questionId);
  }

  async updateProgress(questionId: number, isCorrect: boolean): Promise<void> {
    const existing = this._progressMap().get(questionId);
    const now = new Date();

    const updated: QuestionProgress = {
      questionId,
      correctCount: (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0),
      wrongCount: (existing?.wrongCount ?? 0) + (isCorrect ? 0 : 1),
      lastAnswered: now,
      lastCorrect: isCorrect
    };

    await db.questionProgress.put(updated);

    const newMap = new Map(this._progressMap());
    newMap.set(questionId, updated);
    this._progressMap.set(newMap);
  }

  async saveSession(session: QuizSession): Promise<void> {
    await db.quizSessions.put(session);
    this._sessions.update(sessions => [session, ...sessions.slice(0, 49)]);
  }

  async getSession(id: string): Promise<QuizSession | undefined> {
    return db.quizSessions.get(id);
  }

  getWeakQuestionIds(minWrongCount: number = 1): number[] {
    const weak: number[] = [];
    this._progressMap().forEach((progress, questionId) => {
      if (progress.wrongCount >= minWrongCount && progress.wrongCount > progress.correctCount) {
        weak.push(questionId);
      }
    });
    return weak;
  }

  getNeverAnsweredIds(allQuestionIds: number[]): number[] {
    const answered = new Set(this._progressMap().keys());
    return allQuestionIds.filter(id => !answered.has(id));
  }

  getSuccessRate(): number {
    let totalCorrect = 0;
    let totalAttempts = 0;

    this._progressMap().forEach(p => {
      totalCorrect += p.correctCount;
      totalAttempts += p.correctCount + p.wrongCount;
    });

    return totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  }

  getProgressByCategory(questionMapping: Record<string, string>): Map<string, { total: number; correct: number; answered: number }> {
    const categoryProgress = new Map<string, { total: number; correct: number; answered: number }>();

    // Initialize categories
    Object.entries(questionMapping).forEach(([questionId, categoryId]) => {
      if (!categoryProgress.has(categoryId)) {
        categoryProgress.set(categoryId, { total: 0, correct: 0, answered: 0 });
      }
      const cat = categoryProgress.get(categoryId)!;
      cat.total++;

      const progress = this._progressMap().get(parseInt(questionId));
      if (progress) {
        cat.answered++;
        if (progress.lastCorrect || progress.correctCount > progress.wrongCount) {
          cat.correct++;
        }
      }
    });

    return categoryProgress;
  }

  async clearAllData(): Promise<void> {
    await db.questionProgress.clear();
    await db.quizSessions.clear();
    this._progressMap.set(new Map());
    this._sessions.set([]);
  }

  async resetAllData(): Promise<void> {
    await this.clearAllData();
    this._isLoaded.set(false);
  }

  getStreak(): number {
    const sessions = this._sessions();
    if (sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayInMs = 24 * 60 * 60 * 1000;
    let checkDate = new Date(today);

    // Group sessions by date
    const sessionsByDate = new Map<string, boolean>();
    sessions.forEach(session => {
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      sessionsByDate.set(sessionDate.toISOString(), true);
    });

    // Check consecutive days
    while (true) {
      const dateKey = checkDate.toISOString();
      if (sessionsByDate.has(dateKey)) {
        streak++;
        checkDate = new Date(checkDate.getTime() - dayInMs);
      } else {
        break;
      }
    }

    return streak;
  }
}
