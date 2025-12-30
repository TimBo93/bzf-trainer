import { Component, input, output } from '@angular/core';
import { AlertTriangle, ExternalLink, LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.scss',
})
export class DisclaimerComponent {
  readonly AlertTriangle = AlertTriangle;
  readonly ExternalLink = ExternalLink;
  readonly X = X;

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
}
