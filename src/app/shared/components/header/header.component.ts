import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BarChart3,
  Home,
  Info,
  LucideAngularModule,
  Moon,
  Plane,
  Settings,
  Sun,
} from 'lucide-angular';
import { SettingsService } from '../../../core/services';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, SearchComponent, DisclaimerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  settingsService = inject(SettingsService);

  readonly Plane = Plane;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Settings = Settings;
  readonly BarChart3 = BarChart3;
  readonly Home = Home;
  readonly Info = Info;

  showAboutDialog = signal(false);

  toggleTheme() {
    this.settingsService.toggleTheme();
  }

  openAbout() {
    this.showAboutDialog.set(true);
  }

  closeAbout() {
    this.showAboutDialog.set(false);
  }
}
