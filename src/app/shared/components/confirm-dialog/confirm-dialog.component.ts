import { Component, input, output } from '@angular/core';
import { AlertCircle, LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly AlertCircle = AlertCircle;
  readonly X = X;

  title = input<string>('Bestätigung');
  message = input<string>('Möchtest du fortfahren?');
  confirmText = input<string>('Bestätigen');
  cancelText = input<string>('Abbrechen');
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
