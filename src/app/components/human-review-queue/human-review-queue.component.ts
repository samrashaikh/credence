import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvidenceVaultService } from '../../services/evidence-vault.service';

@Component({
  selector: 'app-human-review-queue',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 pb-24">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <a routerLink="/vault" class="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
             Evidence Vault
            </a>
            <span class="text-slate-600">/</span>
            <span class="text-xs font-semibold text-blue-400 font-mono">Review Queue</span>
          </div>

          <h1 class="text-2xl font-bold text-white tracking-tight">
            Human-in-the-Loop Review Queue
          </h1>
          <p class="text-xs text-slate-400">
            Credence requires explicit author validation before any AI-generated claim is finalized for external resumes or portfolio proofs.
          </p>
        </div>

        <!-- Master Export Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <button 
            (click)="copyMasterResume()"
            class="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <svg class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>Copy Approved Markdown</span>
          </button>

          <button 
            (click)="approveAllHighConfidence()"
            class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Approve All High Confidence</span>
          </button>
        </div>
      </div>

      <!-- Queue Status Tabs -->
      <div class="flex items-center gap-3 border-b border-slate-700/50 pb-3">
        <button 
          (click)="activeTab = 'pending'"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 font-mono"
          [ngClass]="activeTab === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-slate-700/50'"
        >
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>PENDING SIGN-OFF</span>
          <span class="px-1.5 py-0.2 rounded bg-amber-500/30 text-[10px] font-bold">
            {{ vaultService.allPendingReviewBullets().length }}
          </span>
        </button>

        <button 
          (click)="activeTab = 'approved'"
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 font-mono"
          [ngClass]="activeTab === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-slate-700/50'"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>APPROVED PORTFOLIO</span>
          <span class="px-1.5 py-0.2 rounded bg-emerald-500/30 text-[10px] font-bold">
            {{ vaultService.allApprovedBullets().length }}
          </span>
        </button>
      </div>

      <!-- Content Area -->
      @if (activeTab === 'pending') {
        
        <div class="space-y-4">
          @for (item of vaultService.allPendingReviewBullets(); track item.bullet.id) {
            <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/40 transition-all space-y-4 shadow-md">
              
              <!-- Source Context Banner -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">Source Artifact:</span>
                  <a [routerLink]="['/evidence', item.artifact.id]" class="text-blue-400 font-bold hover:underline">
                    {{ item.artifact.title }}
                  </a>
                  <span class="text-slate-600">•</span>
                  <span class="text-slate-400">{{ item.artifact.organization }}</span>
                </div>

                <div class="flex items-center gap-2">
                  @if (item.artifact.provenanceType === 'source_backed') {
                    <span class="px-2 py-0.5 text-[10px] font-bold font-mono text-emerald-300 bg-emerald-950/60 rounded border border-emerald-800/60">
                      SOURCE-BACKED
                    </span>
                  }
                  <!-- <span class="text-[10px] text-slate-400 font-mono">Framework: {{ item.bullet.framework }}</span> -->
                </div>
              </div>

              <!-- Bullet Text Display -->
              <div class="text-sm font-semibold text-slate-100 leading-relaxed pl-3 border-l-2 border-amber-500">
                {{ item.bullet.bulletText }}
              </div>

              <!-- Grounded Claims Breakdown -->
              <div class="space-y-1.5">
                <span class="text-[11px] font-semibold text-slate-400">Grounded Claims & Citations:</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  @for (claim of item.bullet.claims; track claim.claimId) {
                    <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold font-mono uppercase text-blue-400">[{{ claim.claimType }}]</span>
                        <span class="text-[10px] font-mono text-emerald-400">{{ claim.confidenceScore }}% Grounded</span>
                      </div>
                      <div class="text-slate-200 font-medium">{{ claim.claimText }}</div>
                      <div class="text-[11px] font-mono text-slate-400 italic">"{{ claim.sourceQuote }}"</div>
                    </div>
                  }
                </div>
              </div>

              <!-- Action Controls -->
              <div class="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-3">
                <a 
                  [routerLink]="['/transform', item.artifact.id]"
                  class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold font-mono"
                >
                  INSPECT IN STUDIO ↗
                </a>

                <div class="flex items-center gap-2">
                  <button 
                    (click)="vaultService.rejectBullet(item.artifact.id, item.transformation.id, item.bullet.id)"
                    class="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/40"
                  >
                    Reject
                  </button>

                  <button 
                    (click)="vaultService.approveBullet(item.artifact.id, item.transformation.id, item.bullet.id)"
                    class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30"
                  >
                    Approve & Lock
                  </button>
                </div>
              </div>

            </div>
          } @empty {
            <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-16 text-center space-y-3 shadow-md">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 class="text-base font-bold text-white">All Generated Claims Approved!</h3>
              <p class="text-xs text-slate-400 max-w-sm mx-auto">
                There are no pending resume bullets awaiting review. You can transform more artifacts or export your verified resume.
              </p>
            </div>
          }
        </div>

      } @else {
        
        <!-- Approved Bullets Portfolio List -->
        <div class="space-y-4">
          @for (item of vaultService.allApprovedBullets(); track item.bullet.id) {
            <div class="bg-slate-800/50 rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/10 space-y-3 shadow-md">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    VERIFIED BY AUTHOR
                  </span>
                  <span class="font-bold text-slate-200">{{ item.artifact.organization }}</span>
                  <span class="text-slate-600">•</span>
                  <span class="text-slate-400">{{ item.artifact.userRole }}</span>
                </div>
                
                <span class="text-[11px] font-mono font-bold text-emerald-400">100% GROUNDED</span>
              </div>

              <div class="text-sm font-medium text-slate-100 pl-3 border-l-2 border-emerald-400 leading-relaxed">
                {{ item.bullet.bulletText }}
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50 font-mono">
                <span>Preserved in Artifact: <strong class="text-slate-300 font-sans">{{ item.artifact.title }}</strong></span>
                <a [routerLink]="['/proof', item.artifact.id]" class="text-blue-400 hover:underline">
                  Proof Packet ↗
                </a>
              </div>
            </div>
          } @empty {
            <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-16 text-center space-y-3 shadow-md">
              <p class="text-xs text-slate-400">No approved bullets yet. Review pending bullets to add them to your verified portfolio.</p>
            </div>
          }
        </div>

      }

    </div>
  `
})
export class HumanReviewQueueComponent {
  vaultService = inject(EvidenceVaultService);
  activeTab: 'pending' | 'approved' = 'pending';

  approveAllHighConfidence(): void {
    const pending = this.vaultService.allPendingReviewBullets();
    pending.forEach(item => {
      if (item.bullet.overallConfidence >= 90) {
        this.vaultService.approveBullet(item.artifact.id, item.transformation.id, item.bullet.id);
      }
    });
    this.vaultService.showToast('All high-confidence bullets approved!', 'success');
  }

  copyMasterResume(): void {
    const approved = this.vaultService.allApprovedBullets();
    if (approved.length === 0) {
      this.vaultService.showToast('No approved bullets to export. Approve bullets first!', 'warning');
      return;
    }

    const md = approved.map(a => `• ${a.bullet.bulletText} (Source: ${a.artifact.title}, SHA-256: ${a.artifact.fileMetadata.sha256Hash.substring(0, 12)}...)`).join('\n\n');
    navigator.clipboard.writeText(md);
    this.vaultService.showToast('Master resume markdown copied to clipboard!', 'success');
  }
}
