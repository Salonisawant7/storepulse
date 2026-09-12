import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-store-analytics',
  imports: [RouterLink, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Store Analytics'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">

            <!-- Owner Profile & Storefront Header Banner -->
            <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div class="flex items-center gap-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOmjRNemEo6rCabSeYpk8-uG0vz0WryZ2LIlCoFqNdKRsFyFlWzswcePeHMudzCYSI7W5Lsigh_RL-t_HHf-QV5OIFZKGpW6hSZSh6VDmTbQpHAtoELH82dSBqpX92ezGNjd58qxzdRc4zC6pchqCmkF0CZM7J8QVnYAEnaY4iGhWZqwdCMlAUyL0tkcdkEMngfceZsX52ny1mkExYRV2PYSJE4hyv8azBd-7MYVEmRzTf0WEe26IboA"
                  alt="Rajesh Patil"
                  class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-200 shadow-xs"
                  referrerpolicy="no-referrer"
                />
                <div>
                  <div class="flex items-center gap-2">
                    <h1 class="text-xl font-bold text-[#131b2e] tracking-tight">Rajesh Patil</h1>
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      STORE_OWNER
                    </span>
                  </div>
                  <p class="text-xs text-[#777587] mt-0.5">
                    Managing <strong class="text-[#131b2e]">{{ currentStore().name }}</strong> • {{ currentStore().city }}
                  </p>
                  <div class="flex items-center gap-2 mt-2 text-[11px] text-[#464555]">
                    <span class="font-mono bg-[#f2f3ff] px-2 py-0.5 rounded font-semibold text-[#3525cd]">
                      {{ currentStore().code }}
                    </span>
                    <span>•</span>
                    <span class="text-emerald-700 font-medium flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Verified Storefront Operator
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2.5">
                <a
                  routerLink="/change-password"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#464555] bg-white hover:bg-[#f2f3ff] border border-[#eaedff] shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">key</span>
                  <span>Change Password</span>
                </a>

                <button
                  type="button"
                  (click)="service.exportRatingsCsv(currentStore().id)"
                  class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] shadow-sm shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  <span>Export Ratings CSV</span>
                </button>
              </div>
            </div>

            <!-- 4 Performance Metric Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Retail Outlet</span>
                <span class="text-lg font-bold text-[#131b2e] truncate block mt-1">{{ currentStore().name }}</span>
                <span class="text-[11px] text-emerald-600 font-medium mt-0.5 block">STR-8834 Active</span>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Average Rating</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ currentStore().averageRating.toFixed(1) }}</span>
                  <div class="flex items-center text-amber-500 text-xs">
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star_half</span>
                  </div>
                </div>
                <span class="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Top 5% Tier
                </span>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Total Ratings</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ storeRatings().length }}</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+8 this week</span>
                </div>
                <span class="text-[11px] text-[#777587] mt-0.5 block">100% verified shoppers</span>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Customer Sentiment</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">94%</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Positive</span>
                </div>
                <span class="text-[11px] text-[#777587] mt-0.5 block">2 under review</span>
              </div>
            </div>

            <!-- Two Columns: Sentiment Momentum & Rating Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Column (7 cols): Rating Breakdown & Category Score -->
              <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h2 class="text-base font-bold text-[#131b2e]">Star Distribution Breakdown</h2>
                      <p class="text-xs text-[#777587]">Historical customer rating distribution for {{ currentStore().name }}</p>
                    </div>
                    <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      Consistent 4.5+ Benchmark
                    </span>
                  </div>

                  <div class="flex flex-col gap-2.5 my-4">
                    <div class="flex items-center gap-3 text-xs">
                      <span class="w-8 font-medium text-[#464555]">5 ★</span>
                      <div class="flex-1 bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full" style="width: 72%"></div>
                      </div>
                      <span class="w-10 text-right text-[#777587] font-mono">72%</span>
                    </div>

                    <div class="flex items-center gap-3 text-xs">
                      <span class="w-8 font-medium text-[#464555]">4 ★</span>
                      <div class="flex-1 bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full" style="width: 20%"></div>
                      </div>
                      <span class="w-10 text-right text-[#777587] font-mono">20%</span>
                    </div>

                    <div class="flex items-center gap-3 text-xs">
                      <span class="w-8 font-medium text-[#464555]">3 ★</span>
                      <div class="flex-1 bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full" style="width: 5%"></div>
                      </div>
                      <span class="w-10 text-right text-[#777587] font-mono">5%</span>
                    </div>

                    <div class="flex items-center gap-3 text-xs">
                      <span class="w-8 font-medium text-[#464555]">2 ★</span>
                      <div class="flex-1 bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full" style="width: 2%"></div>
                      </div>
                      <span class="w-10 text-right text-[#777587] font-mono">2%</span>
                    </div>

                    <div class="flex items-center gap-3 text-xs">
                      <span class="w-8 font-medium text-[#464555]">1 ★</span>
                      <div class="flex-1 bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                        <div class="bg-amber-400 h-full rounded-full" style="width: 1%"></div>
                      </div>
                      <span class="w-10 text-right text-[#777587] font-mono">1%</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-[#eaedff] grid grid-cols-3 gap-3 text-center text-xs">
                  <div class="p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                    <span class="text-[#777587] block text-[11px]">Staff Courtesy</span>
                    <strong class="text-sm text-[#131b2e] block mt-0.5">4.8 / 5.0</strong>
                  </div>
                  <div class="p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                    <span class="text-[#777587] block text-[11px]">Billing Speed</span>
                    <strong class="text-sm text-[#131b2e] block mt-0.5">4.9 / 5.0</strong>
                  </div>
                  <div class="p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                    <span class="text-[#777587] block text-[11px]">Product Quality</span>
                    <strong class="text-sm text-[#131b2e] block mt-0.5">4.7 / 5.0</strong>
                  </div>
                </div>
              </div>

              <!-- Right Column (5 cols): Sentiment Momentum Chart -->
              <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h2 class="text-base font-bold text-[#131b2e]">30-Day Sentiment Momentum</h2>
                      <p class="text-xs text-[#777587]">Weekly rolling review volume</p>
                    </div>
                    <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      +18% MoM
                    </span>
                  </div>

                  <!-- Bar chart illustration -->
                  <div class="h-44 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-[#faf8ff] rounded-2xl border border-[#eaedff]">
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-[#dae2fd] rounded-t-lg" style="height: 60px;"></div>
                      <span class="text-[11px] font-medium text-[#777587]">Week 1</span>
                    </div>

                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-[#c3c0ff] rounded-t-lg" style="height: 85px;"></div>
                      <span class="text-[11px] font-medium text-[#777587]">Week 2</span>
                    </div>

                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-[#4f46e5] rounded-t-lg" style="height: 110px;"></div>
                      <span class="text-[11px] font-medium text-[#777587]">Week 3</span>
                    </div>

                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-[#3525cd] rounded-t-lg shadow-sm" style="height: 135px;"></div>
                      <span class="text-[11px] font-bold text-[#131b2e]">Week 4 (Now)</span>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs text-[#777587]">
                  <span>Algorithmic Fraud Filter: Active</span>
                  <span class="text-emerald-700 font-semibold flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">shield</span>
                    0% Bot Activity Detected
                  </span>
                </div>
              </div>
            </div>

            <!-- Table: Users Who Rated Your Store -->
            <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
              <div class="p-5 border-b border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-[#131b2e]">Users Who Rated Your Store</h2>
                    <span class="text-xs font-mono text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                      {{ storeRatings().length }} Ratings Record
                    </span>
                  </div>
                  <p class="text-xs text-[#777587] mt-0.5">
                    Customer feedback and evaluation index scoped directly to {{ currentStore().name }}.
                  </p>
                </div>

                <!-- Search inside ratings -->
                <div class="flex items-center gap-2">
                  <div class="relative min-w-[200px]">
                    <span class="material-symbols-outlined absolute left-3 top-2 text-base text-[#777587]">search</span>
                    <input
                      type="text"
                      [value]="searchCustomer()"
                      (input)="searchCustomer.set($any($event.target).value)"
                      placeholder="Filter customer reviews..."
                      class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-[#eaedff] bg-[#faf8ff] text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                      <th class="py-3 px-5">User</th>
                      <th class="py-3 px-5">Email Address</th>
                      <th class="py-3 px-5">Submitted Rating</th>
                      <th class="py-3 px-5">Feedback</th>
                      <th class="py-3 px-5">Date Rated</th>
                      <th class="py-3 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#eaedff] text-xs">
                    @for (rating of filteredStoreRatings(); track rating.id) {
                      <tr class="hover:bg-[#f2f3ff]/40 transition-colors">
                        <td class="py-3.5 px-5 font-bold text-[#131b2e]">
                          {{ rating.userName }}
                        </td>
                        <td class="py-3.5 px-5 text-[#777587] font-mono text-[11px]">
                          {{ rating.userEmail }}
                        </td>
                        <td class="py-3.5 px-5 whitespace-nowrap">
                          <div class="flex items-center gap-1.5">
                            <span class="text-amber-500 material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="font-bold text-[#131b2e]">{{ rating.rating }}.0</span>
                          </div>
                        </td>
                        <td class="py-3.5 px-5 max-w-sm text-[#464555]">
                          <span class="italic">{{ rating.feedback || 'No written note attached' }}</span>
                        </td>
                        <td class="py-3.5 px-5 text-[#777587] text-[11px] whitespace-nowrap">
                          {{ rating.createdAt }}
                        </td>
                        <td class="py-3.5 px-5 whitespace-nowrap">
                          <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <span class="material-symbols-outlined text-[12px]">verified</span>
                            Verified Shopper
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
export class StoreAnalytics {
  readonly service = inject(StorePulseService);

  readonly searchCustomer = signal('');

  readonly currentStore = computed(() => {
    return this.service.getOwnerStore() || this.service.stores()[0];
  });

  readonly storeRatings = computed(() => {
    const store = this.currentStore();
    if (!store) return [];
    return this.service.ratings().filter(r => r.storeId === store.id);
  });

  readonly filteredStoreRatings = computed(() => {
    const list = this.storeRatings();
    const q = this.searchCustomer().toLowerCase().trim();
    if (!q) return list;
    return list.filter(r =>
      r.userName.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      (r.feedback && r.feedback.toLowerCase().includes(q))
    );
  });
}
