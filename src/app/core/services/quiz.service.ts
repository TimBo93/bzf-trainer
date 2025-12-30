import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuizAnswer, QuizMode, QuizSession, ShuffledQuestion } from '../models';
import { QuestionService } from './question.service';
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';

interface ActiveQuizState {
  session: QuizSession;
  currentIndex: number;
}

const ACTIVE_QUIZ_KEY = 'bzf-active-quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private _currentSession = signal<QuizSession | null>(null);
  private _currentQuestionIndex = signal<number>(0);
  private _currentShuffledQuestion = signal<ShuffledQuestion | null>(null);
  private _selectedAnswer = signal<string | null>(null);
  private _showFeedback = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _hasActiveQuiz = signal<boolean>(false);

  currentSession = this._currentSession.asReadonly();
  currentQuestionIndex = this._currentQuestionIndex.asReadonly();
  currentShuffledQuestion = this._currentShuffledQuestion.asReadonly();
  selectedAnswer = this._selectedAnswer.asReadonly();
  showFeedback = this._showFeedback.asReadonly();
  isLoading = this._isLoading.asReadonly();
  hasActiveQuiz = this._hasActiveQuiz.asReadonly();

  progress = computed(() => {
    const session = this._currentSession();
    if (!session) return 0;
    return ((this._currentQuestionIndex() + 1) / session.questionIds.length) * 100;
  });

  currentQuestionNumber = computed(() => this._currentQuestionIndex() + 1);

  totalQuestions = computed(() => {
    const session = this._currentSession();
    return session?.questionIds.length ?? 0;
  });

  isLastQuestion = computed(() => {
    const session = this._currentSession();
    if (!session) return false;
    return this._currentQuestionIndex() >= session.questionIds.length - 1;
  });

  correctCount = computed(() => {
    const session = this._currentSession();
    return session?.correctCount ?? 0;
  });

  wrongCount = computed(() => {
    const session = this._currentSession();
    return session?.wrongCount ?? 0;
  });

  constructor(
    private questionService: QuestionService,
    private storageService: StorageService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    // Check for active quiz on service initialization
    this.checkForActiveQuiz();
  }

  private checkForActiveQuiz(): void {
    const saved = localStorage.getItem(ACTIVE_QUIZ_KEY);
    this._hasActiveQuiz.set(saved !== null);
  }

  private saveActiveQuiz(): void {
    const session = this._currentSession();
    if (!session || session.completedAt) return;

    const state: ActiveQuizState = {
      session,
      currentIndex: this._currentQuestionIndex(),
    };

    localStorage.setItem(ACTIVE_QUIZ_KEY, JSON.stringify(state));
    this._hasActiveQuiz.set(true);
  }

  private clearActiveQuiz(): void {
    localStorage.removeItem(ACTIVE_QUIZ_KEY);
    this._hasActiveQuiz.set(false);
  }

  getActiveQuizInfo(): {
    mode: QuizMode;
    progress: number;
    total: number;
    categoryId?: string;
  } | null {
    const saved = localStorage.getItem(ACTIVE_QUIZ_KEY);
    if (!saved) return null;

    try {
      const state: ActiveQuizState = JSON.parse(saved);

      // Check if current question was already answered
      const currentQuestionId = state.session.questionIds[state.currentIndex];
      const alreadyAnswered = state.session.answers.some((a) => a.questionId === currentQuestionId);

      // Calculate actual progress (next unanswered question)
      let actualProgress = state.currentIndex + 1;
      if (alreadyAnswered && state.currentIndex < state.session.questionIds.length - 1) {
        actualProgress = state.currentIndex + 2;
      }

      return {
        mode: state.session.mode,
        progress: actualProgress,
        total: state.session.questionIds.length,
        categoryId: state.session.categoryId,
      };
    } catch {
      return null;
    }
  }

  async continueActiveQuiz(): Promise<boolean> {
    const saved = localStorage.getItem(ACTIVE_QUIZ_KEY);
    if (!saved) return false;

    try {
      this._isLoading.set(true);
      await this.questionService.loadData();
      await this.storageService.loadData();

      const state: ActiveQuizState = JSON.parse(saved);

      // Restore session state
      this._currentSession.set(state.session);

      // Check if the current question was already answered
      const currentQuestionId = state.session.questionIds[state.currentIndex];
      const alreadyAnswered = state.session.answers.some((a) => a.questionId === currentQuestionId);

      if (alreadyAnswered && state.currentIndex < state.session.questionIds.length - 1) {
        // Move to next unanswered question
        this._currentQuestionIndex.set(state.currentIndex + 1);
      } else {
        this._currentQuestionIndex.set(state.currentIndex);
      }

      this._selectedAnswer.set(null);
      this._showFeedback.set(false);

      // Load current question
      this.loadCurrentQuestion();

      // Save updated state
      this.saveActiveQuiz();

      this.router.navigate(['/quiz']);
      return true;
    } catch (error) {
      console.error('Error continuing quiz:', error);
      this.clearActiveQuiz();
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  abandonActiveQuiz(): void {
    this.clearActiveQuiz();
  }

  async startQuiz(mode: QuizMode, categoryId?: string, questionCount?: number): Promise<void> {
    this._isLoading.set(true);

    try {
      await this.questionService.loadData();
      await this.storageService.loadData();

      let questionIds: number[];

      switch (mode) {
        case 'all':
          questionIds = this.questionService.getAllQuestionIds();
          break;
        case 'random':
          questionIds = this.questionService.getRandomQuestionIds(questionCount ?? 20);
          break;
        case 'category':
          if (!categoryId) throw new Error('Category ID required for category mode');
          questionIds = this.questionService.getCategoryQuestionIds(categoryId);
          // Shuffle category questions
          questionIds = this.shuffleArray(questionIds);
          break;
        case 'weak':
          questionIds = this.storageService.getWeakQuestionIds();
          if (questionIds.length === 0) {
            // If no weak questions, get never answered
            questionIds = this.storageService.getNeverAnsweredIds(
              this.questionService.getAllQuestionIds()
            );
          }
          if (questionIds.length === 0) {
            // If still empty, get random
            questionIds = this.questionService.getRandomQuestionIds(20);
          }
          questionIds = this.shuffleArray(questionIds);
          break;
        case 'exam':
          questionIds = this.questionService.getRandomQuestionIds(questionCount ?? 100);
          break;
        default:
          questionIds = this.questionService.getAllQuestionIds();
      }

      if (questionIds.length === 0) {
        throw new Error('No questions available');
      }

      const session: QuizSession = {
        id: crypto.randomUUID(),
        mode,
        categoryId,
        startedAt: new Date(),
        questionIds,
        answers: [],
        correctCount: 0,
        wrongCount: 0,
      };

      this._currentSession.set(session);
      this._currentQuestionIndex.set(0);
      this._selectedAnswer.set(null);
      this._showFeedback.set(false);

      this.loadCurrentQuestion();
      this.saveActiveQuiz(); // Save initial quiz state
      this.router.navigate(['/quiz']);
    } finally {
      this._isLoading.set(false);
    }
  }

  private loadCurrentQuestion(): void {
    const session = this._currentSession();
    if (!session) return;

    const questionId = session.questionIds[this._currentQuestionIndex()];
    const question = this.questionService.getQuestionById(questionId);

    if (question) {
      const shuffled = this.questionService.shuffleAnswers(question);
      this._currentShuffledQuestion.set(shuffled);
    }
  }

  selectAnswer(answerLabel: string): void {
    if (this._showFeedback()) return; // Already answered
    this._selectedAnswer.set(answerLabel);
  }

  async submitAnswer(): Promise<void> {
    const session = this._currentSession();
    const shuffledQuestion = this._currentShuffledQuestion();
    const selectedAnswer = this._selectedAnswer();

    if (!session || !shuffledQuestion || !selectedAnswer) return;

    const selectedAnswerObj = shuffledQuestion.shuffledAnswers.find(
      (a) => a.label === selectedAnswer
    );
    const isCorrect = selectedAnswerObj?.isCorrect ?? false;

    const answer: QuizAnswer = {
      questionId: shuffledQuestion.original.number,
      selectedAnswer,
      isCorrect,
      answeredAt: new Date(),
    };

    // Update session
    const updatedSession: QuizSession = {
      ...session,
      answers: [...session.answers, answer],
      correctCount: session.correctCount + (isCorrect ? 1 : 0),
      wrongCount: session.wrongCount + (isCorrect ? 0 : 1),
    };

    this._currentSession.set(updatedSession);

    // Update progress in storage
    await this.storageService.updateProgress(shuffledQuestion.original.number, isCorrect);

    // Save quiz state after each answer
    this.saveActiveQuiz();

    // Show feedback if enabled
    if (this.settingsService.immediateFeedback()) {
      this._showFeedback.set(true);
    } else {
      // Auto-advance if feedback is disabled
      this.nextQuestion();
    }
  }

  nextQuestion(): void {
    const session = this._currentSession();
    if (!session) return;

    if (this._currentQuestionIndex() < session.questionIds.length - 1) {
      this._currentQuestionIndex.update((i) => i + 1);
      this._selectedAnswer.set(null);
      this._showFeedback.set(false);
      this.loadCurrentQuestion();
    } else {
      this.finishQuiz();
    }
  }

  async finishQuiz(): Promise<void> {
    const session = this._currentSession();
    if (!session) return;

    const completedSession: QuizSession = {
      ...session,
      completedAt: new Date(),
    };

    await this.storageService.saveSession(completedSession);
    this._currentSession.set(completedSession);

    // Clear active quiz since it's completed
    this.clearActiveQuiz();

    this.router.navigate(['/results', session.id]);
  }

  getSessionResults(): { session: QuizSession; percentage: number } | null {
    const session = this._currentSession();
    if (!session) return null;

    const total = session.answers.length;
    const percentage = total > 0 ? (session.correctCount / total) * 100 : 0;

    return { session, percentage };
  }

  async loadSession(sessionId: string): Promise<QuizSession | null> {
    const session = await this.storageService.getSession(sessionId);
    if (session) {
      this._currentSession.set(session);
    }
    return session ?? null;
  }

  resetQuiz(): void {
    this._currentSession.set(null);
    this._currentQuestionIndex.set(0);
    this._currentShuffledQuestion.set(null);
    this._selectedAnswer.set(null);
    this._showFeedback.set(false);
  }

  async startWeakQuestionsQuiz(): Promise<void> {
    await this.startQuiz('weak');
  }

  async startCategoryQuiz(categoryId: string): Promise<void> {
    await this.startQuiz('category', categoryId);
  }

  async startRandomQuiz(count: number = 20): Promise<void> {
    await this.startQuiz('random', undefined, count);
  }

  async startAllQuestionsQuiz(): Promise<void> {
    await this.startQuiz('all');
  }

  async startExamMode(questionCount: number = 100): Promise<void> {
    await this.startQuiz('exam', undefined, questionCount);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
