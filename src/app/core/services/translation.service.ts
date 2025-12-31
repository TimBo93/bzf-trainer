import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { db } from '../db/database';

export type Language = 'de' | 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private _language = signal<Language>('de');
  language = this._language.asReadonly();

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('de');
    this.loadLanguage();
  }

  private async loadLanguage() {
    try {
      const langSetting = await db.settings.get('language');
      if (langSetting) {
        const lang = langSetting.value as Language;
        this._language.set(lang);
        this.translate.use(lang);
      } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        const lang: Language = browserLang === 'en' ? 'en' : 'de';
        this._language.set(lang);
        this.translate.use(lang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
      this.translate.use('de');
    }
  }

  async setLanguage(lang: Language) {
    this._language.set(lang);
    this.translate.use(lang);
    await db.settings.put({ key: 'language', value: lang });
  }
}
