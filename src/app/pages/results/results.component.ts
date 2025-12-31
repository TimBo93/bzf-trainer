import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  CheckCircle,
  Home,
  LucideAngularModule,
  Percent,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-angular';
import { QuizSession } from '../../core/models';
import { QuestionService, QuizService } from '../../core/services';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, TranslateModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  quizService = inject(QuizService);
  questionService = inject(QuestionService);
  translateService = inject(TranslateService);

  readonly Home = Home;
  readonly RotateCcw = RotateCcw;
  readonly Trophy = Trophy;
  readonly Target = Target;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Percent = Percent;

  session = signal<QuizSession | null>(null);
  isLoading = signal(true);

  percentage = computed(() => {
    const s = this.session();
    if (!s || s.answers.length === 0) return 0;
    return Math.round((s.correctCount / s.answers.length) * 100);
  });

  resultMessage = computed(() => {
    const pct = this.percentage();
    if (pct === 100)
      return {
        text: this.translateService.instant('results.perfect'),
        emoji: '🏆',
        color: 'text-green-500',
      };
    if (pct >= 90)
      return {
        text: this.translateService.instant('results.excellent'),
        emoji: '🎉',
        color: 'text-green-500',
      };
    if (pct >= 75)
      return {
        text: this.translateService.instant('results.great'),
        emoji: '👏',
        color: 'text-green-500',
      };
    if (pct >= 60)
      return {
        text: this.translateService.instant('results.good'),
        emoji: '👍',
        color: 'text-blue-500',
      };
    return {
      text: this.translateService.instant('results.keepPracticing'),
      emoji: '💪',
      color: 'text-yellow-500',
    };
  });

  wrongAnswers = computed(() => {
    const s = this.session();
    if (!s) return [];
    return s.answers.filter((a) => !a.isCorrect);
  });

  async ngOnInit() {
    const sessionId = this.route.snapshot.params['sessionId'];

    try {
      // First try to get from current session
      let session = this.quizService.currentSession();

      // If not available, load from database
      if (!session || session.id !== sessionId) {
        session = await this.quizService.loadSession(sessionId);
      }

      if (session) {
        this.session.set(session);
      } else {
        this.router.navigate(['/']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  getQuestionText(questionId: number): string {
    const question = this.questionService.getQuestionById(questionId);
    return question?.question ?? '';
  }

  goHome() {
    this.quizService.resetQuiz();
    this.router.navigate(['/']);
  }

  retryWrongQuestions() {
    const wrong = this.wrongAnswers();
    if (wrong.length > 0) {
      // Start a new quiz with only wrong questions
      // This would require extending the quiz service
      // For now, redirect to weak questions mode
      this.quizService.startWeakQuestionsQuiz();
    }
  }

  startNewQuiz() {
    this.quizService.startRandomQuiz(20);
  }
}
