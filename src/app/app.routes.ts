import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'quiz',
    loadComponent: () => import('./pages/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'results/:sessionId',
    loadComponent: () =>
      import('./pages/results/results.component').then((m) => m.ResultsComponent),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./pages/statistics/statistics.component').then((m) => m.StatisticsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'licenses',
    loadComponent: () =>
      import('./pages/licenses/licenses.component').then((m) => m.LicensesComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
