import { Component, OnInit, signal } from '@angular/core';
import { ExternalLink, FileText, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-licenses',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss',
})
export class LicensesComponent implements OnInit {
  readonly FileText = FileText;
  readonly ExternalLink = ExternalLink;

  licenseText = signal<string>('');
  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    try {
      const response = await fetch('/3rdpartylicenses.txt');
      if (!response.ok) {
        throw new Error('Lizenzdatei nicht gefunden');
      }
      const text = await response.text();
      this.licenseText.set(text);
    } catch (e) {
      this.error.set(
        'Die Lizenzdatei konnte nicht geladen werden. Sie ist nur im Production-Build verfügbar.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
