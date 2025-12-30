import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  LucideAngularModule,
  MessageSquare,
  Monitor,
  Moon,
  Sun,
  Trash2,
} from 'lucide-angular';
import { SettingsService, StorageService } from '../../core/services';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  settingsService = inject(SettingsService);
  storageService = inject(StorageService);

  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly Monitor = Monitor;
  readonly MessageSquare = MessageSquare;
  readonly Trash2 = Trash2;
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle = CheckCircle;
  readonly FileText = FileText;

  showResetConfirm = signal(false);
  resetSuccess = signal(false);
  isResetting = signal(false);

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.settingsService.setTheme(theme);
  }

  toggleImmediateFeedback() {
    this.settingsService.setImmediateFeedback(!this.settingsService.immediateFeedback());
  }

  openResetDialog() {
    this.showResetConfirm.set(true);
    this.resetSuccess.set(false);
  }

  closeResetDialog() {
    this.showResetConfirm.set(false);
  }

  async confirmReset() {
    this.isResetting.set(true);
    try {
      await this.storageService.resetAllData();
      this.resetSuccess.set(true);
      this.showResetConfirm.set(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        this.resetSuccess.set(false);
      }, 3000);
    } finally {
      this.isResetting.set(false);
    }
  }
}
