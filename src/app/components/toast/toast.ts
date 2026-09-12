import { Component, inject } from '@angular/core';
import { StorePulseService } from '../../services/store-pulse.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
      @for (toast of service.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0"
          [class.bg-emerald-950]="toast.type === 'success'"
          [class.border-emerald-700]="toast.type === 'success'"
          [class.text-emerald-100]="toast.type === 'success'"
          [class.bg-blue-950]="toast.type === 'info'"
          [class.border-blue-700]="toast.type === 'info'"
          [class.text-blue-100]="toast.type === 'info'"
          [class.bg-rose-950]="toast.type === 'error'"
          [class.border-rose-700]="toast.type === 'error'"
          [class.text-rose-100]="toast.type === 'error'"
          [class.bg-amber-950]="toast.type === 'warning'"
          [class.border-amber-700]="toast.type === 'warning'"
          [class.text-amber-100]="toast.type === 'warning'"
        >
          <span class="material-symbols-outlined text-xl shrink-0 mt-0.5">
            @if (toast.type === 'success') { check_circle }
            @else if (toast.type === 'info') { info }
            @else if (toast.type === 'error') { error }
            @else { warning }
          </span>
          <div class="flex-1 text-sm">
            <h4 class="font-semibold leading-tight text-white">{{ toast.title }}</h4>
            <p class="text-xs opacity-90 mt-0.5">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            (click)="service.removeToast(toast.id)"
            class="text-white/70 hover:text-white p-1 transition-colors"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class Toast {
  readonly service = inject(StorePulseService);
}
