import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'collaborators', loadComponent: () => import('./pages/collaborators/collaborators').then(m => m.Collaborators) },
  { path: 'calendar', loadComponent: () => import('./pages/calendar/calendar').then(m => m.Calendar) },
];
