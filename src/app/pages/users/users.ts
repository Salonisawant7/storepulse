import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService, User, UserRole } from '../../services/store-pulse.service';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'User Management'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-7xl mx-auto flex flex-col gap-6">

            <!-- Top Header & Security Level -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-xs font-semibold text-[#777587] mb-1">
                  <span class="inline-flex items-center gap-1 text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded">
                    <span class="material-symbols-outlined text-[14px]">security</span>
                    Directory Service • Security Level 3
                  </span>
                </div>
                <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">User Management</h1>
                <p class="text-xs text-[#777587] mt-0.5">
                  Manage system users, assign governance roles, and inspect associated operational profiles.
                </p>
              </div>

              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  (click)="service.exportUsersCsv()"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#464555] bg-white hover:bg-[#f2f3ff] border border-[#eaedff] shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">file_download</span>
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  (click)="showAddUserModal.set(true)"
                  class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] shadow-sm shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
                >
                  <span class="material-symbols-outlined text-base">person_add</span>
                  <span>+ Add User</span>
                </button>
              </div>
            </div>

            <!-- 4 KPI Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- KPI 1 -->
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Total Registered</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ service.users().length }}</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+14 this week</span>
                </div>
              </div>

              <!-- KPI 2 -->
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Store Owners</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ ownerCount() }}</span>
                  <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active storefronts</span>
                </div>
              </div>

              <!-- KPI 3 -->
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Normal Users</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ normalCount() }}</span>
                  <span class="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Verified reviewers</span>
                </div>
              </div>

              <!-- KPI 4 -->
              <div class="bg-white p-4 rounded-xl border border-[#eaedff] shadow-xs">
                <span class="text-xs font-semibold text-[#777587] uppercase tracking-wider block">Administrators</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-[#131b2e]">{{ adminCount() }}</span>
                  <span class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Full IAM privilege</span>
                </div>
              </div>
            </div>

            <!-- Search and Filter Ribbon -->
            <div class="bg-white p-4 rounded-2xl border border-[#eaedff] shadow-xs flex flex-wrap items-center gap-3">
              <!-- Name filter -->
              <div class="flex-1 min-w-[160px] relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">search</span>
                <input
                  type="text"
                  [value]="filterName()"
                  (input)="filterName.set($any($event.target).value)"
                  placeholder="Search by Name..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <!-- Email filter -->
              <div class="flex-1 min-w-[160px] relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">mail</span>
                <input
                  type="text"
                  [value]="filterEmail()"
                  (input)="filterEmail.set($any($event.target).value)"
                  placeholder="Search by Email..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <!-- Address filter -->
              <div class="flex-1 min-w-[160px] relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">location_on</span>
                <input
                  type="text"
                  [value]="filterAddress()"
                  (input)="filterAddress.set($any($event.target).value)"
                  placeholder="Search by Address..."
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                />
              </div>

              <!-- Role filter -->
              <div class="min-w-[140px]">
                <select
                  [value]="filterRole()"
                  (change)="filterRole.set($any($event.target).value)"
                  class="w-full px-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none bg-white"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <!-- Reset button -->
              @if (filterName() || filterEmail() || filterAddress() || filterRole() !== 'ALL') {
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

            <!-- Main Layout: User Table and Side Inspection Panel -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <!-- Table Container (8 Cols) -->
              <div class="lg:col-span-8 bg-white rounded-2xl border border-[#eaedff] shadow-xs overflow-hidden">
                <div class="p-4 border-b border-[#eaedff] flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-[#131b2e]">User Registry</span>
                    <span class="text-xs font-mono text-[#777587]">({{ filteredUsers().length }} matching)</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-[#777587]">
                    <span>Sort by:</span>
                    <button
                      type="button"
                      (click)="toggleSort('name')"
                      class="px-2 py-0.5 rounded font-semibold text-[#131b2e] hover:bg-[#f2f3ff]"
                    >
                      Name {{ sortField() === 'name' ? (sortAsc() ? '▲' : '▼') : '' }}
                    </button>
                    <button
                      type="button"
                      (click)="toggleSort('role')"
                      class="px-2 py-0.5 rounded font-semibold text-[#131b2e] hover:bg-[#f2f3ff]"
                    >
                      Role {{ sortField() === 'role' ? (sortAsc() ? '▲' : '▼') : '' }}
                    </button>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-[#eaedff] bg-[#faf8ff] text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                        <th class="py-3 px-4">User</th>
                        <th class="py-3 px-4">Address</th>
                        <th class="py-3 px-4">Role</th>
                        <th class="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#eaedff] text-xs">
                      @for (user of filteredUsers(); track user.id) {
                        <tr
                          tabindex="0"
                          (click)="inspectUser.set(user)"
                          (keyup.enter)="inspectUser.set(user)"
                          class="hover:bg-[#f2f3ff]/60 cursor-pointer transition-colors focus:outline-none focus:bg-[#f2f3ff]"
                          [class.bg-[#f2f3ff]]="inspectUser()?.id === user.id"
                        >
                          <!-- User column -->
                          <td class="py-3.5 px-4">
                            <div class="flex items-center gap-3">
                              <img
                                [src]="user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w'"
                                [alt]="user.name"
                                class="w-8 h-8 rounded-full object-cover border border-[#eaedff] shrink-0"
                                referrerpolicy="no-referrer"
                              />
                              <div>
                                <span class="font-bold text-[#131b2e] block">{{ user.name }}</span>
                                <span class="text-[11px] text-[#777587] block">{{ user.email }}</span>
                              </div>
                            </div>
                          </td>

                          <!-- Address column -->
                          <td class="py-3.5 px-4 max-w-xs truncate text-[#464555]">
                            {{ user.address }}
                          </td>

                          <!-- Role column -->
                          <td class="py-3.5 px-4 whitespace-nowrap">
                            <span
                              class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                              [class.bg-indigo-100]="user.role === 'ADMIN'"
                              [class.text-indigo-800]="user.role === 'ADMIN'"
                              [class.bg-emerald-100]="user.role === 'STORE_OWNER'"
                              [class.text-emerald-800]="user.role === 'STORE_OWNER'"
                              [class.bg-sky-100]="user.role === 'USER'"
                              [class.text-sky-800]="user.role === 'USER'"
                            >
                              <span class="material-symbols-outlined text-[13px]">
                                @if (user.role === 'ADMIN') { admin_panel_settings }
                                @else if (user.role === 'STORE_OWNER') { storefront }
                                @else { person }
                              </span>
                              <span>{{ user.role }}</span>
                            </span>
                          </td>

                          <!-- Actions column -->
                          <td class="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              (click)="inspectUser.set(user); $event.stopPropagation()"
                              class="px-2.5 py-1 text-xs font-semibold text-[#3525cd] hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Inspection Drawer (4 Cols) -->
              <div class="lg:col-span-4 bg-white rounded-2xl border border-[#eaedff] shadow-xs p-6 flex flex-col gap-5 sticky top-20">
                <div class="flex items-center justify-between border-b border-[#eaedff] pb-3">
                  <h3 class="text-sm font-bold text-[#131b2e] flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base text-[#3525cd]">manage_accounts</span>
                    <span>User Details (Inspection Mode)</span>
                  </h3>
                  <span class="text-[10px] font-mono text-[#777587]">
                    ID: {{ selectedUser().id }}
                  </span>
                </div>

                <!-- User Profile Header -->
                <div class="flex items-center gap-4">
                  <img
                    [src]="selectedUser().avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w'"
                    [alt]="selectedUser().name"
                    class="w-14 h-14 rounded-2xl object-cover border-2 border-[#eaedff] shadow-xs shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div>
                    <h4 class="text-sm font-bold text-[#131b2e]">{{ selectedUser().name }}</h4>
                    <p class="text-xs text-[#777587]">{{ selectedUser().email }}</p>
                    <div class="mt-1.5 flex items-center gap-2">
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        [class.bg-indigo-100]="selectedUser().role === 'ADMIN'"
                        [class.text-indigo-800]="selectedUser().role === 'ADMIN'"
                        [class.bg-emerald-100]="selectedUser().role === 'STORE_OWNER'"
                        [class.text-emerald-800]="selectedUser().role === 'STORE_OWNER'"
                        [class.bg-sky-100]="selectedUser().role === 'USER'"
                        [class.text-sky-800]="selectedUser().role === 'USER'"
                      >
                        {{ selectedUser().role }}
                      </span>
                      <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[12px]">verified</span>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Physical Address -->
                <div class="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff]">
                  <span class="text-[10px] font-bold text-[#777587] uppercase tracking-wider block mb-1">
                    Physical Address
                  </span>
                  <p class="text-xs text-[#131b2e] leading-relaxed">
                    {{ selectedUser().address }}
                  </p>
                </div>

                <!-- If Store Owner: Assigned Store Details -->
                @if (selectedUser().role === 'STORE_OWNER') {
                  <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                        Designated Storefront
                      </span>
                      <span class="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        STR-8834
                      </span>
                    </div>
                    <p class="text-xs font-bold text-[#131b2e]">
                      {{ selectedUser().storeName || 'QuickBite Mart' }}
                    </p>
                    <div class="mt-2 flex items-center justify-between text-xs">
                      <span class="text-[#777587]">Public Store Rating:</span>
                      <span class="font-bold text-[#131b2e] flex items-center gap-1">
                        <span class="material-symbols-outlined text-amber-500 text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                        4.6 / 5.0 (128 reviews)
                      </span>
                    </div>
                  </div>
                }

                <!-- Role Modification Controls -->
                <div class="flex flex-col gap-2">
                  <label for="changeRole" class="text-xs font-semibold text-[#131b2e]">Update Access Level</label>
                  <div class="flex items-center gap-2">
                    <select
                      id="changeRole"
                      [value]="selectedUser().role"
                      (change)="updateUserRole($any($event.target).value)"
                      class="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none bg-white"
                    >
                      <option value="USER">USER (Normal Shopper)</option>
                      <option value="STORE_OWNER">STORE_OWNER (Retail Manager)</option>
                      <option value="ADMIN">ADMIN (System IAM)</option>
                    </select>
                  </div>
                </div>

                <!-- Simulation & Session Switch -->
                <div class="pt-2 border-t border-[#eaedff] flex flex-col gap-2">
                  <button
                    type="button"
                    (click)="service.setCurrentUser(selectedUser())"
                    class="w-full py-2 px-3 text-xs font-semibold text-[#3525cd] bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-base">swap_horiz</span>
                    <span>Impersonate / Switch to this User</span>
                  </button>

                  <button
                    type="button"
                    (click)="service.showToast('info', 'Credential Reset', 'Reset link dispatched to ' + selectedUser().email)"
                    class="w-full py-2 px-3 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-xl border border-[#eaedff] transition-colors"
                  >
                    Send Password Reset Link
                  </button>
                </div>
              </div>
            </div>

            <!-- Informational Framework Footer -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-white rounded-xl border border-[#eaedff]">
                <h4 class="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-sm text-[#3525cd]">verified_user</span>
                  <span>Role-Based Access Control</span>
                </h4>
                <p class="text-[11px] text-[#777587]">
                  Users have strict boundaries: Shoppers can only rate; Store Owners can view ratings for their storefront; Admins have IAM supervision.
                </p>
              </div>

              <div class="p-4 bg-white rounded-xl border border-[#eaedff]">
                <h4 class="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-sm text-emerald-600">analytics</span>
                  <span>Rating Aggregation Pipeline</span>
                </h4>
                <p class="text-[11px] text-[#777587]">
                  Ratings feed directly into arithmetic and Bayesian means with real-time recalculation upon edit or submission.
                </p>
              </div>

              <div class="p-4 bg-white rounded-xl border border-[#eaedff]">
                <h4 class="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-sm text-purple-600">history</span>
                  <span>Audit Trail Logging</span>
                </h4>
                <p class="text-[11px] text-[#777587]">
                  Every role assignment, onboarding event, and evaluation update is cryptographically signed and archived.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

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
                  <h3 class="text-base font-bold text-[#131b2e]">Add New System User</h3>
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

            <form [formGroup]="newUserForm" (ngSubmit)="submitNewUser()" class="p-6 flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="newUserName" class="text-xs font-semibold text-[#131b2e]">Full Name (Min 20 chars)</label>
                <input
                  id="newUserName"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Katherine Elizabeth Vance"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="newUserEmail" class="text-xs font-semibold text-[#131b2e]">Email Address</label>
                <input
                  id="newUserEmail"
                  type="email"
                  formControlName="email"
                  placeholder="katherine.vance@storepulse.io"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="newUserRole" class="text-xs font-semibold text-[#131b2e]">Assigned Role</label>
                <select
                  id="newUserRole"
                  formControlName="role"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                >
                  <option value="USER">USER (Shopper Reviewer)</option>
                  <option value="STORE_OWNER">STORE_OWNER (Retail Manager)</option>
                  <option value="ADMIN">ADMIN (System IAM Privilege)</option>
                </select>
              </div>

              @if (newUserForm.value.role === 'STORE_OWNER') {
                <div class="flex flex-col gap-1.5">
                  <label for="newStoreName" class="text-xs font-semibold text-[#131b2e]">Designated Storefront Name</label>
                  <input
                    id="newStoreName"
                    type="text"
                    formControlName="storeName"
                    placeholder="e.g. Vance Gourmet Patisserie"
                    class="w-full px-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none"
                  />
                </div>
              }

              <div class="flex flex-col gap-1.5">
                <label for="newUserAddress" class="text-xs font-semibold text-[#131b2e]">Physical Address</label>
                <textarea
                  id="newUserAddress"
                  rows="2"
                  formControlName="address"
                  placeholder="Street, City, Zip..."
                  class="w-full p-3 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] outline-none resize-none"
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
export class Users {
  readonly service = inject(StorePulseService);

  readonly filterName = signal('');
  readonly filterEmail = signal('');
  readonly filterAddress = signal('');
  readonly filterRole = signal<string>('ALL');

  readonly sortField = signal<'name' | 'role'>('name');
  readonly sortAsc = signal(true);

  readonly inspectUser = signal<User | null>(null);
  readonly showAddUserModal = signal(false);

  readonly selectedUser = computed(() => {
    return this.inspectUser() || this.service.users()[1] || this.service.users()[0];
  });

  readonly ownerCount = computed(() => this.service.users().filter(u => u.role === 'STORE_OWNER').length);
  readonly normalCount = computed(() => this.service.users().filter(u => u.role === 'USER').length);
  readonly adminCount = computed(() => this.service.users().filter(u => u.role === 'ADMIN').length);

  readonly filteredUsers = computed(() => {
    let list = this.service.users();
    const nameTerm = this.filterName().toLowerCase().trim();
    const emailTerm = this.filterEmail().toLowerCase().trim();
    const addrTerm = this.filterAddress().toLowerCase().trim();
    const roleTerm = this.filterRole();

    if (nameTerm) {
      list = list.filter(u => u.name.toLowerCase().includes(nameTerm));
    }
    if (emailTerm) {
      list = list.filter(u => u.email.toLowerCase().includes(emailTerm));
    }
    if (addrTerm) {
      list = list.filter(u => u.address.toLowerCase().includes(addrTerm));
    }
    if (roleTerm !== 'ALL') {
      list = list.filter(u => u.role === roleTerm);
    }

    const field = this.sortField();
    const asc = this.sortAsc();
    return [...list].sort((a, b) => {
      const valA = a[field].toLowerCase();
      const valB = b[field].toLowerCase();
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  });

  readonly newUserForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl<UserRole>('USER', [Validators.required]),
    storeName: new FormControl(''),
    address: new FormControl('', [Validators.required, Validators.maxLength(400)])
  });

  clearFilters() {
    this.filterName.set('');
    this.filterEmail.set('');
    this.filterAddress.set('');
    this.filterRole.set('ALL');
  }

  toggleSort(field: 'name' | 'role') {
    if (this.sortField() === field) {
      this.sortAsc.set(!this.sortAsc());
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
  }

  updateUserRole(newRole: string) {
    const user = this.selectedUser();
    if (!user) return;
    this.service.users.update(cur =>
      cur.map(u => (u.id === user.id ? { ...u, role: newRole as UserRole } : u))
    );
    this.service.showToast('success', 'Privilege Updated', `Assigned role ${newRole} to ${user.name}`);
  }

  submitNewUser() {
    if (this.newUserForm.invalid) {
      this.service.showToast('error', 'Form Error', 'Please check minimum name length (20 characters) and required fields.');
      return;
    }
    const val = this.newUserForm.value;
    const added = this.service.addUser({
      name: val.name || '',
      email: val.email || '',
      role: (val.role as UserRole) || 'USER',
      address: val.address || '',
      storeName: val.storeName || undefined,
      twoFactorEnabled: true
    });
    this.inspectUser.set(added);
    this.showAddUserModal.set(false);
    this.newUserForm.reset({ role: 'USER' });
  }
}
