import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-evidence-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (vaultService.selectedArtifact(); as art) {
      <div class="space-y-6 pb-20">
        
        <!-- Breadcrumb & Top Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <a routerLink="/vault" class="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                Vault
              </a>
              <span class="text-slate-600">/</span>
              <span class="text-xs font-semibold text-slate-300 truncate max-w-xs">{{ art.title }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {{ art.title }}
              </h1>
              
              <!-- Provenance Badge -->
              @if (art.provenanceType === 'source_backed') {
                <span class="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Verified Source Artifact
                </span>
              } @else {
                <span class="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Self-Reported Reflection
                </span>
              }
            </div>

            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span class="text-slate-200 font-medium">{{ art.userRole }}</span>
              <span class="text-slate-600">•</span>
              <span>{{ art.organization }}</span>
              <span class="text-slate-600">•</span>
              <span class="font-mono text-slate-400">{{ art.fileMetadata.fileName }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3 shrink-0">
            <button 
              (click)="reExtractProfile(art.id)"
              [disabled]="geminiService.isAnalyzing()"
              class="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
            >
              @if (geminiService.isAnalyzing()) {
                <svg class="w-3.5 h-3.5 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                <span>Analyzing with Gemini...</span>
              } @else {
                <svg class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                <span>Re-Extract Profile</span>
              }
            </button>

            <a 
              [routerLink]="['/transform', art.id]"
              class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>
              <span>Transform into Bullets</span>
            </a>
          </div>
        </div>

        <!-- Split View: Preserved Source Artifact (Left) vs Structured Profile (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Left Column: Preserved Source Document Viewer (5 Cols) -->
          <div class="lg:col-span-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preserved Source Artifact
                </h3>
              </div>
              <span class="text-[11px] font-mono text-slate-400">
                {{ art.fileMetadata.fileSize }} bytes • Read-Only Vault
              </span>
            </div>

            <!-- Preserved Document Container -->
            <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[680px] shadow-md">
              
              <!-- Checksum Header Banner -->
              <div class="p-3 bg-slate-900/80 border-b border-slate-700/50 flex items-center justify-between text-[11px] font-mono">
                <div class="flex items-center gap-2 text-slate-400 truncate">
                  <span class="text-slate-500">SHA-256:</span>
                  <span class="text-emerald-400 truncate">{{ art.fileMetadata.sha256Hash }}</span>
                </div>
                <button 
                  (click)="copyHash(art.fileMetadata.sha256Hash)"
                  class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0 border border-slate-700 transition-colors"
                >
                  Copy
                </button>
              </div>

              <!-- Raw Text Viewer with Line Numbers -->
              <div class="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed space-y-1 bg-slate-950/80 select-text">
                @for (line of getSourceLines(art.rawContentText); track $index) {
                  <div class="flex items-start gap-3 hover:bg-slate-900/50 py-0.5 px-1 rounded transition-colors group">
                    <span class="text-[10px] text-slate-600 font-mono select-none w-6 text-right shrink-0">
                      {{ $index + 1 }}
                    </span>
                    <span 
                      class="flex-1 whitespace-pre-wrap break-words"
                      [ngClass]="{
                        'text-blue-300 font-bold text-sm': line.startsWith('#'),
                        'text-blue-400 font-semibold': line.startsWith('##'),
                        'text-emerald-300 bg-emerald-950/40 px-1 rounded': isMetricLine(line)
                      }"
                    >
                      {{ line }}
                    </span>
                  </div>
                }
              </div>

              <!-- Preservation Stamp Footer -->
              <div class="p-3 bg-slate-900/80 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Preserved at {{ art.fileMetadata.preservationTimestamp | date:'medium' }}</span>
                <span class="text-emerald-400 font-bold">INTEGRITY_VERIFIED</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Extracted Structured Evidence Profile (7 Cols) -->
          <div class="lg:col-span-7 space-y-4">
            
            @if (art.profile; as prof) {
              
              <!-- Evidence Summary Bento Card -->
              <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md">
                
                <div class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <span class="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">Gemini 3.7 Flash Analysis</span>
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono">{{ prof.extractedAt | date:'mediumTime' }}</span>
                </div>

                <div class="p-5 space-y-4 bg-slate-900/30">
                  <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1">
                      <h2 class="text-base font-bold text-white">{{ prof.projectTitle }}</h2>
                      <p class="text-xs text-slate-300 leading-relaxed">{{ prof.summary }}</p>
                    </div>

                    <!-- Source Backing Score Gauge -->
                    <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex flex-col items-center justify-center shrink-0 min-w-[100px]">
                      <span class="text-2xl font-bold font-mono text-blue-400">{{ prof.sourceBackingRatio }}%</span>
                      <span class="text-[10px] font-bold uppercase text-slate-400 text-center font-mono">GROUNDED</span>
                    </div>
                  </div>

                  <!-- Technologies & Tools Extracted -->
                  <div class="space-y-1.5 pt-3 border-t border-slate-700/50">
                    <span class="text-[11px] font-semibold text-slate-400">Grounded Technologies:</span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (tech of prof.technologies; track tech) {
                        <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-blue-300 font-mono">
                          {{ tech }}
                        </span>
                      }
                    </div>
                  </div>
                </div>

              </div>

              <!-- Quantified Metrics & Benchmarks Bento Card -->
              <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md">
                <div class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Extracted Quantified Metrics ({{ prof.metrics.length }})
                    </h3>
                  </div>
                  <span class="text-[10px] text-emerald-400 font-mono">SOURCE_QUOTED</span>
                </div>

                <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/30">
                  @for (m of prof.metrics; track m.id) {
                    <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                      <div class="flex items-start justify-between gap-2">
                        <span class="text-xs font-bold text-white leading-tight">{{ m.metricName }}</span>
                        <span class="px-2 py-0.5 text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 rounded border border-emerald-800/40">
                          {{ m.achievedValue }}
                        </span>
                      </div>

                      <div class="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Baseline: <strong class="text-slate-300 font-mono">{{ m.baselineValue }}</strong></span>
                        <span class="text-blue-300 font-bold font-mono">{{ m.percentageChange }}</span>
                      </div>

                      <!-- Direct Citation Quote -->
                      <div class="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 italic">
                        "{{ m.quote }}"
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Extracted Actions with Direct Grounding Quotes -->
              <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md">
                <div class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Primary Actions ({{ prof.actions.length }})
                    </h3>
                  </div>
                  <span class="text-[10px] text-blue-300 font-mono">VERBATIM_PROOF</span>
                </div>

                <div class="p-5 space-y-3 bg-slate-900/30">
                  @for (act of prof.actions; track act.id) {
                    <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                      <div class="flex items-center justify-between gap-2">
                        <p class="text-xs font-semibold text-white leading-snug">{{ act.description }}</p>
                        <span class="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                          {{ act.confidence }}% MATCH
                        </span>
                      </div>
                      
                      <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                        <div class="text-[10px] text-slate-500 font-semibold uppercase">Source Quote:</div>
                        <p class="italic text-slate-200">"{{ act.directQuote }}"</p>
                        @if (act.sourceLineHint) {
                          <div class="text-[10px] text-blue-400">{{ act.sourceLineHint }}</div>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Operational Challenges & Impact Narrative -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden p-4 space-y-2 shadow-md">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Key Constraints Overcome</h4>
                  <ul class="space-y-1.5 text-xs text-slate-400">
                    @for (ch of prof.challenges; track ch) {
                      <li class="flex items-start gap-2">
                        <span class="text-blue-400">•</span>
                        <span>{{ ch }}</span>
                      </li>
                    }
                  </ul>
                </div>

                <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden p-4 space-y-2 shadow-md">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Executive Impact Narrative</h4>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    {{ prof.impactNarrative }}
                  </p>
                </div>

              </div>

            } @else {
              
              <!-- Extraction Pending State -->
              <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center space-y-4 shadow-md">
                <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                  <svg class="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-white">Extract Structured Evidence Profile</h3>
                  <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Use Gemini 3.7 Flash to analyze the preserved artifact, map direct quotes, and extract verified metrics.
                  </p>
                </div>
                <button 
                  (click)="reExtractProfile(art.id)"
                  class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all"
                >
                  Run Gemini Extraction
                </button>
              </div>

            }

          </div>

        </div>

      </div>
    }
  `
})
export class EvidenceDetailComponent implements OnInit {
  vaultService = inject(EvidenceVaultService);
  geminiService = inject(GeminiService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.vaultService.selectArtifact(id);
      }
    });
  }

  getSourceLines(rawText: string): string[] {
    return (rawText || '').split('\n');
  }

  isMetricLine(line: string): boolean {
    return /\d+%|\$\d+|\d+\s?ms|\d+\s?eps|\d+\s?weeks/i.test(line);
  }

  async reExtractProfile(artifactId: string): Promise<void> {
    await this.vaultService.extractEvidenceProfile(artifactId);
  }

  copyHash(hash: string): void {
    navigator.clipboard.writeText(hash);
    this.vaultService.showToast('SHA-256 integrity hash copied to clipboard', 'info');
  }
}
