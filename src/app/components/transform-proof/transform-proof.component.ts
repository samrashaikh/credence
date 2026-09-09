import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EvidenceVaultService } from '../../services/evidence-vault.service';

@Component({
  selector: 'app-transform-proof',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="w-full space-y-6 pb-20">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <a
              routerLink="/vault"
              class="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <svg
                class="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Evidence Vault
            </a>
            <span class="text-slate-600">/</span>
            <!-- <span class="text-xs font-bold text-blue-400 font-mono">CAPTURE_PROOF</span> -->
            <span class="text-xs font-bold text-blue-400 font-mono">Transform Proof</span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            Transform Primary Career Proof
          </h1>
          <p class="text-xs text-slate-300">
            Choose evidence you want to turn into grounded career content.
          </p>
        </div>
      </div>

      @if (eligibleArtifacts().length > 0) {
        <div class="space-y-3">
          @for (art of eligibleArtifacts(); track art.id) {
            <div
              class="flex items-center justify-between gap-6
                     bg-slate-800/60 border border-slate-700
                     rounded-xl px-5 py-4"
            >
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-white truncate">
                  {{ art.title }}
                </h3>

                <div
                  class="flex items-center gap-2 mt-1
                            text-xs text-slate-400"
                >
                  <span>{{ art.organization }}</span>

                  <span class="text-slate-600">•</span>

                  <span>{{ art.userRole }}</span>
                </div>
              </div>

              <a
                [routerLink]="['/transform', art.id]"
                class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/20 transition-all flex items-center gap-1.5"
              >
                <svg
                  class="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M4.93 19.07l2.83-2.83" />
                  <path d="M16.24 7.76l2.83-2.83" />
                </svg>
                <span>Transform</span>
              </a>
            </div>
          }
        </div>
      } @else {
        <div
          class="text-center py-14 px-6
                 bg-slate-800/50
                 border border-slate-700
                 rounded-xl"
        >
          <h3 class="text-base font-semibold text-white">No evidence ready to transform</h3>

          <p class="text-sm text-slate-400 mt-2 mb-5">
            Capture proof and extract an Evidence Profile first.
          </p>

          <a
            routerLink="/upload"
            class="inline-flex items-center
                   px-4 py-2 rounded-lg
                   bg-blue-600 hover:bg-blue-500
                   text-white text-xs font-bold
                   transition-colors gap-2"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Capture Proof
          </a>
        </div>
      }
    </div>
  `,
})
export class TransformProofComponent {
  vaultService = inject(EvidenceVaultService);

  eligibleArtifacts = computed(() =>
    this.vaultService.artifacts().filter((artifact) => Boolean(artifact.profile)),
  );
}
