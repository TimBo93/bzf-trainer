import { Injectable, signal } from '@angular/core';
import { Question, ShuffledQuestion, ShuffledAnswer, Category, CategoriesData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private _questions = signal<Question[]>([]);
  private _categories = signal<Category[]>([]);
  private _questionMapping = signal<Record<string, string>>({});
  private _isLoaded = signal<boolean>(false);

  questions = this._questions.asReadonly();
  categories = this._categories.asReadonly();
  questionMapping = this._questionMapping.asReadonly();
  isLoaded = this._isLoaded.asReadonly();

  async loadData(): Promise<void> {
    if (this._isLoaded()) return;

    try {
      const [questionsResponse, categoriesResponse] = await Promise.all([
        fetch('/questions.json'),
        fetch('/categories.json')
      ]);

      const questions: Question[] = await questionsResponse.json();
      const categoriesData: CategoriesData = await categoriesResponse.json();

      this._questions.set(questions);
      this._categories.set(categoriesData.categories);
      this._questionMapping.set(categoriesData.questionMapping);
      this._isLoaded.set(true);
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  getQuestionById(id: number): Question | undefined {
    return this._questions().find(q => q.number === id);
  }

  getQuestionsByIds(ids: number[]): Question[] {
    return ids.map(id => this.getQuestionById(id)).filter((q): q is Question => q !== undefined);
  }

  getQuestionsByCategory(categoryId: string): Question[] {
    const mapping = this._questionMapping();
    return this._questions().filter(q => mapping[q.number.toString()] === categoryId);
  }

  getCategoryById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  getCategoryForQuestion(questionId: number): Category | undefined {
    const categoryId = this._questionMapping()[questionId.toString()];
    return categoryId ? this.getCategoryById(categoryId) : undefined;
  }

  shuffleAnswers(question: Question): ShuffledQuestion {
    const answers: ShuffledAnswer[] = [
      { label: 'A', text: question.A, isCorrect: true, originalKey: 'A' },
      { label: 'B', text: question.B, isCorrect: false, originalKey: 'B' },
      { label: 'C', text: question.C, isCorrect: false, originalKey: 'C' },
      { label: 'D', text: question.D, isCorrect: false, originalKey: 'D' },
    ];

    // Fisher-Yates shuffle
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Update labels after shuffling
    answers.forEach((answer, index) => {
      answer.label = String.fromCharCode(65 + index); // A, B, C, D
    });

    return {
      original: question,
      shuffledAnswers: answers
    };
  }

  shuffleQuestions(questions: Question[]): Question[] {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getAllQuestionIds(): number[] {
    return this._questions().map(q => q.number);
  }

  getRandomQuestionIds(count: number): number[] {
    const allIds = this.getAllQuestionIds();
    const shuffled = [...allIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  getCategoryQuestionIds(categoryId: string): number[] {
    return this.getQuestionsByCategory(categoryId).map(q => q.number);
  }

  getTotalQuestionCount(): number {
    return this._questions().length;
  }

  getQuestionCountByCategory(categoryId: string): number {
    return this.getQuestionsByCategory(categoryId).length;
  }
}
