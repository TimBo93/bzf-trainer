import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BookOpen,
  CheckCircle,
  Flame,
  LucideAngularModule,
  Play,
  RotateCcw,
  Shuffle,
  Target,
  Trophy,
  XCircle,
} from 'lucide-angular';
import { Category, QuizMode } from '../../core/models';
import { QuestionService, QuizService, StorageService } from '../../core/services';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe, LucideAngularModule, ConfirmDialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  questionService = inject(QuestionService);
  storageService = inject(StorageService);
  quizService = inject(QuizService);

  readonly Play = Play;
  readonly Shuffle = Shuffle;
  readonly Target = Target;
  readonly BookOpen = BookOpen;
  readonly Trophy = Trophy;
  readonly Flame = Flame;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly RotateCcw = RotateCcw;

  isLoading = signal(true);
  categories = signal<Category[]>([]);
  activeQuizInfo = signal<{
    mode: QuizMode;
    progress: number;
    total: number;
    categoryId?: string;
  } | null>(null);

  // Confirm dialog state
  showConfirmDialog = signal(false);
  pendingQuizAction = signal<(() => void) | null>(null);

  totalQuestions = computed(() => this.questionService.getTotalQuestionCount());
  answeredQuestions = computed(() => this.storageService.totalAnswered());
  correctQuestions = computed(() => this.storageService.totalCorrect());
  successRate = computed(() => this.storageService.getSuccessRate());
  streak = computed(() => this.storageService.getStreak());

  hasActiveQuiz = this.quizService.hasActiveQuiz;

  confirmDialogMessage = computed(() => {
    const info = this.activeQuizInfo();
    if (!info) return '';
    return `Du hast noch ein laufendes Quiz:\n\n${this.getActiveQuizModeName(info)} – Frage ${
      info.progress
    } von ${info.total}\n\nMöchtest du das aktuelle Quiz abbrechen und ein neues starten?`;
  });

  progressPercentage = computed(() => {
    const total = this.totalQuestions();
    const correct = this.correctQuestions();
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  async ngOnInit() {
    try {
      await Promise.all([this.questionService.loadData(), this.storageService.loadData()]);
      this.categories.set(this.questionService.categories());
      this.activeQuizInfo.set(this.quizService.getActiveQuizInfo());
    } finally {
      this.isLoading.set(false);
    }
  }

  continueQuiz() {
    this.quizService.continueActiveQuiz();
  }

  abandonQuiz() {
    this.quizService.abandonActiveQuiz();
    this.activeQuizInfo.set(null);
  }

  getModeName(mode: QuizMode): string {
    const modeNames: Record<QuizMode, string> = {
      all: 'Alle Fragen',
      random: 'Zufällige Fragen',
      category: 'Kategorie',
      weak: 'Schwachstellen',
      exam: 'Prüfungsmodus',
    };
    return modeNames[mode] || mode;
  }

  getActiveQuizModeName(info: { mode: QuizMode; categoryId?: string }): string {
    if (info.mode === 'category' && info.categoryId) {
      const category = this.categories().find((c) => c.id === info.categoryId);
      return category?.name ?? 'Kategorie';
    }
    return this.getModeName(info.mode);
  }

  private tryStartQuiz(action: () => void): void {
    if (!this.hasActiveQuiz()) {
      action();
      return;
    }

    const info = this.activeQuizInfo();
    if (!info) {
      action();
      return;
    }

    // Show confirm dialog
    this.pendingQuizAction.set(action);
    this.showConfirmDialog.set(true);
  }

  onConfirmNewQuiz() {
    this.quizService.abandonActiveQuiz();
    this.activeQuizInfo.set(null);
    this.showConfirmDialog.set(false);

    const action = this.pendingQuizAction();
    if (action) {
      action();
    }
    this.pendingQuizAction.set(null);
  }

  onCancelNewQuiz() {
    this.showConfirmDialog.set(false);
    this.pendingQuizAction.set(null);
  }

  startRandomQuiz() {
    this.tryStartQuiz(() => this.quizService.startRandomQuiz(20));
  }

  startAllQuestions() {
    this.tryStartQuiz(() => this.quizService.startAllQuestionsQuiz());
  }

  startWeakQuestions() {
    this.tryStartQuiz(() => this.quizService.startWeakQuestionsQuiz());
  }

  startCategoryQuiz(categoryId: string) {
    this.tryStartQuiz(() => this.quizService.startCategoryQuiz(categoryId));
  }

  getQuestionCountForCategory(categoryId: string): number {
    return this.questionService.getQuestionCountByCategory(categoryId);
  }

  getCategoryProgress(categoryId: string): number {
    const mapping = this.questionService.questionMapping();
    const categoryProgress = this.storageService.getProgressByCategory(mapping);
    const progress = categoryProgress.get(categoryId);
    if (!progress || progress.total === 0) return 0;
    return Math.round((progress.correct / progress.total) * 100);
  }
}
