import { computed, Injectable, signal } from '@angular/core';
import { db } from '../db/database';

export type Theme = 'light' | 'dark' | 'system';
export type QuestionVariant = 'bzf' | 'bzf-e';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _theme = signal<Theme>('system');
  private _immediateFeedback = signal<boolean>(true);
  private _effectiveTheme = signal<'light' | 'dark'>('light');
  private _questionVariant = signal<QuestionVariant>('bzf');

  theme = this._theme.asReadonly();
  immediateFeedback = this._immediateFeedback.asReadonly();
  effectiveTheme = this._effectiveTheme.asReadonly();
  questionVariant = this._questionVariant.asReadonly();

  isDark = computed(() => this._effectiveTheme() === 'dark');

  constructor() {
    this.loadSettings();
    this.setupSystemThemeListener();
  }

  private async loadSettings() {
    try {
      const themeSetting = await db.settings.get('theme');
      const feedbackSetting = await db.settings.get('immediateFeedback');
      const variantSetting = await db.settings.get('questionVariant');

      if (themeSetting) {
        this._theme.set(themeSetting.value as Theme);
      }

      if (feedbackSetting) {
        this._immediateFeedback.set(feedbackSetting.value as boolean);
      }

      if (variantSetting) {
        this._questionVariant.set((variantSetting.value as QuestionVariant) ?? 'bzf');
      }

      this.applyTheme();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  private setupSystemThemeListener() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this._theme() === 'system') {
          this.applyTheme();
        }
      });
    }
  }

  private applyTheme() {
    if (typeof document === 'undefined') return;

    const theme = this._theme();
    let effectiveTheme: 'light' | 'dark';

    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      effectiveTheme = theme;
    }

    this._effectiveTheme.set(effectiveTheme);

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  initTheme() {
    this.applyTheme();
  }

  async setTheme(theme: Theme) {
    this._theme.set(theme);
    await db.settings.put({ key: 'theme', value: theme });
    this.applyTheme();
  }

  async setImmediateFeedback(enabled: boolean) {
    this._immediateFeedback.set(enabled);
    await db.settings.put({ key: 'immediateFeedback', value: enabled });
  }

  async setQuestionVariant(variant: QuestionVariant) {
    this._questionVariant.set(variant);
    await db.settings.put({ key: 'questionVariant', value: variant });
  }

  toggleTheme() {
    const current = this._effectiveTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
}
