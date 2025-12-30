import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Home, RotateCcw, Trophy, Target, CheckCircle, XCircle, Percent } from 'lucide-angular';
import { QuizService, QuestionService } from '../../core/services';
import { QuizSession } from '../../core/models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  quizService = inject(QuizService);
  questionService = inject(QuestionService);

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
    if (pct >= 90) return { text: 'Ausgezeichnet!', emoji: '🎉', color: 'text-green-500' };
    if (pct >= 75) return { text: 'Sehr gut!', emoji: '👏', color: 'text-green-500' };
    if (pct >= 60) return { text: 'Gut gemacht!', emoji: '👍', color: 'text-blue-500' };
    if (pct >= 50) return { text: 'Weiter üben!', emoji: '💪', color: 'text-yellow-500' };
    return { text: 'Mehr Übung nötig', emoji: '📚', color: 'text-orange-500' };
  });

  wrongAnswers = computed(() => {
    const s = this.session();
    if (!s) return [];
    return s.answers.filter(a => !a.isCorrect);
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
