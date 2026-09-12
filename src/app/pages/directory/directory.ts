import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Store, StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-directory',
  imports: [FormsModule, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Shopper Directory'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">

            <!-- Header and Session Context -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-xs text-[#777587] mb-1">
                  <span class="inline-flex items-center gap-1 text-sky-800 bg-sky-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                    <span class="material-symbols-outlined text-[13px]">shopping_bag</span>
                    Shopper Evaluation Workspace • Active Session
                  </span>
                  <span>•</span>
                  <span class="text-[#131b2e] font-medium">{{ service.currentUser().name }}</span>
                </div>
                <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">Stores Directory</h1>
                <p class="text-xs text-[#777587] mt-0.5">
                  Browse verified stores, view community ratings, and submit your personal evaluation.
                </p>
              </div>

              <!-- Shopper Metrics Ribbon -->
              <div class="flex items-center gap-3">
                <div class="bg-white px-4 py-2 rounded-xl border border-[#eaedff] shadow-xs flex items-center gap-3">
                  <div>
                    <span class="text-[10px] uppercase font-bold text-[#777587] block">Rated by You</span>
                    <span class="text-base font-bold text-[#131b2e]">{{ ratedByMeCount() }} / {{ service.stores().length }}</span>
                  </div>
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 text-[#3525cd] flex items-center justify-center">
                    <span class="material-symbols-outlined text-base">reviews</span>
                  </div>
                </div>

                <div class="bg-white px-4 py-2 rounded-xl border border-[#eaedff] shadow-xs flex items-center gap-3">
                  <div>
                    <span class="text-[10px] uppercase font-bold text-[#777587] block">Avg Given</span>
                    <span class="text-base font-bold text-[#131b2e]">{{ avgGivenRating() }} ★</span>
                  </div>
                  <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-base">star</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search, Location & Filter Pills -->
            <div class="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex flex-1 flex-wrap items-center gap-2.5">
                <!-- Search Store Name -->
                <div class="relative flex-1 min-w-[200px]">
                  <span class="material-symbols-outlined absolute left-3 top-2 text-base text-[#777587]">search</span>
                  <input
                    type="text"
                    [value]="searchQuery()"
                    (input)="searchQuery.set($any($event.target).value)"
                    placeholder="Search store name or category..."
                    class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                  />
                </div>

                <!-- Location Filter -->
                <div class="relative min-w-[160px]">
                  <span class="material-symbols-outlined absolute left-3 top-2 text-base text-[#777587]">location_on</span>
                  <input
                    type="text"
                    [value]="locationQuery()"
                    (input)="locationQuery.set($any($event.target).value)"
                    placeholder="Filter by city..."
                    class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                  />
                </div>
              </div>

              <!-- Filter Pills -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  (click)="filterCategory.set('ALL')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                  [class.bg-[#3525cd]]="filterCategory() === 'ALL'"
                  [class.text-white]="filterCategory() === 'ALL'"
                  [class.bg-[#f2f3ff]]="filterCategory() !== 'ALL'"
                  [class.text-[#464555]]="filterCategory() !== 'ALL'"
                >
                  All Stores
                </button>
                <button
                  type="button"
                  (click)="filterCategory.set('RATED')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                  [class.bg-[#3525cd]]="filterCategory() === 'RATED'"
                  [class.text-white]="filterCategory() === 'RATED'"
                  [class.bg-[#f2f3ff]]="filterCategory() !== 'RATED'"
                  [class.text-[#464555]]="filterCategory() !== 'RATED'"
                >
                  Rated by Me
                </button>
                <button
                  type="button"
                  (click)="filterCategory.set('UNRATED')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                  [class.bg-[#3525cd]]="filterCategory() === 'UNRATED'"
                  [class.text-white]="filterCategory() === 'UNRATED'"
                  [class.bg-[#f2f3ff]]="filterCategory() !== 'UNRATED'"
                  [class.text-[#464555]]="filterCategory() !== 'UNRATED'"
                >
                  Unrated
                </button>
                <button
                  type="button"
                  (click)="filterCategory.set('HIGH_RATED')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                  [class.bg-[#3525cd]]="filterCategory() === 'HIGH_RATED'"
                  [class.text-white]="filterCategory() === 'HIGH_RATED'"
                  [class.bg-[#f2f3ff]]="filterCategory() !== 'HIGH_RATED'"
                  [class.text-[#464555]]="filterCategory() !== 'HIGH_RATED'"
                >
                  4★ & above
                </button>
              </div>
            </div>

            <!-- Stores Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (store of filteredStores(); track store.id) {
                @let myRating = service.getUserRatingForStore(store.id);
                <div class="bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
                  <div>
                    <!-- Store Image & Floating Badges -->
                    <div class="relative h-44 w-full bg-[#f2f3ff] overflow-hidden">
                      <img
                        [src]="store.imageUrl"
                        [alt]="store.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerpolicy="no-referrer"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      <!-- Top pill: category & code -->
                      <div class="absolute top-3 left-3 flex items-center gap-1.5">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs font-mono">
                          {{ store.code }}
                        </span>
                        <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/85 text-[#131b2e] backdrop-blur-xs">
                          {{ store.category }}
                        </span>
                      </div>

                      <!-- Bottom overlay inside image: Store Name & City -->
                      <div class="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
                        <div>
                          <h3 class="text-lg font-bold drop-shadow-xs leading-snug">{{ store.name }}</h3>
                          <p class="text-xs text-white/90 drop-shadow-2xs flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">location_on</span>
                            <span>{{ store.city }}</span>
                          </p>
                        </div>

                        <!-- Score Pill -->
                        <div class="bg-white/95 text-[#131b2e] px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 font-bold text-xs backdrop-blur-xs">
                          <span class="text-amber-500 material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                          <span>{{ store.averageRating.toFixed(1) }}</span>
                          <span class="text-[10px] text-[#777587]">({{ store.ratingCount }})</span>
                        </div>
                      </div>
                    </div>

                    <!-- Store Card Body -->
                    <div class="p-5 flex flex-col gap-3">
                      <p class="text-xs text-[#777587] line-clamp-2 leading-relaxed">
                        {{ store.address }}
                      </p>

                      <!-- Rating Status Box -->
                      <div
                        class="p-3.5 rounded-xl border flex items-center justify-between"
                        [class.bg-emerald-50]="!!myRating"
                        [class.border-emerald-200]="!!myRating"
                        [class.bg-[#faf8ff]]="!myRating"
                        [class.border-[#eaedff]]="!myRating"
                      >
                        @if (myRating) {
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <span class="material-symbols-outlined text-base">verified</span>
                            </div>
                            <div>
                              <div class="flex items-center gap-1">
                                <span class="text-xs font-bold text-[#131b2e]">Your Rating: {{ myRating.rating }}.0 / 5.0</span>
                                <div class="flex items-center text-amber-500 text-xs">
                                  @for (star of [1,2,3,4,5]; track star) {
                                    <span
                                      class="material-symbols-outlined text-[13px]"
                                      [style.font-variation-settings]="getFillSetting(star <= myRating.rating)"
                                    >
                                      star
                                    </span>
                                  }
                                </div>
                              </div>
                              <p class="text-[11px] text-[#777587] mt-0.5">
                                {{ myRating.feedback ? '"' + myRating.feedback + '"' : 'Rated on ' + myRating.createdAt }}
                              </p>
                            </div>
                          </div>
                        } @else {
                          <div class="flex items-center gap-3 text-xs text-[#777587]">
                            <div class="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                              <span class="material-symbols-outlined text-base">star_outline</span>
                            </div>
                            <div>
                              <span class="font-bold text-[#131b2e] block">Not Rated</span>
                              <span class="text-[11px]">You haven't evaluated this store yet.</span>
                            </div>
                          </div>
                        }

                        <!-- Action Button -->
                        <button
                          type="button"
                          (click)="openRatingModal(store)"
                          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
                          [class.bg-emerald-600]="!!myRating"
                          [class.text-white]="!!myRating"
                          [class.hover:bg-emerald-700]="!!myRating"
                          [class.bg-[#3525cd]]="!myRating"
                          [class.text-white]="!myRating"
                          [class.hover:bg-[#2b1ea7]]="!myRating"
                        >
                          <span class="material-symbols-outlined text-[15px]">
                            {{ myRating ? 'edit' : 'star' }}
                          </span>
                          <span>{{ myRating ? 'Modify Rating' : 'Submit Rating' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Store Owner Attribution Footer -->
                  <div class="px-5 py-2.5 bg-[#f2f3ff]/40 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#777587]">
                    <span>Managed by: <strong class="text-[#131b2e]">{{ store.ownerName }}</strong></span>
                    <span class="text-emerald-700 font-medium">Verified Location</span>
                  </div>
                </div>
              }
            </div>

          </div>
        </main>
      </div>

      <!-- Rating Submission & Modification Modal -->
      @if (activeRatingStore(); as s) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl border border-[#eaedff] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <!-- Modal Header -->
            <div class="p-6 border-b border-[#eaedff] flex items-center justify-between bg-gradient-to-r from-[#f2f3ff] to-white">
              <div class="flex items-center gap-3">
                <img
                  [src]="s.imageUrl"
                  [alt]="s.name"
                  class="w-12 h-12 rounded-xl object-cover border border-[#eaedff]"
                  referrerpolicy="no-referrer"
                />
                <div>
                  <h3 class="text-base font-bold text-[#131b2e]">{{ s.name }}</h3>
                  <p class="text-xs text-[#777587]">{{ s.city }} • Code: {{ s.code }}</p>
                </div>
              </div>
              <button
                type="button"
                (click)="closeRatingModal()"
                class="text-[#777587] hover:text-[#131b2e] p-1"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 flex flex-col gap-5">
              <!-- Star Rating Selector -->
              <div class="flex flex-col items-center justify-center p-4 bg-[#f2f3ff] rounded-2xl text-center">
                <span class="text-xs font-bold text-[#777587] uppercase tracking-wider mb-2">
                  Select Rating Score
                </span>

                <!-- 5 Large Interactive Stars -->
                <div class="flex items-center gap-2 text-3xl text-amber-400">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <button
                      type="button"
                      (click)="selectedStars.set(star)"
                      (mouseenter)="hoverStars.set(star)"
                      (mouseleave)="hoverStars.set(0)"
                      class="hover:scale-125 transition-transform p-1 cursor-pointer focus:outline-none"
                    >
                      <span
                        class="material-symbols-outlined text-4xl text-amber-500"
                        [style.font-variation-settings]="getFillSetting((hoverStars() || selectedStars()) >= star)"
                      >
                        star
                      </span>
                    </button>
                  }
                </div>

                <!-- Descriptive text for current score -->
                <p class="text-xs font-bold text-[#131b2e] mt-2">
                  @if ((hoverStars() || selectedStars()) === 5) {
                    5 out of 5 — Outstanding Excellence
                  } @else if ((hoverStars() || selectedStars()) === 4) {
                    4 out of 5 — Very Good Experience
                  } @else if ((hoverStars() || selectedStars()) === 3) {
                    3 out of 5 — Average / Satisfactory
                  } @else if ((hoverStars() || selectedStars()) === 2) {
                    2 out of 5 — Below Average
                  } @else {
                    1 out of 5 — Poor Experience
                  }
                </p>
              </div>

              <!-- Feedback Textarea -->
              <div class="flex flex-col gap-1.5">
                <label for="feedbackInput" class="text-xs font-semibold text-[#131b2e]">
                  Written Evaluation (Optional)
                </label>
                <textarea
                  id="feedbackInput"
                  rows="3"
                  [(ngModel)]="feedbackText"
                  placeholder="Share details about cleanliness, staff courtesy, item variety, and checkout speed..."
                  class="w-full p-3 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                ></textarea>
              </div>

              <!-- Fair Rating Integrity Notice -->
              <div class="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <span class="material-symbols-outlined text-sm text-amber-700 shrink-0 mt-0.5">policy</span>
                <span>
                  <strong>Integrity Rule:</strong> One evaluation per registered user per store. Submitting this form will update your existing score if previously rated.
                </span>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
                <button
                  type="button"
                  (click)="closeRatingModal()"
                  class="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  (click)="submitRating(s.id)"
                  class="px-5 py-2 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-sm">send</span>
                  <span>Publish Evaluation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class Directory {
  readonly service = inject(StorePulseService);

  readonly searchQuery = signal('');
  readonly locationQuery = signal('');
  readonly filterCategory = signal<'ALL' | 'RATED' | 'UNRATED' | 'HIGH_RATED'>('ALL');

  readonly activeRatingStore = signal<Store | null>(null);
  readonly selectedStars = signal(5);
  readonly hoverStars = signal(0);
  feedbackText = '';

  readonly ratedByMeCount = computed(() => {
    const userId = this.service.currentUser().id;
    return this.service.ratings().filter(r => r.userId === userId).length;
  });

  readonly avgGivenRating = computed(() => {
    const userId = this.service.currentUser().id;
    const myRatings = this.service.ratings().filter(r => r.userId === userId);
    if (myRatings.length === 0) return '0.0';
    const sum = myRatings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / myRatings.length).toFixed(1);
  });

  readonly filteredStores = computed(() => {
    let list = this.service.stores();
    const q = this.searchQuery().toLowerCase().trim();
    const loc = this.locationQuery().toLowerCase().trim();
    const cat = this.filterCategory();

    if (q) {
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (loc) {
      list = list.filter(s => s.city.toLowerCase().includes(loc) || s.address.toLowerCase().includes(loc));
    }
    if (cat === 'RATED') {
      list = list.filter(s => !!this.service.getUserRatingForStore(s.id));
    } else if (cat === 'UNRATED') {
      list = list.filter(s => !this.service.getUserRatingForStore(s.id));
    } else if (cat === 'HIGH_RATED') {
      list = list.filter(s => s.averageRating >= 4.0);
    }
    return list;
  });

  openRatingModal(store: Store) {
    this.activeRatingStore.set(store);
    const existing = this.service.getUserRatingForStore(store.id);
    if (existing) {
      this.selectedStars.set(existing.rating);
      this.feedbackText = existing.feedback || '';
    } else {
      this.selectedStars.set(5);
      this.feedbackText = '';
    }
  }

  closeRatingModal() {
    this.activeRatingStore.set(null);
  }

  submitRating(storeId: string) {
    this.service.submitRating(storeId, this.selectedStars(), this.feedbackText);
    this.closeRatingModal();
  }

  getFillSetting(filled: boolean): string {
    return filled ? "'FILL' 1" : "'FILL' 0";
  }
}
