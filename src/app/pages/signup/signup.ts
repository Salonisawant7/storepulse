import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <div class="h-1 bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#39b8fd]"></div>

      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div class="w-full max-w-xl bg-white rounded-2xl shadow-xl shadow-indigo-500/5 border border-[#eaedff] overflow-hidden transition-all my-6">
          <!-- Card Header & Badge -->
          <div class="p-8 pb-6 border-b border-[#eaedff] bg-gradient-to-b from-[#f2f3ff]/60 to-white text-center">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 mb-3">
              <span class="material-symbols-outlined text-sm">badge</span>
              <span>ROLE: NORMAL_USER ASSIGNED</span>
            </div>

            <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">Create your Account</h1>
            <p class="text-xs text-[#777587] mt-1.5 max-w-md mx-auto">
              Create your Normal User Account. (Roles are assigned automatically as Normal User for public registration).
            </p>
          </div>

          <!-- Form -->
          <form [formGroup]="signupForm" (ngSubmit)="handleSignup()" class="p-8 flex flex-col gap-4">
            <!-- Full Name with 20-60 character requirement -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-xs font-semibold text-[#131b2e]">
                <label for="name" class="flex items-center gap-1">
                  <span>Full Legal Name</span>
                  <span class="text-rose-500">*</span>
                </label>
                <span
                  class="text-[11px] font-mono"
                  [class.text-rose-600]="nameLength() < 20 || nameLength() > 60"
                  [class.text-emerald-600]="nameLength() >= 20 && nameLength() <= 60"
                >
                  {{ nameLength() }}/60 chars (Min 20)
                </span>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#777587]">person</span>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Jonathan Alexander Sterling"
                  class="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  [class.border-rose-400]="signupForm.controls.name.touched && (nameLength() < 20 || nameLength() > 60)"
                  [class.border-emerald-500]="nameLength() >= 20 && nameLength() <= 60"
                />
                @if (nameLength() >= 20 && nameLength() <= 60) {
                  <span class="material-symbols-outlined absolute right-3 top-2.5 text-emerald-600 text-lg">check_circle</span>
                }
              </div>
              <p class="text-[11px] text-[#777587]">Must be between 20 and 60 characters.</p>
            </div>

            <!-- Email Address -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-xs font-semibold text-[#131b2e]">
                <label for="email" class="flex items-center gap-1">
                  <span>Email Address</span>
                  <span class="text-rose-500">*</span>
                </label>
                <span class="text-[11px] text-[#777587]">RFC 5322 Standard</span>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#777587]">mail</span>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="jonathan.sterling@enterprise.org"
                  class="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  [class.border-emerald-500]="signupForm.controls.email.valid && signupForm.controls.email.value"
                />
                @if (signupForm.controls.email.valid && signupForm.controls.email.value) {
                  <span class="material-symbols-outlined absolute right-3 top-2.5 text-emerald-600 text-lg">check_circle</span>
                }
              </div>
            </div>

            <!-- Full Residential Address (max 400 chars) -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-xs font-semibold text-[#131b2e]">
                <label for="address" class="flex items-center gap-1">
                  <span>Full Physical / Residential Address</span>
                  <span class="text-rose-500">*</span>
                </label>
                <span
                  class="text-[11px] font-mono"
                  [class.text-rose-600]="addressLength() > 400 || addressLength() === 0"
                  [class.text-emerald-600]="addressLength() > 0 && addressLength() <= 400"
                >
                  {{ addressLength() }}/400 chars
                </span>
              </div>
              <div class="relative">
                <textarea
                  id="address"
                  rows="3"
                  formControlName="address"
                  placeholder="e.g. 742 Evergreen Terrace, Springfield, Oregon 97477, United States"
                  class="w-full p-3 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                  [class.border-emerald-500]="addressLength() > 0 && addressLength() <= 400"
                ></textarea>
              </div>
              <p class="text-[11px] text-[#777587]">Used for local retail geofencing and verified shopper audits (Max 400 chars).</p>
            </div>

            <!-- Password and Confirm Password Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Password -->
              <div class="flex flex-col gap-1.5">
                <label for="password" class="text-xs font-semibold text-[#131b2e] flex items-center gap-1">
                  <span>Password</span>
                  <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="8-16 chars"
                    class="w-full pl-3 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="absolute right-3 top-2.5 text-[#777587] hover:text-[#131b2e]"
                  >
                    <span class="material-symbols-outlined text-lg">
                      {{ showPassword() ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="flex flex-col gap-1.5">
                <label for="confirmPassword" class="text-xs font-semibold text-[#131b2e] flex items-center justify-between">
                  <span>Confirm Password</span>
                  @if (passwordMatch() && signupForm.controls.confirmPassword.value) {
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">MATCH</span>
                  } @else if (signupForm.controls.confirmPassword.value) {
                    <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">MISMATCH</span>
                  }
                </label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    [type]="showConfirmPassword() ? 'text' : 'password'"
                    formControlName="confirmPassword"
                    placeholder="Repeat password"
                    class="w-full pl-3 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    (click)="showConfirmPassword.set(!showConfirmPassword())"
                    class="absolute right-3 top-2.5 text-[#777587] hover:text-[#131b2e]"
                  >
                    <span class="material-symbols-outlined text-lg">
                      {{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Password Policy Checklist -->
            <div class="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff] flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-[#131b2e] uppercase tracking-wider">
                  Password Security Policy:
                </span>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded"
                  [class.bg-emerald-100]="hasMinLength() && hasUppercase() && hasSpecial()"
                  [class.text-emerald-800]="hasMinLength() && hasUppercase() && hasSpecial()"
                  [class.bg-amber-100]="!hasMinLength() || !hasUppercase() || !hasSpecial()"
                  [class.text-amber-800]="!hasMinLength() || !hasUppercase() || !hasSpecial()"
                >
                  {{ (hasMinLength() && hasUppercase() && hasSpecial()) ? 'STRONG' : 'REQUIRES ATTENTION' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div class="flex items-center gap-1.5" [class.text-emerald-700]="hasMinLength()" [class.text-[#777587]]="!hasMinLength()">
                  <span class="material-symbols-outlined text-base">
                    {{ hasMinLength() ? 'check_circle' : 'radio_button_unchecked' }}
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

            <!-- Terms agreement -->
            <div class="flex items-start gap-2 pt-1 text-xs text-[#464555]">
              <input
                id="terms"
                type="checkbox"
                formControlName="terms"
                class="mt-0.5 rounded text-[#3525cd] focus:ring-indigo-300 w-4 h-4 border-gray-300"
              />
              <label for="terms" class="cursor-pointer select-none leading-relaxed">
                I verify that my full name and residential address are accurate for verified community evaluations and accept the StorePulse Fair Rating Charter.
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading()"
              class="w-full mt-2 py-3 px-4 bg-[#3525cd] hover:bg-[#2b1ea7] text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              @if (loading()) {
                <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Generating Security Keys & Provisioning...</span>
              } @else {
                <span class="material-symbols-outlined text-lg">person_add</span>
                <span>Create Normal User Account</span>
              }
            </button>

            <!-- Back to Login -->
            <div class="text-center pt-1 text-xs text-[#464555]">
              <span>Already registered? </span>
              <a routerLink="/login" class="text-[#3525cd] font-semibold hover:underline">
                Sign in to existing terminal
              </a>
            </div>
          </form>

          <!-- API & Backend Spec Card -->
          <div class="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#464555]">
            <div class="flex items-center gap-2">
              <span class="font-mono text-[#3525cd] font-bold">POST /api/auth/signup</span>
              <span class="text-[#777587]">•</span>
              <span>bcrypt cost: 10</span>
            </div>
            <span class="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
              RL: 5 req/min
            </span>
          </div>
        </div>
      </main>

      <footer class="text-center py-4 text-xs text-[#777587] border-t border-[#eaedff]">
        StorePulse Security IAM &copy; 2026. Automated Role Provisioning Layer.
      </footer>
    </div>
  `
})
export class Signup {
  readonly service = inject(StorePulseService);
  readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly loading = signal(false);

  readonly signupForm = new FormGroup({
    name: new FormControl('Jonathan Alexander Sterling', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(60)
    ]),
    email: new FormControl('jonathan.sterling@consumerhub.org', [
      Validators.required,
      Validators.email
    ]),
    address: new FormControl('742 Evergreen Terrace, Springfield, OR 97477, United States', [
      Validators.required,
      Validators.maxLength(400)
    ]),
    password: new FormControl('SterlingPass#2026', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16)
    ]),
    confirmPassword: new FormControl('SterlingPass#2026', [
      Validators.required
    ]),
    terms: new FormControl(true, [Validators.requiredTrue])
  });

  readonly nameLength = computed(() => this.signupForm.value.name?.length || 0);
  readonly addressLength = computed(() => this.signupForm.value.address?.length || 0);

  readonly hasMinLength = computed(() => {
    const p = this.signupForm.value.password || '';
    return p.length >= 8 && p.length <= 16;
  });

  readonly hasUppercase = computed(() => {
    const p = this.signupForm.value.password || '';
    return /[A-Z]/.test(p);
  });

  readonly hasSpecial = computed(() => {
    const p = this.signupForm.value.password || '';
    return /[^A-Za-z0-9]/.test(p);
  });

  readonly passwordMatch = computed(() => {
    const p = this.signupForm.value.password || '';
    const cp = this.signupForm.value.confirmPassword || '';
    return p === cp && p.length > 0;
  });

  handleSignup() {
    if (this.signupForm.invalid || !this.hasMinLength() || !this.hasUppercase() || !this.hasSpecial() || !this.passwordMatch()) {
      this.service.showToast('error', 'Validation Error', 'Please satisfy all name (20-60 chars), address, and password requirements.');
      return;
    }

    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      const newUser = this.service.addUser({
        name: this.signupForm.value.name || '',
        email: this.signupForm.value.email || '',
        address: this.signupForm.value.address || '',
        role: 'USER',
        twoFactorEnabled: false
      });

      this.service.setCurrentUser(newUser);
      this.service.showToast('success', 'Account Created', `Welcome to StorePulse, ${newUser.name}! Your role is NORMAL_USER.`);
      this.router.navigate(['/directory']);
    }, 800);
  }
}
