import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule, Trophy, Target, Flame, TrendingUp, BookOpen, CheckCircle } from 'lucide-angular';
import { QuestionService, StorageService } from '../../core/services';
import { Category } from '../../core/models';

interface CategoryStat {
  category: Category;
  total: number;
  answered: number;
  correct: number;
  percentage: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [DecimalPipe, LucideAngularModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  questionService = inject(QuestionService);
  storageService = inject(StorageService);

  readonly Trophy = Trophy;
  readonly Target = Target;
  readonly Flame = Flame;
  readonly TrendingUp = TrendingUp;
  readonly BookOpen = BookOpen;
  readonly CheckCircle = CheckCircle;

  isLoading = signal(true);
  categoryStats = signal<CategoryStat[]>([]);

  totalQuestions = computed(() => this.questionService.getTotalQuestionCount());
  answeredQuestions = computed(() => this.storageService.totalAnswered());
  correctQuestions = computed(() => this.storageService.totalCorrect());
  successRate = computed(() => this.storageService.getSuccessRate());
  streak = computed(() => this.storageService.getStreak());

  overallProgress = computed(() => {
    const total = this.totalQuestions();
    const correct = this.correctQuestions();
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  async ngOnInit() {
    try {
      await Promise.all([
        this.questionService.loadData(),
        this.storageService.loadData()
      ]);

      this.calculateCategoryStats();
    } finally {
      this.isLoading.set(false);
    }
  }

  private calculateCategoryStats() {
    const categories = this.questionService.categories();
    const mapping = this.questionService.questionMapping();
    const progressByCategory = this.storageService.getProgressByCategory(mapping);

    const stats: CategoryStat[] = categories.map(category => {
      const progress = progressByCategory.get(category.id) ?? { total: 0, answered: 0, correct: 0 };
      return {
        category,
        total: progress.total,
        answered: progress.answered,
        correct: progress.correct,
        percentage: progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0
      };
    });

    // Sort by percentage (ascending to show weakest first, or descending)
    stats.sort((a, b) => a.percentage - b.percentage);

    this.categoryStats.set(stats);
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  }
}
