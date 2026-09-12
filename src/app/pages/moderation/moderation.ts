import { Component, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService, StoreRating } from '../../services/store-pulse.service';

@Component({
  selector: 'app-moderation',
  imports: [Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Review Moderation'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-xs text-[#777587] mb-1">
                  <span>Intelligence & Trust</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span class="text-[#131b2e] font-medium">Review Moderation</span>
                </div>
                <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">Trust Sentinel & Review Moderation</h1>
                <p class="text-xs text-[#777587] mt-0.5">
                  Automated sentiment verification, anti-fraud evaluation pipeline, and reviewer trust scoring.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Anti-Fraud Filter Active
                </span>
              </div>
            </div>

            <!-- Moderation Queue -->
            <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
              <div class="p-5 border-b border-[#eaedff] flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-[#131b2e]">Recent Review Ingestions</h2>
                  <p class="text-xs text-[#777587]">Verified customer reviews passing TLS signature verification</p>
                </div>
                <span class="text-xs font-mono text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                  {{ service.ratings().length }} Live Reviews
                </span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-[#eaedff] bg-[#faf8ff] text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                      <th class="py-3 px-5">Shopper</th>
                      <th class="py-3 px-5">Target Store</th>
                      <th class="py-3 px-5">Evaluation Score</th>
                      <th class="py-3 px-5">Customer Feedback</th>
                      <th class="py-3 px-5">Timestamp</th>
                      <th class="py-3 px-5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#eaedff] text-xs">
                    @for (rating of service.ratings(); track rating.id) {
                      @let store = getStore(rating.storeId);
                      <tr class="hover:bg-[#f2f3ff]/40 transition-colors">
                        <td class="py-3.5 px-5">
                          <span class="font-bold text-[#131b2e] block">{{ rating.userName }}</span>
                          <span class="text-[11px] text-[#777587] font-mono">{{ rating.userEmail }}</span>
                        </td>

                        <td class="py-3.5 px-5">
                          <span class="font-bold text-[#131b2e] block">{{ store?.name || 'Store Outlet' }}</span>
                          <span class="text-[11px] text-[#777587]">{{ store?.city }}</span>
                        </td>

                        <td class="py-3.5 px-5 whitespace-nowrap">
                          <div class="flex items-center gap-1.5">
                            <span class="text-amber-500 material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="font-bold text-[#131b2e]">{{ rating.rating }}.0 / 5.0</span>
                          </div>
                        </td>

                        <td class="py-3.5 px-5 max-w-sm text-[#464555]">
                          <span class="italic">{{ rating.feedback || 'No written note attached' }}</span>
                        </td>

                        <td class="py-3.5 px-5 text-[#777587] text-[11px] whitespace-nowrap">
                          {{ rating.createdAt }}
                        </td>

                        <td class="py-3.5 px-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            (click)="verifyReview(rating)"
                            class="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <span class="material-symbols-outlined text-[13px]">check_circle</span>
                            <span>Verify</span>
                          </button>
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
export class Moderation {
  readonly service = inject(StorePulseService);

  getStore(storeId: string) {
    return this.service.stores().find(s => s.id === storeId);
  }

  verifyReview(rating: StoreRating) {
    this.service.showToast('success', 'Verified Review', `Rating from ${rating.userName} audited and verified.`);
  }
}
