import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { DisclaimerComponent } from './shared/components/disclaimer/disclaimer.component';
import { SettingsService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, DisclaimerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private settingsService = inject(SettingsService);
  
  showDisclaimer = signal(!localStorage.getItem('disclaimerAccepted'));

  ngOnInit() {
    // Initialize theme on app start
    this.settingsService.initTheme();
  }

  onDisclaimerAccepted() {
    this.showDisclaimer.set(false);
  }
}
