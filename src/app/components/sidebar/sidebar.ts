import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-white border-r border-[#eaedff] flex flex-col justify-between shrink-0 min-h-[calc(100vh-41px)] select-none">
      <div class="p-5 flex flex-col gap-6">
        <!-- Logo Header -->
        <a routerLink="/dashboard" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3525cd] to-[#4f46e5] flex items-center justify-center shadow-md shadow-indigo-500/20 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1UAXqDmUs1oeNqBMEmrGLa62vgjRJfGghFhzIPqVQZSChZcq-ze86-BPpFmFPi2oO5377WGbw1D3owwTlMAh7wPgc-ZloSr4SPqZNYdJVg0moLIkEM7LUHFKljOi7OvPbY8sDBjtGACxibKD-EcxDnsVsZ-opDbZK9M_m6bAJXE-R1o3pM4s5ze6gADG96zVNb8153fwL6WV2U_IiXzuOB1Mej0_aRWa9HUpsUwILucrVQ4RHxIvro6lSo"
              alt="StorePulse Logo"
              class="w-8 h-8 object-contain filter brightness-0 invert"
              referrerpolicy="no-referrer"
            />
          </div>
          <div>
            <span class="font-bold text-base text-[#131b2e] tracking-tight block group-hover:text-[#3525cd] transition-colors">
              StorePulse
            </span>
            <span class="text-[10px] font-semibold text-[#777587] uppercase tracking-wider block">
              Enterprise Suite
            </span>
          </div>
        </a>

        <!-- Operational Domains -->
        <nav class="flex flex-col gap-1">
          <span class="text-[10px] font-bold uppercase text-[#777587] px-3 mb-1 tracking-wider">
            Operational Domains
          </span>

          <a
            routerLink="/dashboard"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Overview Dashboard</span>
          </a>

          <a
            routerLink="/stores"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">storefront</span>
            <span>Store Directory</span>
          </a>

          <a
            routerLink="/directory"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>Shopper Directory</span>
            </div>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">USER</span>
          </a>

          <a
            routerLink="/store-analytics"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px]">monitoring</span>
              <span>Store Analytics</span>
            </div>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">OWNER</span>
          </a>

          <a
            routerLink="/users"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px]">group</span>
              <span>User Management</span>
            </div>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">ADMIN</span>
          </a>
        </nav>

        <!-- Intelligence & Trust -->
        <nav class="flex flex-col gap-1">
          <span class="text-[10px] font-bold uppercase text-[#777587] px-3 mb-1 tracking-wider">
            Intelligence & Trust
          </span>

          <a
            routerLink="/analytics"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">bar_chart</span>
            <span>Rating Analytics</span>
          </a>

          <a
            routerLink="/moderation"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">verified_user</span>
            <span>Review Moderation</span>
          </a>

          <a
            routerLink="/audit-logs"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">history</span>
            <span>Audit Trail</span>
          </a>
        </nav>

        <!-- Credentials & Gateways -->
        <nav class="flex flex-col gap-1">
          <span class="text-[10px] font-bold uppercase text-[#777587] px-3 mb-1 tracking-wider">
            IAM & Access
          </span>

          <a
            routerLink="/change-password"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">key</span>
            <span>Change Password</span>
          </a>

          <a
            routerLink="/login"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">lock_open</span>
            <span>Access Gateway (Login)</span>
          </a>

          <a
            routerLink="/signup"
            routerLinkActive="bg-[#eaedff] text-[#3525cd] font-semibold border-r-4 border-[#3525cd]"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#464555] hover:bg-[#f2f3ff] transition-all"
          >
            <span class="material-symbols-outlined text-[20px]">person_add</span>
            <span>User Registration</span>
          </a>
        </nav>
      </div>

      <!-- Compliance & Status Footer -->
      <div class="p-4 border-t border-[#eaedff] bg-[#faf8ff] m-3 rounded-xl">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[11px] font-semibold text-[#131b2e]">Telemetry Operational</span>
        </div>
        <p class="text-[10px] text-[#777587] leading-relaxed">
          ISO/IEC 27001 • bcrypt 10 • TLS v1.3
        </p>
        <span class="text-[10px] font-mono text-[#464555] mt-1 block">
          v2.4.1-prod (Active)
        </span>
      </div>
    </aside>
  `
})
export class Sidebar {
  readonly service = inject(StorePulseService);
}
