import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { ArtifactCategory, ProvenanceType } from '../../../types/evidence.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 pb-16">
      <!-- Top Hero / Mission Bento Banner -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/60 to-slate-900 border border-slate-700/50 p-6 sm:p-7 shadow-lg"
      >
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                Ground Truth Engine
              </span>
              <span class="text-xs text-slate-400 font-mono"
                >Gemini 2.5 Flash + SHA-256 Checksum</span
              >
            </div>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Career Evidence & Proof-of-Work Vault
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Capture primary artifacts, extract structured proof profiles with Gemini, and
              transform verified achievements into bullet points where every claim is traceable to
              source lines with human sign-off.
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 shrink-0">
            <a
              routerLink="/upload"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02]"
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
              <span>Capture Proof</span>
            </a>
          </div>
        </div>

        <!-- Grounding Standard Notice -->
        <div
          class="mt-5 pt-3 border-t border-slate-700/50 flex items-start gap-2.5 text-xs text-slate-400"
        >
          <span class="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1"></span>
          <div>
            <span class="text-slate-300 font-semibold">Credence Grounding Standard:</span>
            Bullet claims are strictly grounded in user-provided primary source artifacts (RFCs,
            dashboards, audit reports). Every metric is mapped to verifiable line references.
          </div>
        </div>
      </div>

      <!-- High-Level Vault Statistics Bento Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Preserved Artifacts Bento Card -->
        <div
          class="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden"
        >
          <div
            class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex justify-between items-center"
          >
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >Preserved Artifacts</span
            >
            <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono"
              >SECURE</span
            >
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between bg-slate-900/30">
            <div class="text-2xl font-bold font-mono text-white">
              {{ vaultService.vaultStats().totalArtifacts }}
            </div>
            <div class="flex items-center gap-2 mt-2 text-[11px]">
              <span class="text-emerald-400 font-medium font-mono"
                >{{ vaultService.vaultStats().sourceBackedCount }} Source</span
              >
              <span class="text-slate-600">•</span>
              <span class="text-amber-400 font-medium font-mono"
                >{{ vaultService.vaultStats().selfReportedCount }} Self-Report</span
              >
            </div>
          </div>
        </div>

        <!-- Gemini Profiles Bento Card -->
        <div
          class="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden"
        >
          <div
            class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex justify-between items-center"
          >
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
                >Gemini Extraction</span
              >
            </div>
            <span class="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded font-mono"
              >2.5 Flash</span
            >
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between bg-slate-900/30">
            <div class="text-2xl font-bold font-mono text-purple-300">
              {{ vaultService.vaultStats().totalExtractedProfiles }} Profiles
            </div>
            <div class="text-[11px] text-slate-400 mt-1">Structured Action & Metric Pairs</div>
          </div>
        </div>

        <!-- Human Approved Bullets Bento Card -->
        <div
          class="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden"
        >
          <div
            class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex justify-between items-center"
          >
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >Review Status</span
            >
            @if (vaultService.vaultStats().pendingReviewCount > 0) {
              <span
                class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono"
              >
                {{ vaultService.vaultStats().pendingReviewCount }} PENDING
              </span>
            } @else {
              <span
                class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono"
                >ALL CLEAR</span
              >
            }
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between bg-slate-900/30">
            <div class="text-2xl font-bold font-mono text-emerald-400">
              {{ vaultService.vaultStats().approvedBulletsCount }} Approved
            </div>
            <div class="text-[11px] text-slate-400 mt-1">Signed-off for Master Resume</div>
          </div>
        </div>

        <!-- Traceability Index Bento Card with Circular Gauge -->
        <div
          class="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden"
        >
          <div
            class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex justify-between items-center"
          >
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >Integrity Score</span
            >
            <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono"
              >TRACE-INDEX</span
            >
          </div>
          <div class="p-3 flex-1 flex items-center justify-between gap-3 bg-slate-900/30">
            <div>
              @if (vaultService.vaultStats().totalGeneratedBullets > 0) {
                <div class="text-2xl font-bold font-mono text-blue-400">
                  {{ vaultService.vaultStats().averageGroundednessScore }}%
                </div>
                <p class="text-[10px] text-slate-400 mt-0.5">Average Grounding</p>
              } @else {
                <div class="text-2xl font-bold font-mono text-slate-400">—</div>
                <p class="text-[10px] text-slate-400 mt-0.5">No evidence yet</p>
              }
            </div>
            <!-- Circular Gauge -->
            <div class="relative w-12 h-12 shrink-0">
              <svg class="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="transparent"
                  class="text-slate-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="transparent"
                  stroke-dasharray="125.6"
                  [attr.stroke-dashoffset]="
                    125.6 - (125.6 * vaultService.vaultStats().averageGroundednessScore) / 100
                  "
                  class="text-blue-500 transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search, Categories & Filters Toolbar -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2"
      >
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <svg
            class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search your evidence..."
            [ngModel]="vaultService.searchQuery()"
            (ngModelChange)="vaultService.searchQuery.set($event)"
            class="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder:text-slate-500 transition-all"
          />
          @if (vaultService.searchQuery()) {
            <button
              (click)="vaultService.searchQuery.set('')"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          }
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <!-- Category Filter -->
          <!-- <div
            class="flex items-center rounded-lg bg-slate-900/80 border border-slate-700 p-0.5 text-xs"
          >
            <button
              (click)="vaultService.categoryFilter.set('all')"
              class="px-2.5 py-1 rounded-md transition-colors"
              [ngClass]="
                vaultService.categoryFilter() === 'all'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              "
            >
              All Types
            </button>
            <button
              (click)="vaultService.categoryFilter.set('rfc')"
              class="px-2.5 py-1 rounded-md transition-colors"
              [ngClass]="
                vaultService.categoryFilter() === 'rfc'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              "
            >
              RFCs & Arch
            </button>
            <button
              (click)="vaultService.categoryFilter.set('report')"
              class="px-2.5 py-1 rounded-md transition-colors"
              [ngClass]="
                vaultService.categoryFilter() === 'report'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              "
            >
              Reports & Audits
            </button>
          </div> -->

          <!-- Provenance Filter -->
          <div
            class="flex items-center rounded-lg bg-slate-900/80 border border-slate-700 p-0.5 text-xs"
          >
            <button
              (click)="vaultService.provenanceFilter.set('all')"
              class="px-2.5 py-1 rounded-md transition-colors"
              [ngClass]="
                vaultService.provenanceFilter() === 'all'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              "
            >
              All Evidence
            </button>
            <button
              (click)="vaultService.provenanceFilter.set('source_backed')"
              class="px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
              [ngClass]="
                vaultService.provenanceFilter() === 'source_backed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-medium'
                  : 'text-slate-400 hover:text-emerald-300'
              "
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Source-Backed
            </button>
            <button
              (click)="vaultService.provenanceFilter.set('self_reported')"
              class="px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
              [ngClass]="
                vaultService.provenanceFilter() === 'self_reported'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700 font-medium'
                  : 'text-slate-400 hover:text-amber-300'
              "
            >
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Self-Reported
            </button>
          </div>
        </div>
      </div>

      <!-- Artifacts Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        @for (art of vaultService.filteredArtifacts(); track art.id) {
          <div
            class="bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col justify-between overflow-hidden hover:border-blue-500/40 transition-all group shadow-md"
          >
            <div>
              <!-- Bento Card Header Stripe -->
              <div
                class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between gap-2"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-slate-200"
                  >
                    {{ art.category }}
                  </span>
                  @if (art.provenanceType === 'source_backed') {
                    <span
                      class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Source-Backed
                    </span>
                  } @else {
                    <span
                      class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Self-Reported
                    </span>
                  }
                </div>

                <span class="text-[10px] text-slate-400 font-mono">
                  {{ art.createdAt | date: 'mediumDate' }}
                </span>
              </div>

              <div class="p-5 space-y-4">
                <!-- Title & Organization -->
                <div>
                  <a
                    [routerLink]="['/evidence', art.id]"
                    class="group-hover:text-blue-400 transition-colors"
                  >
                    <h3 class="text-base font-bold text-white leading-snug line-clamp-2">
                      {{ art.title }}
                    </h3>
                  </a>
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span class="font-medium text-slate-200">{{ art.userRole }}</span>
                    <span class="text-slate-600">•</span>
                    <span>{{ art.organization }}</span>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {{ art.description }}
                </p>

                <!-- Checksum Tag -->
                <!-- <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-700/60 font-mono text-[10px]">
                  <div class="flex items-center gap-1.5 truncate text-slate-400">
                    <span class="text-slate-500">SHA-256:</span>
                    <span class="truncate text-slate-300">{{ art.fileMetadata.sha256Hash.substring(0, 16) }}...{{ art.fileMetadata.sha256Hash.substring(art.fileMetadata.sha256Hash.length - 8) }}</span>
                  </div>
                  <span class="px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 rounded border border-emerald-800/40 shrink-0">
                    PRESERVED
                  </span>
                </div> -->

                <!-- Structured Highlights (if profile extracted) -->
                @if (art.profile; as prof) {
                  <div class="p-3 rounded-xl bg-slate-900/50 border border-slate-700/60 space-y-2">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-slate-400 font-medium">Core Impact Metrics</span>
                      <span class="font-bold font-mono text-blue-400"
                        >{{ prof.sourceBackingRatio }}% Grounded</span
                      >
                    </div>

                    <!-- Key Metric Bento Tiles -->
                    <div class="grid grid-cols-2 gap-2">
                      @for (m of prof.metrics.slice(0, 2); track m.id) {
                        <div
                          class="flex justify-between items-center bg-slate-900/80 p-2 rounded-lg border border-slate-700"
                        >
                          <span class="text-[11px] text-slate-300 truncate mr-1">{{
                            m.metricName
                          }}</span>
                          <span class="text-xs font-mono text-emerald-400 font-bold shrink-0">{{
                            m.achievedValue
                          }}</span>
                        </div>
                      }
                    </div>
                  </div>
                } @else {
                  <div
                    class="p-3 rounded-xl bg-slate-900/30 border border-dashed border-slate-700/60 text-center"
                  >
                    <span class="text-xs text-slate-500">Evidence profile pending extraction</span>
                  </div>
                }
              </div>
            </div>

            <!-- Bottom Actions Bar -->
            <div
              class="p-4 bg-slate-900/40 border-t border-slate-700/50 flex items-center justify-between gap-3"
            >
              <div class="text-xs text-slate-400 font-mono">
                @if (art.transformations.length > 0) {
                  <span class="text-blue-400 font-bold">{{
                    art.transformations[0].bulletPoints.length
                  }}</span>
                  bullets ready
                } @else {
                  <span class="text-slate-500">Ready to transform</span>
                }
              </div>

              <div class="flex items-center gap-2">
                <a
                  [routerLink]="['/evidence', art.id]"
                  class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition-colors"
                >
                  View Details
                </a>

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
            </div>
          </div>
        } @empty {
          <div
            class="col-span-full py-16 text-center bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 space-y-4"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto"
            >
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-white">
                No evidence artifacts match your search
              </h3>
              <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try clearing search filters or upload a new work artifact to preserve proof.
              </p>
            </div>
            <div class="flex items-center justify-center gap-3">
              <button
                (click)="
                  vaultService.searchQuery.set('');
                  vaultService.categoryFilter.set('all');
                  vaultService.provenanceFilter.set('all')
                "
                class="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700"
              >
                Clear Filters
              </button>
              <a
                routerLink="/upload"
                class="px-3.5 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white shadow-md"
              >
                Capture Proof
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent {
  vaultService = inject(EvidenceVaultService);
}
