import { Component, inject, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AlertTriangle, ExternalLink, Globe, LucideAngularModule, X } from 'lucide-angular';
import { Language, TranslationService } from '../../../core/services';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [LucideAngularModule, TranslateModule],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss',
})
export class DisclaimerComponent {
  readonly AlertTriangle = AlertTriangle;
  readonly ExternalLink = ExternalLink;
  readonly X = X;
  readonly Globe = Globe;

  translationService = inject(TranslationService);

  /** If true, shows as 'About' dialog without saving to localStorage */
  aboutMode = input(false);

  accepted = output<void>();
  closed = output<void>();

  accept() {
    if (!this.aboutMode()) {
      localStorage.setItem('disclaimerAccepted', 'true');
    }
    this.accepted.emit();
  }

  close() {
    this.closed.emit();
  }

  setLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
  }
}
