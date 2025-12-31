import { Component, inject, input, output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertCircle, LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [LucideAngularModule, TranslateModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  private translate = inject(TranslateService);

  readonly AlertCircle = AlertCircle;
  readonly X = X;

  title = input<string>('');
  message = input<string>('');
  confirmText = input<string>('');
  cancelText = input<string>('');

  getTitle(): string {
    return this.title() || this.translate.instant('confirm.title');
  }

  getMessage(): string {
    return this.message() || this.translate.instant('confirm.message');
  }

  getConfirmText(): string {
    return this.confirmText() || this.translate.instant('confirm.confirm');
  }

  getCancelText(): string {
    return this.cancelText() || this.translate.instant('confirm.cancel');
  }
  confirmVariant = input<'primary' | 'danger'>('primary');

  confirmed = output<void>();
  cancelled = output<void>();

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }
}
