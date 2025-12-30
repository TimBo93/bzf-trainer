import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Home,
  LucideAngularModule,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-angular';
import { QuestionService, QuizService } from '../../core/services';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent implements OnInit {
  quizService = inject(QuizService);
  questionService = inject(QuestionService);
  router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly X = X;
  readonly RotateCcw = RotateCcw;
  readonly Home = Home;

  isLoading = signal(false);
  hasActiveQuiz = this.quizService.hasActiveQuiz;

  currentQuestion = this.quizService.currentShuffledQuestion;
  selectedAnswer = this.quizService.selectedAnswer;
  showFeedback = this.quizService.showFeedback;
  progress = this.quizService.progress;
  currentNumber = this.quizService.currentQuestionNumber;
  totalQuestions = this.quizService.totalQuestions;
  isLastQuestion = this.quizService.isLastQuestion;
  correctCount = this.quizService.correctCount;
  wrongCount = this.quizService.wrongCount;

  category = computed(() => {
    const question = this.currentQuestion();
    if (!question) return null;
    return this.questionService.getCategoryForQuestion(question.original.number);
  });

  hasSession = computed(() => this.quizService.currentSession() !== null);

  async ngOnInit() {
    // Wenn kein aktives Quiz im Service, aber eins gespeichert ist,
    // automatisch laden
    if (!this.hasSession() && this.hasActiveQuiz()) {
      this.isLoading.set(true);
      await this.quizService.continueActiveQuiz();
      this.isLoading.set(false);
    }
  }

  async continueQuiz() {
    this.isLoading.set(true);
    await this.quizService.continueActiveQuiz();
    this.isLoading.set(false);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  selectAnswer(label: string) {
    // Direkt Antwort auswählen und prüfen
    this.quizService.selectAnswer(label);
    this.quizService.submitAnswer();
  }

  submitAnswer() {
    this.quizService.submitAnswer();
  }

  nextQuestion() {
    this.quizService.nextQuestion();
  }

  finishQuiz() {
    this.quizService.finishQuiz();
  }

  exitQuiz() {
    this.quizService.resetQuiz();
    this.router.navigate(['/']);
  }

  isAnswerCorrect(label: string): boolean {
    const question = this.currentQuestion();
    if (!question) return false;
    const answer = question.shuffledAnswers.find((a) => a.label === label);
    return answer?.isCorrect ?? false;
  }

  getCorrectAnswerText(): string {
    const question = this.currentQuestion();
    if (!question) return '';
    const correctAnswer = question.shuffledAnswers.find((a) => a.isCorrect);
    return correctAnswer?.text ?? '';
  }

  getAnswerClass(label: string): string {
    const selected = this.selectedAnswer();
    const feedback = this.showFeedback();
    const isCorrect = this.isAnswerCorrect(label);
    const isSelected = selected === label;

    let classes = 'w-full p-4 rounded-xl border-2 text-left transition-all ';

    if (!feedback) {
      // Before answer submitted
      if (isSelected) {
        classes += 'border-primary bg-primary/10 ';
      } else {
        classes += 'border-border hover:border-primary/50 hover:bg-accent ';
      }
    } else {
      // After answer submitted (feedback mode)
      if (isCorrect) {
        classes += 'border-green-500 bg-green-500/10 ';
      } else if (isSelected && !isCorrect) {
        classes += 'border-red-500 bg-red-500/10 ';
      } else {
        classes += 'border-border opacity-50 ';
      }
    }

    return classes;
  }
}
