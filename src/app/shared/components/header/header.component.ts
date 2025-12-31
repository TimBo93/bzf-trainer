import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BarChart3,
  ChevronDown,
  Globe,
  Home,
  Info,
  LucideAngularModule,
  Moon,
  Plane,
  Settings,
  Sun,
} from 'lucide-angular';
import { Language, SettingsService, TranslationService } from '../../../core/services';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, SearchComponent, DisclaimerComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  settingsService = inject(SettingsService);
  translationService = inject(TranslationService);

  readonly Plane = Plane;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Settings = Settings;
  readonly BarChart3 = BarChart3;
  readonly Home = Home;
  readonly Info = Info;
  readonly Globe = Globe;
  readonly ChevronDown = ChevronDown;

  showAboutDialog = signal(false);
  showLanguageDropdown = signal(false);

  toggleTheme() {
    this.settingsService.toggleTheme();
  }

  openAbout() {
    this.showAboutDialog.set(true);
  }

  closeAbout() {
    this.showAboutDialog.set(false);
  }

  toggleLanguageDropdown() {
    this.showLanguageDropdown.update((v) => !v);
  }

  closeLanguageDropdown() {
    this.showLanguageDropdown.set(false);
  }

  setLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
    this.showLanguageDropdown.set(false);
  }

  getCurrentLanguageLabel(): string {
    return this.translationService.language() === 'de' ? 'DE' : 'EN';
  }
}
