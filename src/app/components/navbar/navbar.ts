import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorePulseService, UserRole } from '../../services/store-pulse.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <!-- Top Simulation Perspective Bar -->
    <div class="bg-[#1e1b4b] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-indigo-900/60 select-none">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
          SIMULATION ACTIVE
        </span>
        <span class="text-indigo-200">Current Stakeholder Perspective:</span>
        <span class="font-semibold text-white">{{ service.currentUser().name }}</span>
        <span class="text-indigo-300 font-mono text-[11px]">({{ service.currentUser().role }})</span>
      </div>

      <div class="flex items-center gap-1.5 bg-black/30 p-0.5 rounded-lg border border-white/10">
        <button
          type="button"
          (click)="switchRole('ADMIN')"
          class="px-2.5 py-1 rounded text-xs font-medium transition-all"
          [class.bg-indigo-600]="service.currentRole() === 'ADMIN'"
          [class.text-white]="service.currentRole() === 'ADMIN'"
          [class.text-indigo-200]="service.currentRole() !== 'ADMIN'"
          [class.hover:text-white]="service.currentRole() !== 'ADMIN'"
        >
          [ADMIN]
        </button>
        <button
          type="button"
          (click)="switchRole('STORE_OWNER')"
          class="px-2.5 py-1 rounded text-xs font-medium transition-all"
          [class.bg-indigo-600]="service.currentRole() === 'STORE_OWNER'"
          [class.text-white]="service.currentRole() === 'STORE_OWNER'"
          [class.text-indigo-200]="service.currentRole() !== 'STORE_OWNER'"
          [class.hover:text-white]="service.currentRole() !== 'STORE_OWNER'"
        >
          [STORE_OWNER]
        </button>
        <button
          type="button"
          (click)="switchRole('USER')"
          class="px-2.5 py-1 rounded text-xs font-medium transition-all"
          [class.bg-indigo-600]="service.currentRole() === 'USER'"
          [class.text-white]="service.currentRole() === 'USER'"
          [class.text-indigo-200]="service.currentRole() !== 'USER'"
          [class.hover:text-white]="service.currentRole() !== 'USER'"
        >
          [USER]
        </button>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <header class="bg-white border-b border-[#eaedff] px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs text-[#777587]">
          <span>Platform</span>
          <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          <span class="font-medium text-[#131b2e]">{{ breadcrumb() }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Quick Nav Shortcuts depending on role -->
        <div class="hidden md:flex items-center gap-1.5 border-r border-[#eaedff] pr-4 mr-1">
          <a
            routerLink="/dashboard"
            class="text-xs px-2.5 py-1.5 rounded-lg text-[#464555] hover:bg-[#f2f3ff] hover:text-[#3525cd] transition-colors"
          >
            Dashboard
          </a>
          <a
            routerLink="/stores"
            class="text-xs px-2.5 py-1.5 rounded-lg text-[#464555] hover:bg-[#f2f3ff] hover:text-[#3525cd] transition-colors"
          >
            Stores
          </a>
          <a
            routerLink="/directory"
            class="text-xs px-2.5 py-1.5 rounded-lg text-[#464555] hover:bg-[#f2f3ff] hover:text-[#3525cd] transition-colors"
          >
            Shopper View
          </a>
          <a
            routerLink="/store-analytics"
            class="text-xs px-2.5 py-1.5 rounded-lg text-[#464555] hover:bg-[#f2f3ff] hover:text-[#3525cd] transition-colors"
          >
            Owner Analytics
          </a>
          <a
            routerLink="/users"
            class="text-xs px-2.5 py-1.5 rounded-lg text-[#464555] hover:bg-[#f2f3ff] hover:text-[#3525cd] transition-colors"
          >
            Users
          </a>
        </div>

        <!-- Notification Bell -->
        <button
          type="button"
          (click)="showRecentAlert()"
          class="p-2 rounded-lg text-[#464555] hover:bg-[#f2f3ff] relative transition-colors"
          title="Platform Alerts"
        >
          <span class="material-symbols-outlined text-xl">notifications</span>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3525cd] ring-2 ring-white"></span>
        </button>

        <!-- User Profile Pill -->
        <div class="flex items-center gap-3 pl-2">
          <img
            [src]="service.currentUser().avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w'"
            alt="User avatar"
            class="w-8 h-8 rounded-full border border-indigo-200 object-cover"
            referrerpolicy="no-referrer"
          />
          <div class="hidden sm:block text-left">
            <p class="text-xs font-semibold text-[#131b2e] leading-tight">{{ service.currentUser().name }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span
                class="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                [class.bg-indigo-100]="service.currentRole() === 'ADMIN'"
                [class.text-indigo-800]="service.currentRole() === 'ADMIN'"
                [class.bg-emerald-100]="service.currentRole() === 'STORE_OWNER'"
                [class.text-emerald-800]="service.currentRole() === 'STORE_OWNER'"
                [class.bg-sky-100]="service.currentRole() === 'USER'"
                [class.text-sky-800]="service.currentRole() === 'USER'"
              >
                {{ service.currentRole() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Account Security Link -->
        <a
          routerLink="/change-password"
          class="p-2 rounded-lg text-[#464555] hover:bg-[#f2f3ff] hover:text-[#3525cd] transition-colors"
          title="Account Security & Passwords"
        >
          <span class="material-symbols-outlined text-xl">manage_accounts</span>
        </a>

        <!-- Sign Out / Exit session -->
        <button
          type="button"
          (click)="logout()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          title="End Session"
        >
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <span class="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  `
})
export class Navbar {
  readonly service = inject(StorePulseService);
  readonly router = inject(Router);
  readonly breadcrumb = input<string>('Overview Dashboard');

  switchRole(role: UserRole) {
    this.service.setSimulationRole(role);
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else if (role === 'STORE_OWNER') {
      this.router.navigate(['/store-analytics']);
    } else {
      this.router.navigate(['/directory']);
    }
  }

  showRecentAlert() {
    this.service.showToast('info', 'System Audit Stream', 'Connected to real-time event pipeline. All ingress nodes operating normally.');
  }

  logout() {
    this.service.showToast('info', 'Session Terminated', 'You have been safely logged out.');
    this.router.navigate(['/login']);
  }
}
