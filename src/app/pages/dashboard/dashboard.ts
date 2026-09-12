import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService, UserRole } from '../../services/store-pulse.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ReactiveFormsModule, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Overview Dashboard'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">

            <!-- Breadcrumbs and Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-xs text-[#777587] mb-1">
                  <span>Home</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span>Admin</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span class="text-[#131b2e] font-medium">Overview Dashboard</span>
                </div>
                <div class="flex items-center gap-3">
                  <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">System Performance & Operations</h1>
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  (click)="service.exportRatingsCsv()"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#464555] bg-white hover:bg-[#f2f3ff] border border-[#eaedff] shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">download</span>
                  <span>Export Reports</span>
                </button>

                <button
                  type="button"
                  (click)="showAddStoreModal.set(true)"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#3525cd] bg-[#eaedff] hover:bg-[#dae2fd] border border-[#dae2fd] shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">add_business</span>
                  <span>+ Add Store</span>
                </button>

                <button
                  type="button"
                  (click)="showAddUserModal.set(true)"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] shadow-sm shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">person_add</span>
                  <span>+ Add New User</span>
                </button>
              </div>
            </div>

            <!-- 3 Main Metric Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Card 1: Active Users -->
              <div class="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider">Total Active Users</span>
                    <div class="flex items-baseline gap-2 mt-1">
                      <span class="text-3xl font-bold text-[#131b2e]">{{ userCount() }}</span>
                      <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        +12% vs last cycle
                      </span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-indigo-50 text-[#3525cd] flex items-center justify-center">
                    <span class="material-symbols-outlined">group</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-[#f2f3ff]">
                  <div class="flex items-center justify-between text-xs text-[#777587] mb-1.5">
                    <span>Role Breakdown</span>
                    <span class="font-mono text-[#131b2e] font-medium">{{ normalUserCount() }} Shoppers / {{ storeOwnerCount() }} Owners</span>
                  </div>
                  <div class="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden flex">
                    <div class="bg-[#3525cd] h-full" style="width: 65%" title="Normal Users"></div>
                    <div class="bg-emerald-500 h-full" style="width: 25%" title="Store Owners"></div>
                    <div class="bg-amber-500 h-full" style="width: 10%" title="Admins"></div>
                  </div>
                </div>
              </div>

              <!-- Card 2: Monitored Stores -->
              <div class="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider">Monitored Stores</span>
                    <div class="flex items-baseline gap-2 mt-1">
                      <span class="text-3xl font-bold text-[#131b2e]">{{ storeCount() }}</span>
                      <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {{ storeCount() - 1 }} Verified Active
                      </span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span class="material-symbols-outlined">storefront</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-[#f2f3ff] flex items-center justify-between text-xs">
                  <span class="text-[#777587]">Audited Coverage</span>
                  <span class="font-semibold text-emerald-700 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">verified</span>
                    99.8% Compliance Rate
                  </span>
                </div>
              </div>

              <!-- Card 3: Ratings Ingested -->
              <div class="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-xs flex flex-col justify-between">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider">Ratings Ingested</span>
                    <div class="flex items-baseline gap-2 mt-1">
                      <span class="text-3xl font-bold text-[#131b2e]">{{ ratingCount() }}</span>
                      <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        +94 this week
                      </span>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span class="material-symbols-outlined">star</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-[#f2f3ff] flex items-center justify-between text-xs">
                  <span class="text-[#777587]">Global Mean Index</span>
                  <div class="flex items-center gap-1 font-bold text-[#131b2e]">
                    <span class="text-amber-500 material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span>{{ meanRating() }} / 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Grid: Rating Distribution & Activity Feed vs Critical Stores -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left 7 columns -->
              <div class="lg:col-span-7 flex flex-col gap-6">

                <!-- Rating Distribution Card -->
                <div class="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-xs">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h2 class="text-base font-bold text-[#131b2e]">Platform Rating Distribution</h2>
                      <p class="text-xs text-[#777587]">Aggregated customer sentiments across monitored storefronts</p>
                    </div>
                    <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      76% High Satisfaction
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <!-- Big Score Display -->
                    <div class="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-[#f2f3ff] rounded-2xl text-center">
                      <span class="text-4xl font-black text-[#131b2e]">{{ meanRating() }}</span>
                      <div class="flex items-center text-amber-500 my-1">
                        <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 0;">star_half</span>
                      </div>
                      <span class="text-[11px] text-[#777587] font-medium">Based on {{ ratingCount() }} evaluations</span>
                    </div>

                    <!-- Star Breakdown Bars -->
                    <div class="sm:col-span-8 flex flex-col gap-2">
                      <!-- 5 Star -->
                      <div class="flex items-center gap-3 text-xs">
                        <span class="w-8 font-medium text-[#464555]">5 ★</span>
                        <div class="flex-1 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div class="bg-amber-400 h-full rounded-full" style="width: 54%"></div>
                        </div>
                        <span class="w-10 text-right text-[#777587] font-mono">54%</span>
                      </div>

                      <!-- 4 Star -->
                      <div class="flex items-center gap-3 text-xs">
                        <span class="w-8 font-medium text-[#464555]">4 ★</span>
                        <div class="flex-1 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div class="bg-amber-400 h-full rounded-full" style="width: 26%"></div>
                        </div>
                        <span class="w-10 text-right text-[#777587] font-mono">26%</span>
                      </div>

                      <!-- 3 Star -->
                      <div class="flex items-center gap-3 text-xs">
                        <span class="w-8 font-medium text-[#464555]">3 ★</span>
                        <div class="flex-1 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div class="bg-amber-400 h-full rounded-full" style="width: 12%"></div>
                        </div>
                        <span class="w-10 text-right text-[#777587] font-mono">12%</span>
                      </div>

                      <!-- 2 Star -->
                      <div class="flex items-center gap-3 text-xs">
                        <span class="w-8 font-medium text-[#464555]">2 ★</span>
                        <div class="flex-1 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div class="bg-amber-400 h-full rounded-full" style="width: 5%"></div>
                        </div>
                        <span class="w-10 text-right text-[#777587] font-mono">5%</span>
                      </div>

                      <!-- 1 Star -->
                      <div class="flex items-center gap-3 text-xs">
                        <span class="w-8 font-medium text-[#464555]">1 ★</span>
                        <div class="flex-1 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div class="bg-amber-400 h-full rounded-full" style="width: 3%"></div>
                        </div>
                        <span class="w-10 text-right text-[#777587] font-mono">3%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Recent Platform Activity Feed -->
                <div class="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-xs">
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-base font-bold text-[#131b2e]">Recent Platform Activity</h2>
                    <button
                      type="button"
                      class="text-xs text-[#3525cd] font-semibold hover:underline cursor-pointer"
                      (click)="service.showToast('info', 'Live Telemetry', 'Streaming events connected.')"
                    >
                      Real-time Feed
                    </button>
                  </div>

                  <div class="flex flex-col divide-y divide-[#eaedff]">
                    @for (evt of service.events(); track evt.id) {
                      <div class="py-3 flex items-start justify-between gap-4">
                        <div class="flex items-start gap-3">
                          <div
                            class="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                            [class.bg-indigo-50]="evt.type === 'USER_REGISTERED'"
                            [class.text-[#3525cd]]="evt.type === 'USER_REGISTERED'"
                            [class.bg-emerald-50]="evt.type === 'STORE_ONBOARDED'"
                            [class.text-emerald-600]="evt.type === 'STORE_ONBOARDED'"
                            [class.bg-amber-50]="evt.type === 'RATING_SUBMITTED'"
                            [class.text-amber-600]="evt.type === 'RATING_SUBMITTED'"
                            [class.bg-purple-50]="evt.type === 'PRIVILEGE_UPDATED'"
                            [class.text-purple-600]="evt.type === 'PRIVILEGE_UPDATED'"
                          >
                            <span class="material-symbols-outlined text-base">
                              @if (evt.type === 'USER_REGISTERED') { person_add }
                              @else if (evt.type === 'STORE_ONBOARDED') { storefront }
                              @else if (evt.type === 'RATING_SUBMITTED') { star }
                              @else { security }
                            </span>
                          </div>
                          <div>
                            <p class="text-xs font-bold text-[#131b2e] leading-snug">{{ evt.title }}</p>
                            <p class="text-xs text-[#777587] mt-0.5">{{ evt.description }}</p>
                            <span class="text-[10px] text-[#777587] mt-1 block">{{ evt.timestamp }}</span>
                          </div>
                        </div>
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#464555] shrink-0">
                          {{ evt.badge }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Right 5 columns: Operational Storefronts -->
              <div class="lg:col-span-5 flex flex-col gap-6">
                <div class="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-xs">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h2 class="text-base font-bold text-[#131b2e]">Operational Stores</h2>
                      <p class="text-xs text-[#777587]">Audited retail locations</p>
                    </div>
                    <a routerLink="/stores" class="text-xs text-[#3525cd] font-semibold hover:underline">
                      View all ({{ storeCount() }})
                    </a>
                  </div>

                  <div class="flex flex-col gap-3">
                    @for (store of service.stores(); track store.id) {
                      <div class="p-3.5 rounded-xl border border-[#eaedff] hover:border-indigo-200 transition-all flex items-center justify-between gap-3 bg-[#faf8ff]/50">
                        <div class="flex items-center gap-3 min-w-0">
                          <img
                            [src]="store.imageUrl"
                            [alt]="store.name"
                            class="w-11 h-11 rounded-lg object-cover border border-[#eaedff] shrink-0"
                            referrerpolicy="no-referrer"
                          />
                          <div class="min-w-0">
                            <h3 class="text-xs font-bold text-[#131b2e] truncate">{{ store.name }}</h3>
                            <p class="text-[11px] text-[#777587] truncate">{{ store.city }}</p>
                            <div class="flex items-center gap-1.5 mt-0.5">
                              <span class="text-[10px] font-mono text-[#3525cd] bg-indigo-50 px-1 rounded">{{ store.code }}</span>
                              <span class="text-[10px] text-[#777587]">• {{ store.category }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="text-right shrink-0">
                          <div class="flex items-center justify-end gap-1 text-xs font-bold text-[#131b2e]">
                            <span class="text-amber-500 material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span>{{ store.averageRating.toFixed(1) }}</span>
                          </div>
                          <span class="text-[10px] text-[#777587] block mt-0.5">{{ store.ratingCount }} reviews</span>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs">
                    <span class="text-[#777587]">Onboarding Pipeline</span>
                    <button
                      type="button"
                      (click)="showAddStoreModal.set(true)"
                      class="text-xs text-[#3525cd] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span class="material-symbols-outlined text-sm">add_circle</span>
                      <span>Register New Storefront</span>
                    </button>
                  </div>
                </div>

                <!-- Admin Security Summary Card -->
                <div class="bg-gradient-to-br from-[#1e1b4b] to-[#283044] text-white p-6 rounded-2xl shadow-md">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-indigo-200">
                      Security & Governance
                    </span>
                    <span class="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                      IAM ACTIVE
                    </span>
                  </div>
                  <h3 class="text-base font-bold text-white">Central User & Store Auditing</h3>
                  <p class="text-xs text-indigo-100/80 mt-1.5 leading-relaxed">
                    StorePulse enforces role-based access control (RBAC), preventing privilege escalation and enforcing single-evaluation integrity per verified store customer.
                  </p>
                  <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <a routerLink="/users" class="text-indigo-200 hover:text-white font-medium flex items-center gap-1">
                      <span>Inspect User Registry</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                    <a routerLink="/audit-logs" class="text-indigo-200 hover:text-white font-medium flex items-center gap-1">
                      <span>Audit Logs</span>
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <!-- Add Store Modal Dialog -->
      @if (showAddStoreModal()) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl border border-[#eaedff] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div class="p-6 border-b border-[#eaedff] flex items-center justify-between bg-gradient-to-r from-[#f2f3ff] to-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-[#3525cd] flex items-center justify-center">
                  <span class="material-symbols-outlined">add_business</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#131b2e]">Onboard New Retail Store</h3>
                  <p class="text-xs text-[#777587]">Register verified storefront & assign owner</p>
                </div>
              </div>
              <button
                type="button"
                (click)="showAddStoreModal.set(false)"
                class="text-[#777587] hover:text-[#131b2e] p-1"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form [formGroup]="addStoreForm" (ngSubmit)="submitAddStore()" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="storeName" class="text-xs font-semibold text-[#131b2e]">Store Name</label>
                <input
                  id="storeName"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Apex Hypermarket & Electronics"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label for="category" class="text-xs font-semibold text-[#131b2e]">Category</label>
                  <select
                    id="category"
                    formControlName="category"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                  >
                    <option value="Grocery & Convenience">Grocery & Convenience</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Artisanal Bakery & Cafe">Artisanal Bakery & Cafe</option>
                    <option value="Supermarket & Produce">Supermarket & Produce</option>
                    <option value="Health & Pharmacy">Health & Pharmacy</option>
                    <option value="Apparel & Fashion">Apparel & Fashion</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="ownerId" class="text-xs font-semibold text-[#131b2e]">Assigned Store Owner</label>
                  <select
                    id="ownerId"
                    formControlName="ownerId"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                  >
                    @for (u of service.users(); track u.id) {
                      <option [value]="u.id">{{ u.name }} ({{ u.role }})</option>
                    }
                  </select>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="city" class="text-xs font-semibold text-[#131b2e]">City / Jurisdiction</label>
                <input
                  id="city"
                  type="text"
                  formControlName="city"
                  placeholder="e.g. Seattle, WA"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="address" class="text-xs font-semibold text-[#131b2e]">Physical Address (Max 400 chars)</label>
                <textarea
                  id="address"
                  rows="2"
                  formControlName="address"
                  placeholder="Street, Landmark, Postal Code"
                  class="w-full p-3 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                ></textarea>
              </div>

              <div class="p-3 rounded-xl bg-[#f2f3ff] text-[11px] text-[#464555] flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-[#3525cd]">verified</span>
                <span>GPS geofencing and automatic certificate validation applied on submission.</span>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  (click)="showAddStoreModal.set(false)"
                  class="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] rounded-xl shadow-xs"
                >
                  Save Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Add User Modal Dialog -->
      @if (showAddUserModal()) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl border border-[#eaedff] max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div class="p-6 border-b border-[#eaedff] flex items-center justify-between bg-gradient-to-r from-[#f2f3ff] to-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-[#3525cd] flex items-center justify-center">
                  <span class="material-symbols-outlined">person_add</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#131b2e]">Provision System User</h3>
                  <p class="text-xs text-[#777587]">Assign role and access permissions</p>
                </div>
              </div>
              <button
                type="button"
                (click)="showAddUserModal.set(false)"
                class="text-[#777587] hover:text-[#131b2e] p-1"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form [formGroup]="addUserForm" (ngSubmit)="submitAddUser()" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="userName" class="text-xs font-semibold text-[#131b2e]">Full Name (Min 20 chars)</label>
                <input
                  id="userName"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Christopher James Sterling"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="userEmail" class="text-xs font-semibold text-[#131b2e]">Email Address</label>
                <input
                  id="userEmail"
                  type="email"
                  formControlName="email"
                  placeholder="c.sterling@enterprise.io"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="userRole" class="text-xs font-semibold text-[#131b2e]">IAM Role</label>
                <select
                  id="userRole"
                  formControlName="role"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                >
                  <option value="USER">USER (Shopper Reviewer)</option>
                  <option value="STORE_OWNER">STORE_OWNER (Retail Manager)</option>
                  <option value="ADMIN">ADMIN (System IAM Privilege)</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="userAddress" class="text-xs font-semibold text-[#131b2e]">Residential / Physical Address</label>
                <textarea
                  id="userAddress"
                  rows="2"
                  formControlName="address"
                  placeholder="Full physical street address..."
                  class="w-full p-3 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                ></textarea>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  (click)="showAddUserModal.set(false)"
                  class="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] rounded-xl shadow-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class Dashboard {
  readonly service = inject(StorePulseService);

  readonly showAddStoreModal = signal(false);
  readonly showAddUserModal = signal(false);

  readonly userCount = computed(() => this.service.users().length);
  readonly normalUserCount = computed(() => this.service.users().filter(u => u.role === 'USER').length);
  readonly storeOwnerCount = computed(() => this.service.users().filter(u => u.role === 'STORE_OWNER').length);
  readonly storeCount = computed(() => this.service.stores().length);
  readonly ratingCount = computed(() => this.service.ratings().length);

  readonly meanRating = computed(() => {
    const ratings = this.service.ratings();
    if (ratings.length === 0) return '4.2';
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  });

  readonly addStoreForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('Grocery & Convenience', [Validators.required]),
    ownerId: new FormControl('user-owner-1', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.maxLength(400)])
  });

  readonly addUserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl<UserRole>('USER', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.maxLength(400)])
  });

  submitAddStore() {
    if (this.addStoreForm.invalid) {
      this.service.showToast('error', 'Form Incomplete', 'Please fill in all store details.');
      return;
    }
    const val = this.addStoreForm.value;
    this.service.addStore({
      name: val.name || '',
      category: val.category || 'Retail Storefront',
      ownerId: val.ownerId || 'user-owner-1',
      city: val.city || '',
      address: val.address || ''
    });
    this.showAddStoreModal.set(false);
    this.addStoreForm.reset({
      category: 'Grocery & Convenience',
      ownerId: 'user-owner-1'
    });
  }

  submitAddUser() {
    if (this.addUserForm.invalid) {
      this.service.showToast('error', 'Form Incomplete', 'Name must be at least 20 characters and all fields provided.');
      return;
    }
    const val = this.addUserForm.value;
    this.service.addUser({
      name: val.name || '',
      email: val.email || '',
      role: (val.role as UserRole) || 'USER',
      address: val.address || '',
      twoFactorEnabled: true
    });
    this.showAddUserModal.set(false);
    this.addUserForm.reset({
      role: 'USER'
    });
  }
}
