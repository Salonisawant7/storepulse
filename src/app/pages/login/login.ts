import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorePulseService, UserRole } from '../../services/store-pulse.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#faf8ff] flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      <!-- Top subtle bar -->
      <div class="h-1 bg-gradient-to-r from-[#3525cd] via-[#006591] to-[#39b8fd]"></div>

      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-indigo-500/5 border border-[#eaedff] overflow-hidden transition-all">
          <!-- Card Header & Branding -->
          <div class="p-8 pb-6 border-b border-[#eaedff] bg-gradient-to-b from-[#f2f3ff]/60 to-white text-center relative">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3525cd] to-[#4f46e5] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1UAXqDmUs1oeNqBMEmrGLa62vgjRJfGghFhzIPqVQZSChZcq-ze86-BPpFmFPi2oO5377WGbw1D3owwTlMAh7wPgc-ZloSr4SPqZNYdJVg0moLIkEM7LUHFKljOi7OvPbY8sDBjtGACxibKD-EcxDnsVsZ-opDbZK9M_m6bAJXE-R1o3pM4s5ze6gADG96zVNb8153fwL6WV2U_IiXzuOB1Mej0_aRWa9HUpsUwILucrVQ4RHxIvro6lSo"
                alt="StorePulse"
                class="w-10 h-10 object-contain filter brightness-0 invert"
                referrerpolicy="no-referrer"
              />
            </div>
            <h1 class="text-2xl font-bold text-[#131b2e] tracking-tight">StorePulse Enterprise</h1>
            <p class="text-xs text-[#777587] mt-1.5 max-w-xs mx-auto">
              Unified secure access gateway across all system domains & role telemetry
            </p>

            <!-- Role Permissions dynamic notification -->
            <div class="mt-4 p-2.5 rounded-xl bg-[#eaedff]/60 border border-[#dae2fd] text-[11px] text-[#464555] flex items-start gap-2 text-left">
              <span class="material-symbols-outlined text-sm text-[#3525cd] shrink-0 mt-0.5">verified_user</span>
              <span>
                <strong class="text-[#131b2e]">Role Permissions:</strong> System directs you automatically to Admin, Store Owner, or Shopper workspace.
              </span>
            </div>
          </div>

          <!-- Quick Test Credentials Fill -->
          <div class="px-8 pt-5 pb-1">
            <p class="text-[11px] font-bold text-[#777587] uppercase tracking-wider mb-2">
              Fast Demo Credential Switcher:
            </p>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                (click)="fillPreset('ADMIN')"
                class="px-2 py-2 rounded-lg text-xs font-semibold border transition-all text-center flex flex-col items-center gap-0.5"
                [class.border-[#3525cd]]="selectedPreset() === 'ADMIN'"
                [class.bg-indigo-50]="selectedPreset() === 'ADMIN'"
                [class.text-[#3525cd]]="selectedPreset() === 'ADMIN'"
                [class.border-[#eaedff]]="selectedPreset() !== 'ADMIN'"
                [class.text-[#464555]]="selectedPreset() !== 'ADMIN'"
              >
                <span class="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Admin</span>
              </button>

              <button
                type="button"
                (click)="fillPreset('STORE_OWNER')"
                class="px-2 py-2 rounded-lg text-xs font-semibold border transition-all text-center flex flex-col items-center gap-0.5"
                [class.border-emerald-600]="selectedPreset() === 'STORE_OWNER'"
                [class.bg-emerald-50]="selectedPreset() === 'STORE_OWNER'"
                [class.text-emerald-700]="selectedPreset() === 'STORE_OWNER'"
                [class.border-[#eaedff]]="selectedPreset() !== 'STORE_OWNER'"
                [class.text-[#464555]]="selectedPreset() !== 'STORE_OWNER'"
              >
                <span class="material-symbols-outlined text-base">storefront</span>
                <span>Store Owner</span>
              </button>

              <button
                type="button"
                (click)="fillPreset('USER')"
                class="px-2 py-2 rounded-lg text-xs font-semibold border transition-all text-center flex flex-col items-center gap-0.5"
                [class.border-sky-600]="selectedPreset() === 'USER'"
                [class.bg-sky-50]="selectedPreset() === 'USER'"
                [class.text-sky-700]="selectedPreset() === 'USER'"
                [class.border-[#eaedff]]="selectedPreset() !== 'USER'"
                [class.text-[#464555]]="selectedPreset() !== 'USER'"
              >
                <span class="material-symbols-outlined text-base">shopping_bag</span>
                <span>Shopper</span>
              </button>
            </div>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="handleLogin()" class="p-8 pt-4 flex flex-col gap-4">
            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-xs font-semibold text-[#131b2e] flex items-center justify-between">
                <span>Work or Account Email</span>
                <span class="text-[11px] text-[#777587]">RFC 5322</span>
              </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#777587]">mail</span>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="name@domain.com"
                  class="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-xs font-semibold text-[#131b2e]">
                <span>Password</span>
                <a routerLink="/change-password" class="text-[11px] text-[#3525cd] hover:underline">
                  Forgot credentials?
                </a>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#777587]">lock</span>
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-[#c7c4d8] focus:border-[#3525cd] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
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

            <!-- Remember & Options -->
            <div class="flex items-center justify-between text-xs text-[#464555]">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  formControlName="rememberMe"
                  class="rounded text-[#3525cd] focus:ring-indigo-300 w-4 h-4 border-gray-300"
                />
                <span>Remember this terminal</span>
              </label>
              <span class="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                256-bit Encrypted
              </span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading()"
              class="w-full mt-2 py-2.5 px-4 bg-[#3525cd] hover:bg-[#2b1ea7] text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              @if (loading()) {
                <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Verifying Hash...</span>
              } @else {
                <span class="material-symbols-outlined text-lg">login</span>
                <span>Authenticate Session</span>
              }
            </button>

            <!-- Registration Link -->
            <div class="text-center pt-2 text-xs text-[#464555]">
              <span>Need a standard user account? </span>
              <a routerLink="/signup" class="text-[#3525cd] font-semibold hover:underline">
                Register as Normal User
              </a>
            </div>
          </form>

          <!-- Security note -->
          <div class="px-8 py-3 bg-[#f2f3ff]/50 border-t border-[#eaedff] text-[11px] text-[#777587] text-center">
            Role validation via JSON Web Tokens • Zero-trust perimeter active
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="text-center py-4 text-xs text-[#777587] border-t border-[#eaedff]">
        StorePulse Enterprise Platform &copy; 2026. Secure Multi-Stakeholder Evaluation Engine.
      </footer>
    </div>
  `
})
export class Login {
  readonly service = inject(StorePulseService);
  readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly selectedPreset = signal<UserRole>('ADMIN');

  readonly loginForm = new FormGroup({
    email: new FormControl('admin@storerating.com', [Validators.required, Validators.email]),
    password: new FormControl('AdminSecure#2026', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl(true)
  });

  fillPreset(role: UserRole) {
    this.selectedPreset.set(role);
    if (role === 'ADMIN') {
      this.loginForm.patchValue({
        email: 'admin@storerating.com',
        password: 'AdminSecure#2026'
      });
    } else if (role === 'STORE_OWNER') {
      this.loginForm.patchValue({
        email: 'owner@abcstore.com',
        password: 'StoreOwner#2026'
      });
    } else {
      this.loginForm.patchValue({
        email: 'john.doe@example.com',
        password: 'ShopperSecure#2026'
      });
    }
  }

  handleLogin() {
    if (this.loginForm.invalid) {
      this.service.showToast('error', 'Validation Error', 'Please provide a valid email and minimum 8-character password.');
      return;
    }

    this.loading.set(true);
    const email = this.loginForm.value.email?.toLowerCase().trim() || '';

    setTimeout(() => {
      this.loading.set(false);
      // Determine user by email or preset
      let user = this.service.users().find(u => u.email.toLowerCase() === email);
      if (!user) {
        // Find by selected preset
        user = this.service.users().find(u => u.role === this.selectedPreset());
      }

      if (user) {
        this.service.setCurrentUser(user);
        this.service.showToast('success', 'Authentication Successful', `Welcome back, ${user.name}!`);

        if (user.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (user.role === 'STORE_OWNER') {
          this.router.navigate(['/store-analytics']);
        } else {
          this.router.navigate(['/directory']);
        }
      } else {
        this.service.showToast('error', 'Authentication Failed', 'Invalid credentials or user record not found.');
      }
    }, 600);
  }
}
