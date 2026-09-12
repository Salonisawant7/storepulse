import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then(m => m.Signup)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users').then(m => m.Users)
  },
  {
    path: 'stores',
    loadComponent: () => import('./pages/stores/stores').then(m => m.Stores)
  },
  {
    path: 'directory',
    loadComponent: () => import('./pages/directory/directory').then(m => m.Directory)
  },
  {
    path: 'store-analytics',
    loadComponent: () => import('./pages/store-analytics/store-analytics').then(m => m.StoreAnalytics)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password').then(m => m.ChangePassword)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics').then(m => m.Analytics)
  },
  {
    path: 'moderation',
    loadComponent: () => import('./pages/moderation/moderation').then(m => m.Moderation)
  },
  {
    path: 'audit-logs',
    loadComponent: () => import('./pages/audit-logs/audit-logs').then(m => m.AuditLogs)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
