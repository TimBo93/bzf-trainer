import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CheckCircle, Command, LucideAngularModule, Search, X } from 'lucide-angular';
import { Question } from '../../../core/models';
import { QuestionService } from '../../../core/services';
import { QuestionVariant } from '../../../core/services/settings.service';

interface AnswerOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface SearchResult {
  question: Question;
  answers: AnswerOption[];
  matchedIn: 'question' | 'answer';
  matchedText: string;
  variant: QuestionVariant;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  private questionService = inject(QuestionService);
  private translate = inject(TranslateService);

  readonly Search = Search;
  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly Command = Command;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  searchQuery = signal('');
  selectedResult = signal<SearchResult | null>(null);
  highlightedIndex = signal(-1);
  isMac = signal(false);
  // Search scope: 'both' searches across BZF and BZF-E
  searchScope = signal<'bzf' | 'bzf-e' | 'both'>('both');

  private getAnswers(question: Question): AnswerOption[] {
    return [
      { label: 'A', text: question.A, isCorrect: true },
      { label: 'B', text: question.B, isCorrect: false },
      { label: 'C', text: question.C, isCorrect: false },
      { label: 'D', text: question.D, isCorrect: false },
    ];
  }

  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (query.length < 2) return [];

    const scope = this.searchScope();
    const sources: { variant: QuestionVariant; questions: Question[] }[] =
      scope === 'both'
        ? [
            { variant: 'bzf', questions: this.questionService.getVariantQuestions('bzf') },
            { variant: 'bzf-e', questions: this.questionService.getVariantQuestions('bzf-e') },
          ]
        : [{ variant: scope, questions: this.questionService.getVariantQuestions(scope) }];

    const results: SearchResult[] = [];

    for (const source of sources) {
      for (const question of source.questions) {
        const answers = this.getAnswers(question);

        // Search in question text
        if (question.question.toLowerCase().includes(query)) {
          results.push({
            question,
            answers,
            matchedIn: 'question',
            matchedText: question.question,
            variant: source.variant,
          });
          continue;
        }

        // Search in answers
        for (const answer of answers) {
          if (answer.text.toLowerCase().includes(query)) {
            results.push({
              question,
              answers,
              matchedIn: 'answer',
              matchedText: answer.text,
              variant: source.variant,
            });
            break; // Only add question once per variant
          }
        }

        // Limit results
        if (results.length >= 40) break; // allow more when searching both
      }
    }

    return results;
  });

  ngOnInit() {
    this.isMac.set(navigator.platform.toLowerCase().includes('mac'));
    this.questionService.loadData();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent) {
    // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
      return;
    }

    // Escape to close
    if (event.key === 'Escape' && this.isOpen()) {
      this.closeSearch();
      return;
    }

    // Navigate results with arrow keys
    if (this.isOpen() && this.searchResults().length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.highlightedIndex.update((i) => (i < this.searchResults().length - 1 ? i + 1 : 0));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.highlightedIndex.update((i) => (i > 0 ? i - 1 : this.searchResults().length - 1));
      } else if (event.key === 'Enter' && this.highlightedIndex() >= 0) {
        event.preventDefault();
        this.selectResult(this.searchResults()[this.highlightedIndex()]);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isOpen() && this.searchContainer) {
      const clickedInside = this.searchContainer.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.closeSearch();
      }
    }
  }

  openSearch() {
    this.isOpen.set(true);
    this.selectedResult.set(null);
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 50);
  }

  closeSearch() {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.selectedResult.set(null);
    this.highlightedIndex.set(-1);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.highlightedIndex.set(-1);
    this.selectedResult.set(null);
  }

  setSearchScope(scope: 'bzf' | 'bzf-e' | 'both') {
    this.searchScope.set(scope);
    this.highlightedIndex.set(-1);
    this.selectedResult.set(null);
  }

  selectResult(result: SearchResult) {
    this.selectedResult.set(result);
    this.highlightedIndex.set(-1);
  }

  backToResults() {
    this.selectedResult.set(null);
  }

  highlightMatch(text: string): string {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return text;

    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(
      regex,
      '<mark class="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">$1</mark>'
    );
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getCategoryName(questionNumber: number): string {
    const category = this.questionService.getCategoryForQuestion(questionNumber);
    if (category) {
      return this.translate.instant('categories.' + category.id + '.name');
    }
    return this.translate.instant('search.unknown');
  }
}
