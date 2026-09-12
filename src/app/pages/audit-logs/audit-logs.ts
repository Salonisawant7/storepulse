import { Component, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-audit-logs',
  imports: [Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Audit Trail'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-xs text-[#777587] mb-1">
                  <span>Governance</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span class="text-[#131b2e] font-medium">Audit Logs</span>
                </div>
                <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">Security & Governance Audit Trail</h1>
                <p class="text-xs text-[#777587] mt-0.5">
                  Immutable record of user registrations, role updates, rating submissions, and cryptographic events.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#3525cd] border border-indigo-200 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm">lock</span>
                  <span>Immutable Hash Chain</span>
                </span>
              </div>
            </div>

            <!-- Audit Trail Table -->
            <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
              <div class="p-5 border-b border-[#eaedff] flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-[#131b2e]">Recent Ledger Events</h2>
                  <p class="text-xs text-[#777587]">Sorted in reverse chronological order</p>
                </div>
                <span class="text-xs font-mono text-[#777587]">Total Events: {{ service.events().length }}</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-[#eaedff] bg-[#faf8ff] text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                      <th class="py-3 px-5">Timestamp</th>
                      <th class="py-3 px-5">Event Action</th>
                      <th class="py-3 px-5">Initiator Actor</th>
                      <th class="py-3 px-5">Payload Details</th>
                      <th class="py-3 px-5">Security Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#eaedff] text-xs">
                    @for (ev of service.events(); track ev.id) {
                      <tr class="hover:bg-[#f2f3ff]/40 transition-colors">
                        <td class="py-3.5 px-5 font-mono text-[11px] text-[#777587] whitespace-nowrap">
                          {{ ev.timestamp }}
                        </td>

                        <td class="py-3.5 px-5 whitespace-nowrap">
                          <span
                            class="inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-full"
                            [class.bg-indigo-100]="ev.type === 'USER_REGISTERED'"
                            [class.text-indigo-800]="ev.type === 'USER_REGISTERED'"
                            [class.bg-emerald-100]="ev.type === 'STORE_ONBOARDED'"
                            [class.text-emerald-800]="ev.type === 'STORE_ONBOARDED'"
                            [class.bg-amber-100]="ev.type === 'RATING_SUBMITTED'"
                            [class.text-amber-800]="ev.type === 'RATING_SUBMITTED'"
                            [class.bg-purple-100]="ev.type === 'PRIVILEGE_UPDATED'"
                            [class.text-purple-800]="ev.type === 'PRIVILEGE_UPDATED'"
                          >
                            {{ ev.type }}
                          </span>
                        </td>

                        <td class="py-3.5 px-5 font-bold text-[#131b2e] whitespace-nowrap">
                          {{ ev.title }}
                        </td>

                        <td class="py-3.5 px-5 text-[#464555]">
                          {{ ev.description }}
                        </td>

                        <td class="py-3.5 px-5 whitespace-nowrap">
                          <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {{ ev.badge }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  `
})
export class AuditLogs {
  readonly service = inject(StorePulseService);
}
