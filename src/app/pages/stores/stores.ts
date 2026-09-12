import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Store, StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-stores',
  imports: [RouterLink, ReactiveFormsModule, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Store Directory'"></app-navbar>

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
                  <span class="text-[#131b2e] font-medium">Store Directory</span>
                </div>
                <div class="flex items-center gap-3">
                  <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">Store Directory & Management</h1>
                  <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#3525cd] border border-indigo-200">
                    {{ service.stores().length }} Live Outlets
                  </span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  (click)="service.exportRatingsCsv()"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#464555] bg-white hover:bg-[#f2f3ff] border border-[#eaedff] shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">ios_share</span>
                  <span>Export Registry</span>
                </button>

                <button
                  type="button"
                  (click)="showAddModal.set(true)"
                  class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] shadow-sm shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">add_business</span>
                  <span>+ Add New Store</span>
                </button>
              </div>
            </div>

            <!-- 4 KPI Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Active Locations</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ service.stores().length }}</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">100% Operational</span>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Platform Avg Rating</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ avgPlatformRating() }}</span>
                  <span class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">★ Benchmark</span>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Review Pipeline</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ service.ratings().length }}</span>
                  <span class="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Evaluated</span>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Verified Audits</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">99.8%</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">TLS Compliant</span>
                </div>
              </div>
            </div>

            <!-- Advanced Filter Ribbon -->
            <div class="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-xs flex flex-wrap items-center gap-3">
              <!-- Name Filter -->
              <div class="flex-1 min-w-[180px] relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">storefront</span>
                <input
                  type="text"
                  [value]="filterName()"
                  (input)="filterName.set($any($event.target).value)"
                  placeholder="Store Name..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <!-- Owner Email Filter -->
              <div class="flex-1 min-w-[180px] relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">mail</span>
                <input
                  type="text"
                  [value]="filterEmail()"
                  (input)="filterEmail.set($any($event.target).value)"
                  placeholder="Owner Email..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <!-- Address Filter -->
              <div class="flex-1 min-w-[180px] relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">location_on</span>
                <input
                  type="text"
                  [value]="filterAddress()"
                  (input)="filterAddress.set($any($event.target).value)"
                  placeholder="Address or City..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <!-- Sort dropdown -->
              <div class="min-w-[150px]">
                <select
                  [value]="sortBy()"
                  (change)="sortBy.set($any($event.target).value)"
                  class="w-full px-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating (Highest)</option>
                  <option value="reviews">Sort by Review Count</option>
                </select>
              </div>

              @if (filterName() || filterEmail() || filterAddress()) {
                <button
                  type="button"
                  (click)="clearFilters()"
                  class="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-[14px]">clear</span>
                  <span>Clear</span>
                </button>
              }
            </div>

            <!-- Stores Table -->
            <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-[#eaedff] bg-[#faf8ff] text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                      <th class="py-3 px-5">Store Details</th>
                      <th class="py-3 px-5">Owner & Authentication</th>
                      <th class="py-3 px-5">Physical Address</th>
                      <th class="py-3 px-5">Average Rating</th>
                      <th class="py-3 px-5">Status</th>
                      <th class="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#eaedff] text-xs">
                    @for (store of filteredStores(); track store.id) {
                      <tr class="hover:bg-[#f2f3ff]/50 transition-colors">
                        <!-- Store details -->
                        <td class="py-4 px-5">
                          <div class="flex items-center gap-3">
                            <img
                              [src]="store.imageUrl"
                              [alt]="store.name"
                              class="w-12 h-12 rounded-xl object-cover border border-[#eaedff] shadow-2xs shrink-0"
                              referrerpolicy="no-referrer"
                            />
                            <div>
                              <span class="font-bold text-sm text-[#131b2e] block">{{ store.name }}</span>
                              <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="text-[10px] font-mono font-semibold text-[#3525cd] bg-indigo-50 px-1.5 py-0.5 rounded">
                                  {{ store.code }}
                                </span>
                                <span class="text-[11px] text-[#777587]">• {{ store.category }}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Owner -->
                        <td class="py-4 px-5">
                          <div class="flex flex-col">
                            <span class="font-semibold text-[#131b2e]">{{ store.ownerName }}</span>
                            <span class="text-[11px] text-[#777587]">{{ store.ownerEmail }}</span>
                            <span class="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded w-fit mt-1">
                              STORE_OWNER
                            </span>
                          </div>
                        </td>

                        <!-- Address -->
                        <td class="py-4 px-5 max-w-xs text-[#464555]">
                          <p class="truncate font-medium text-[#131b2e]">{{ store.city }}</p>
                          <p class="truncate text-[11px] text-[#777587]">{{ store.address }}</p>
                        </td>

                        <!-- Average Rating -->
                        <td class="py-4 px-5 whitespace-nowrap">
                          <div class="flex items-center gap-1.5">
                            <span class="text-amber-500 material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="text-sm font-bold text-[#131b2e]">{{ store.averageRating.toFixed(1) }}</span>
                            <span class="text-xs text-[#777587]">({{ store.ratingCount }})</span>
                          </div>
                        </td>

                        <!-- Status -->
                        <td class="py-4 px-5 whitespace-nowrap">
                          <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Active
                          </span>
                        </td>

                        <!-- Actions -->
                        <td class="py-4 px-5 text-right whitespace-nowrap">
                          <div class="flex items-center justify-end gap-1.5">
                            <a
                              routerLink="/directory"
                              class="px-2.5 py-1 text-xs font-semibold text-[#3525cd] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              View / Rate
                            </a>
                            <button
                              type="button"
                              (click)="viewRatingsForStore(store)"
                              class="p-1 text-[#777587] hover:text-[#131b2e] rounded-lg"
                              title="Audit Ratings"
                            >
                              <span class="material-symbols-outlined text-base">visibility</span>
                            </button>
                          </div>
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

      <!-- Add Store Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl border border-[#eaedff] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div class="p-6 border-b border-[#eaedff] flex items-center justify-between bg-gradient-to-r from-[#f2f3ff] to-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-[#3525cd] flex items-center justify-center">
                  <span class="material-symbols-outlined">add_business</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-[#131b2e]">Add New Verified Store</h3>
                  <p class="text-xs text-[#777587]">Register location & bind store owner credential</p>
                </div>
              </div>
              <button
                type="button"
                (click)="showAddModal.set(false)"
                class="text-[#777587] hover:text-[#131b2e] p-1"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form [formGroup]="newStoreForm" (ngSubmit)="submitNewStore()" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="newStoreNameInput" class="text-xs font-semibold text-[#131b2e]">Storefront Brand Name</label>
                <input
                  id="newStoreNameInput"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Pacific Artisan Market"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label for="newCategoryInput" class="text-xs font-semibold text-[#131b2e]">Category</label>
                  <select
                    id="newCategoryInput"
                    formControlName="category"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none bg-white"
                  >
                    <option value="Grocery & Convenience">Grocery & Convenience</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Artisanal Bakery & Cafe">Artisanal Bakery & Cafe</option>
                    <option value="Supermarket & Produce">Supermarket & Produce</option>
                    <option value="Apparel & Fashion">Apparel & Fashion</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="newOwnerSelect" class="text-xs font-semibold text-[#131b2e]">Assign Store Owner</label>
                  <select
                    id="newOwnerSelect"
                    formControlName="ownerId"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none bg-white"
                  >
                    @for (u of service.users(); track u.id) {
                      <option [value]="u.id">{{ u.name }} ({{ u.role }})</option>
                    }
                  </select>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="newCityInput" class="text-xs font-semibold text-[#131b2e]">City / Region</label>
                <input
                  id="newCityInput"
                  type="text"
                  formControlName="city"
                  placeholder="e.g. San Francisco, CA"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="newAddressInput" class="text-xs font-semibold text-[#131b2e]">Physical Address (Max 400 chars)</label>
                <textarea
                  id="newAddressInput"
                  rows="2"
                  formControlName="address"
                  placeholder="Street, Building Suite, Postal Code..."
                  class="w-full p-3 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none resize-none"
                ></textarea>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  (click)="showAddModal.set(false)"
                  class="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] rounded-xl shadow-xs"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class Stores {
  readonly service = inject(StorePulseService);

  readonly filterName = signal('');
  readonly filterEmail = signal('');
  readonly filterAddress = signal('');
  readonly sortBy = signal<'name' | 'rating' | 'reviews'>('rating');
  readonly showAddModal = signal(false);

  readonly avgPlatformRating = computed(() => {
    const list = this.service.stores();
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, s) => acc + s.averageRating, 0);
    return (sum / list.length).toFixed(2);
  });

  readonly filteredStores = computed(() => {
    let list = this.service.stores();
    const nameTerm = this.filterName().toLowerCase().trim();
    const emailTerm = this.filterEmail().toLowerCase().trim();
    const addrTerm = this.filterAddress().toLowerCase().trim();

    if (nameTerm) {
      list = list.filter(s => s.name.toLowerCase().includes(nameTerm));
    }
    if (emailTerm) {
      list = list.filter(s => s.ownerEmail.toLowerCase().includes(emailTerm) || s.ownerName.toLowerCase().includes(emailTerm));
    }
    if (addrTerm) {
      list = list.filter(s => s.address.toLowerCase().includes(addrTerm) || s.city.toLowerCase().includes(addrTerm));
    }

    const sort = this.sortBy();
    return [...list].sort((a, b) => {
      if (sort === 'rating') return b.averageRating - a.averageRating;
      if (sort === 'reviews') return b.ratingCount - a.ratingCount;
      return a.name.localeCompare(b.name);
    });
  });

  readonly newStoreForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('Grocery & Convenience', [Validators.required]),
    ownerId: new FormControl('user-owner-1', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.maxLength(400)])
  });

  clearFilters() {
    this.filterName.set('');
    this.filterEmail.set('');
    this.filterAddress.set('');
  }

  viewRatingsForStore(store: Store) {
    this.service.showToast('info', 'Store Audit', `${store.name}: ${store.ratingCount} reviews recorded.`);
  }

  submitNewStore() {
    if (this.newStoreForm.invalid) {
      this.service.showToast('error', 'Form Error', 'Please complete all required fields.');
      return;
    }
    const val = this.newStoreForm.value;
    this.service.addStore({
      name: val.name || '',
      category: val.category || 'Retail Storefront',
      ownerId: val.ownerId || 'user-owner-1',
      city: val.city || '',
      address: val.address || ''
    });
    this.showAddModal.set(false);
    this.newStoreForm.reset({
      category: 'Grocery & Convenience',
      ownerId: 'user-owner-1'
    });
  }
}
