import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-analytics',
  imports: [RouterLink, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Rating Analytics'"></app-navbar>

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
                  <span class="text-[#131b2e] font-medium">Rating Analytics</span>
                </div>
                <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">System-Wide Rating Analytics</h1>
                <p class="text-xs text-[#777587] mt-0.5">
                  Deep evaluation metrics, store ranking benchmarks, and customer sentiment trajectory.
                </p>
              </div>

              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  (click)="service.exportRatingsCsv()"
                  class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] shadow-sm shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  <span>Export Metrics Dataset</span>
                </button>
              </div>
            </div>

            <!-- 4 Metric Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Mean Quality Index</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ meanScore() }}</span>
                  <span class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">★ Benchmark</span>
                </div>
                <span class="text-[11px] text-[#777587] mt-0.5 block">Across all live outlets</span>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Net Promoter Score</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">+68</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">World Class</span>
                </div>
                <span class="text-[11px] text-[#777587] mt-0.5 block">NPS Survey percentile</span>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Review Velocity</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">3.4 / day</span>
                  <span class="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">+14% Growth</span>
                </div>
                <span class="text-[11px] text-[#777587] mt-0.5 block">Verified shoppers</span>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Sentiment Health</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">92.4%</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Favorable</span>
                </div>
                <span class="text-[11px] text-[#777587] mt-0.5 block">NLP classified</span>
              </div>
            </div>

            <!-- Stores Ranking Leaderboard -->
            <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6">
              <h2 class="text-base font-bold text-[#131b2e] mb-1">Monitored Storefront Rankings</h2>
              <p class="text-xs text-[#777587] mb-4">Ranked by Bayesian weighted average rating index</p>

              <div class="flex flex-col divide-y divide-[#eaedff]">
                @for (store of rankedStores(); track store.id; let idx = $index) {
                  <div class="py-3.5 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <span class="w-6 text-center font-mono font-bold text-sm" [class.text-amber-500]="idx === 0" [class.text-slate-400]="idx > 0">
                        #{{ idx + 1 }}
                      </span>
                      <img
                        [src]="store.imageUrl"
                        [alt]="store.name"
                        class="w-10 h-10 rounded-xl object-cover border border-[#eaedff]"
                        referrerpolicy="no-referrer"
                      />
                      <div>
                        <h3 class="text-xs font-bold text-[#131b2e]">{{ store.name }}</h3>
                        <p class="text-[11px] text-[#777587]">{{ store.city }} • {{ store.category }}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="flex items-center gap-1 font-bold text-xs text-[#131b2e]">
                          <span class="text-amber-500 material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                          <span>{{ store.averageRating.toFixed(1) }}</span>
                        </div>
                        <span class="text-[10px] text-[#777587] block">{{ store.ratingCount }} reviews</span>
                      </div>
                      <a
                        routerLink="/directory"
                        class="px-2.5 py-1 text-xs font-semibold text-[#3525cd] bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                      >
                        Inspect
                      </a>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  `
})
export class Analytics {
  readonly service = inject(StorePulseService);

  readonly meanScore = computed(() => {
    const list = this.service.stores();
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, s) => acc + s.averageRating, 0);
    return (sum / list.length).toFixed(1);
  });

  readonly rankedStores = computed(() => {
    return [...this.service.stores()].sort((a, b) => b.averageRating - a.averageRating);
  });
}
