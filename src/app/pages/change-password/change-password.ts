import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, Navbar, Sidebar],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <app-navbar [breadcrumb]="'Change Password'"></app-navbar>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <div class="max-w-4xl mx-auto flex flex-col gap-6">

            <!-- Breadcrumbs and Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-xs text-[#777587] mb-1">
                  <span>Account Settings</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span class="text-[#131b2e] font-medium">Change Password</span>
                </div>
                <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">Account Security & Credentials</h1>
                <p class="text-xs text-[#777587] mt-0.5">
                  Manage your authentication passkeys, credentials, and token-level session security.
                </p>
              </div>

              <!-- Perspective switch pill -->
              <div class="flex items-center gap-2 text-xs">
                <span class="text-[#777587]">View as:</span>
                <span class="font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-[#3525cd] border border-indigo-200">
                  {{ service.currentUser().name }} ({{ service.currentRole() }})
                </span>
              </div>
            </div>

            <!-- Profile Overview Card -->
            <div class="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-xs flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <img
                  [src]="service.currentUser().avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqLJM0nR1jwMMfF2dbnN1_Y8xqZxLshMDUKo4_WOshGYNMTQlM2J47OPs-1O7yyG8uzqE8Bz-f1z27o25VCP3xkvvhLRlDCZhjUlpLub5OTS5mCS2OLygxr2H00R0VtSROm5oh96I2a2nDhih4IpZVlhWRtIrcqXEwDGrHYBZplTeeEiaoqJV0jPMXIgfBmHMZn-GdXiGLG7QdKYLM5YP6QDKRKILih97AoYe98nTfZCH_eHceVfhN1w'"
                  [alt]="service.currentUser().name"
                  class="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs"
                  referrerpolicy="no-referrer"
                />
                <div>
                  <h3 class="text-base font-bold text-[#131b2e]">{{ service.currentUser().name }}</h3>
                  <p class="text-xs text-[#777587]">{{ service.currentUser().email }}</p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {{ service.currentRole() }}
                    </span>
                    <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      2-Factor Authentication Enabled
                    </span>
                  </div>
                </div>
              </div>

              <div class="hidden sm:block text-right text-xs text-[#777587]">
                <span>Last credential rotation:</span>
                <strong class="text-[#131b2e] block">34 days ago</strong>
              </div>
            </div>

            <!-- Change Password Form Card -->
            <div class="bg-white p-8 rounded-2xl border border-[#eaedff] shadow-xs">
              <div class="border-b border-[#eaedff] pb-4 mb-6">
                <h2 class="text-base font-bold text-[#131b2e]">Rotate Account Passkey</h2>
                <p class="text-xs text-[#777587] mt-0.5">
                  Update your workstation password. Upon successful update, all secondary active sessions will require re-authentication.
                </p>
              </div>

              <form [formGroup]="passwordForm" (ngSubmit)="handlePasswordUpdate()" class="flex flex-col gap-5">
                <!-- Current Password -->
                <div class="flex flex-col gap-1.5 max-w-md">
                  <label for="currentPassword" class="text-xs font-semibold text-[#131b2e] flex items-center justify-between">
                    <span>Current Password</span>
                    <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">key</span>
                    <input
                      id="currentPassword"
                      [type]="showCurrent() ? 'text' : 'password'"
                      formControlName="currentPassword"
                      placeholder="••••••••••••"
                      class="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                    <button
                      type="button"
                      (click)="showCurrent.set(!showCurrent())"
                      class="absolute right-3 top-2.5 text-[#777587] hover:text-[#131b2e]"
                    >
                      <span class="material-symbols-outlined text-lg">
                        {{ showCurrent() ? 'visibility_off' : 'visibility' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- New Password & Confirm Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- New Password -->
                  <div class="flex flex-col gap-1.5">
                    <label for="newPassword" class="text-xs font-semibold text-[#131b2e] flex items-center justify-between">
                      <span>New Passkey</span>
                      <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">lock</span>
                      <input
                        id="newPassword"
                        [type]="showNew() ? 'text' : 'password'"
                        formControlName="newPassword"
                        placeholder="8-16 characters"
                        class="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                      <button
                        type="button"
                        (click)="showNew.set(!showNew())"
                        class="absolute right-3 top-2.5 text-[#777587] hover:text-[#131b2e]"
                      >
                        <span class="material-symbols-outlined text-lg">
                          {{ showNew() ? 'visibility_off' : 'visibility' }}
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="flex flex-col gap-1.5">
                    <label for="confirmNewPassword" class="text-xs font-semibold text-[#131b2e] flex items-center justify-between">
                      <span>Confirm New Passkey</span>
                      @if (passwordsMatch() && passwordForm.controls.confirmNewPassword.value) {
                        <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">MATCH</span>
                      } @else if (passwordForm.controls.confirmNewPassword.value) {
                        <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">MISMATCH</span>
                      }
                    </label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#777587]">lock_reset</span>
                      <input
                        id="confirmNewPassword"
                        [type]="showConfirm() ? 'text' : 'password'"
                        formControlName="confirmNewPassword"
                        placeholder="Repeat new passkey"
                        class="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                      <button
                        type="button"
                        (click)="showConfirm.set(!showConfirm())"
                        class="absolute right-3 top-2.5 text-[#777587] hover:text-[#131b2e]"
                      >
                        <span class="material-symbols-outlined text-lg">
                          {{ showConfirm() ? 'visibility_off' : 'visibility' }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Entropy & Policy Checklist -->
                <div class="p-4 bg-[#f2f3ff] rounded-2xl border border-[#eaedff] flex flex-col gap-3">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-[#131b2e]">Credential Security Rules:</span>
                    <span
                      class="text-[10px] font-bold px-2 py-0.5 rounded"
                      [class.bg-emerald-100]="hasLength() && hasUppercase() && hasSpecial()"
                      [class.text-emerald-800]="hasLength() && hasUppercase() && hasSpecial()"
                      [class.bg-amber-100]="!hasLength() || !hasUppercase() || !hasSpecial()"
                      [class.text-amber-800]="!hasLength() || !hasUppercase() || !hasSpecial()"
                    >
                      {{ (hasLength() && hasUppercase() && hasSpecial()) ? 'STRONG PASSPHRASE' : 'REQUIREMENTS PENDING' }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div class="flex items-center gap-1.5" [class.text-emerald-700]="hasLength()" [class.text-[#777587]]="!hasLength()">
                      <span class="material-symbols-outlined text-base">
                        {{ hasLength() ? 'check_circle' : 'radio_button_unchecked' }}
                      </span>
                      <span>8 to 16 Characters</span>
                    </div>

                    <div class="flex items-center gap-1.5" [class.text-emerald-700]="hasUppercase()" [class.text-[#777587]]="!hasUppercase()">
                      <span class="material-symbols-outlined text-base">
                        {{ hasUppercase() ? 'check_circle' : 'radio_button_unchecked' }}
                      </span>
                      <span>1 Uppercase Letter</span>
                    </div>

                    <div class="flex items-center gap-1.5" [class.text-emerald-700]="hasSpecial()" [class.text-[#777587]]="!hasSpecial()">
                      <span class="material-symbols-outlined text-base">
                        {{ hasSpecial() ? 'check_circle' : 'radio_button_unchecked' }}
                      </span>
                      <span>1 Special Character</span>
                    </div>
                  </div>
                </div>

                <!-- Form Action Buttons -->
                <div class="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    (click)="passwordForm.reset()"
                    class="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-xl transition-colors"
                  >
                    Reset Fields
                  </button>

                  <button
                    type="submit"
                    [disabled]="loading()"
                    class="px-6 py-2.5 text-xs font-semibold text-white bg-[#3525cd] hover:bg-[#2b1ea7] rounded-xl shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    @if (loading()) {
                      <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Re-encrypting Hash...</span>
                    } @else {
                      <span class="material-symbols-outlined text-base">verified_user</span>
                      <span>Update Password</span>
                    }
                  </button>
                </div>
              </form>
            </div>

            <!-- Security Framework Notice -->
            <div class="p-4 bg-white rounded-2xl border border-[#eaedff] shadow-xs flex items-center justify-between text-xs text-[#777587]">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#3525cd] text-base">lock</span>
                <span>SHA-256 + bcrypt 10 salting rounds applied on all authentication tokens.</span>
              </div>
              <span class="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Zero Trust Active
              </span>
            </div>

          </div>
        </main>
      </div>
    </div>
  `
})
export class ChangePassword {
  readonly service = inject(StorePulseService);

  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);
  readonly loading = signal(false);

  readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    confirmNewPassword: new FormControl('', [Validators.required])
  });

  readonly hasLength = computed(() => {
    const p = this.passwordForm.value.newPassword || '';
    return p.length >= 8 && p.length <= 16;
  });

  readonly hasUppercase = computed(() => {
    const p = this.passwordForm.value.newPassword || '';
    return /[A-Z]/.test(p);
  });

  readonly hasSpecial = computed(() => {
    const p = this.passwordForm.value.newPassword || '';
    return /[^A-Za-z0-9]/.test(p);
  });

  readonly passwordsMatch = computed(() => {
    const p = this.passwordForm.value.newPassword || '';
    const cp = this.passwordForm.value.confirmNewPassword || '';
    return p === cp && p.length > 0;
  });

  handlePasswordUpdate() {
    if (this.passwordForm.invalid || !this.hasLength() || !this.hasUppercase() || !this.hasSpecial() || !this.passwordsMatch()) {
      this.service.showToast('error', 'Validation Error', 'New password must satisfy all 8-16 chars, uppercase, and special char policies.');
      return;
    }

    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.service.showToast('success', 'Passkey Rotated', 'Password updated successfully. Cryptographic salt regenerated.');
      this.passwordForm.reset();
    }, 700);
  }
}
