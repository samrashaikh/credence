import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { ArtifactCategory, ProvenanceType } from '../../../types/evidence.types';

@Component({
  selector: 'app-upload-evidence',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-20">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <a routerLink="/vault" class="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              Evidence Vault
            </a>
            <span class="text-slate-600">/</span>
            <span class="text-xs font-bold text-blue-400 font-mono">CAPTURE_PROOF</span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            Capture Primary Career Proof
          </h1>
          <p class="text-xs text-slate-300">
            Upload or paste original unadulterated artifacts. Credence seals the document with a SHA-256 cryptographic hash and extracts structured evidence.
          </p>
        </div>

        <!-- Quick Preload Samples -->
        <div class="flex items-center gap-2 shrink-0">
          <button 
            (click)="loadSampleTemplate('devops')"
            class="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-[11px] text-slate-300 transition-colors"
          >
            + Sample RFC
          </button>
          <button 
            (click)="loadSampleTemplate('product')"
            class="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-[11px] text-slate-300 transition-colors"
          >
            + Sample Growth Report
          </button>
          <button 
            (click)="loadSampleTemplate('clinical')"
            class="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-[11px] text-slate-300 transition-colors"
          >
            + Sample FDA Audit
          </button>
        </div>
      </div>

      <!-- Upload & Provenance Form -->
      <form (ngSubmit)="submitArtifact()" class="space-y-6">
        
        <!-- Provenance Type Selector (Crucial Credence Pillar) -->
        <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md">
          <div class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">1. Source Provenance Classification</h3>
              <p class="text-[11px] text-slate-400">Credence clearly distinguishes verifiable artifacts from subjective self-reported notes.</p>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              AUDIT_STANDARD
            </span>
          </div>

          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/30">
            
            <!-- Source-Backed Option -->
            <label 
              class="relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
              [ngClass]="provenanceType === 'source_backed' ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30' : 'bg-slate-900/70 border-slate-700/60 hover:border-slate-600'"
            >
              <input 
                type="radio" 
                name="provenanceType" 
                value="source_backed" 
                [(ngModel)]="provenanceType" 
                class="mt-1 text-emerald-600 focus:ring-emerald-500"
              />
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-emerald-300">Verified Source Artifact</span>
                  <span class="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 rounded font-mono">GROUND_TRUTH</span>
                </div>
                <p class="text-[11px] text-slate-400 leading-snug">
                  Primary system documents: RFCs, Datadog/Mixpanel telemetry exports, signed PR approvals, FDA audit logs, contract agreements.
                </p>
              </div>
            </label>

            <!-- Self-Reported Option -->
            <label 
              class="relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
              [ngClass]="provenanceType === 'self_reported' ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/30' : 'bg-slate-900/70 border-slate-700/60 hover:border-slate-600'"
            >
              <input 
                type="radio" 
                name="provenanceType" 
                value="self_reported" 
                [(ngModel)]="provenanceType" 
                class="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-amber-300">Self-Reported Reflection</span>
                  <span class="px-1.5 py-0.2 text-[9px] font-semibold bg-amber-500/20 text-amber-300 rounded font-mono">SUBJECTIVE</span>
                </div>
                <p class="text-[11px] text-slate-400 leading-snug">
                  Personal retrospective journal, mentorship recollections, or subjective career milestones lacking third-party system proof.
                </p>
              </div>
            </label>

          </div>
        </div>

        <!-- Metadata Section -->
        <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md">
          <div class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">2. Proof Provenance & Author Context</h3>
            <span class="text-[10px] text-slate-400 font-mono">METADATA_SPEC</span>
          </div>
          
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/30">
            
            <!-- Title -->
            <div class="space-y-1.5 sm:col-span-2">
              <label class="text-xs font-medium text-slate-300">Initiative / Artifact Title *</label>
              <input 
                type="text" 
                required
                [(ngModel)]="title" 
                name="title"
                placeholder="e.g. Distributed Cassandra-to-Spanner Migration RFC"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <!-- Role Claimed -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-300">Your Role During Execution *</label>
              <input 
                type="text" 
                required
                [(ngModel)]="userRole" 
                name="userRole"
                placeholder="e.g. Lead Staff Backend Architect"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <!-- Organization -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-300">Organization / Team *</label>
              <input 
                type="text" 
                required
                [(ngModel)]="organization" 
                name="organization"
                placeholder="e.g. Stripe Infrastructure Core Platform"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <!-- Category -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-300">Artifact Category</label>
              <select 
                [(ngModel)]="category" 
                name="category"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-xs text-white"
              >
                <option value="rfc">RFC & System Architecture</option>
                <option value="report">Operational & Analytics Report</option>
                <option value="metrics_dashboard">Telemetry & Metrics Dashboard</option>
                <option value="code_review">Pull Request & Code Review</option>
                <option value="contract">Commercial Deal / SOW</option>
                <option value="postmortem">Incident Post-Mortem</option>
                <option value="other">General Documentation</option>
              </select>
            </div>

            <!-- Tagging -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-300">Technology & Domain Tags (comma separated)</label>
              <input 
                type="text" 
                [(ngModel)]="tagsInput" 
                name="tagsInput"
                placeholder="Kafka, Go, Kubernetes, P99 Latency"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
              />
            </div>

          </div>
        </div>

        <!-- Document Content / File Upload -->
        <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md">
          <div class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">3. Artifact Content & Preservation</h3>
            <div class="flex items-center gap-2">
              <label class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer transition-colors border border-slate-600 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                <span>Upload File (PDF / MD / TXT / JSON)</span>
                <input type="file" (change)="onFileSelected($event)" accept=".md,.txt,.json,.pdf,.csv,.doc,.docx" class="hidden" />
              </label>
            </div>
          </div>

          <!-- Content Textarea -->
          <div class="p-5 space-y-3 bg-slate-900/30">
            <textarea 
              rows="12" 
              required
              [(ngModel)]="rawContentText" 
              (ngModelChange)="onContentChanged()"
              name="rawContentText"
              placeholder="Paste raw markdown, system logs, RFC text, telemetry summaries, or audit tables here..."
              class="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-mono text-slate-200 placeholder:text-slate-600 leading-relaxed"
            ></textarea>

            <!-- Real-time SHA-256 Hash Preview -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-mono">
              <div class="flex items-center gap-2 text-slate-400 truncate">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="text-slate-500">Integrity Hash:</span>
                <span class="text-emerald-300 truncate">{{ liveSha256 || 'Awaiting content...' }}</span>
              </div>
              <div class="flex items-center gap-3 text-slate-400 shrink-0">
                <span>{{ rawContentText.length }} bytes</span>
                <span>•</span>
                <span class="text-slate-300">{{ getLineCount() }} lines</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button & Action -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <a 
            routerLink="/vault"
            class="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-600 transition-colors"
          >
            Cancel
          </a>

          <button 
            type="submit"
            [disabled]="isSubmitting || !title || !rawContentText"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02]"
          >
            @if (isSubmitting) {
              <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              <span>Preserving & Extracting with Gemini...</span>
            } @else {
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Preserve in Vault & Extract Profile</span>
            }
          </button>
        </div>

      </form>

    </div>
  `
})
export class UploadEvidenceComponent {
  vaultService = inject(EvidenceVaultService);
  router = inject(Router);

  title = '';
  userRole = 'Lead Staff Backend Architect';
  organization = 'Apex Financial Technologies';
  category: ArtifactCategory = 'rfc';
  provenanceType: ProvenanceType = 'source_backed';
  tagsInput = 'Kafka, Distributed Systems, Go, Kubernetes, P99 Latency';
  rawContentText = '';
  liveSha256 = '';
  isSubmitting = false;

  constructor() {
    this.loadSampleTemplate('devops');
  }

  onContentChanged(): void {
    if (this.rawContentText) {
      this.liveSha256 = this.vaultService.calculateSha256Sync(this.rawContentText);
    } else {
      this.liveSha256 = '';
    }
  }

  getLineCount(): number {
    return this.rawContentText.split('\n').length;
  }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;

    this.title = file.name.replace(/\.[^/.]+$/, "");
    
    // Read as text
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.rawContentText = e.target.result || '';
      this.onContentChanged();
      this.vaultService.showToast(`Loaded ${file.name} (${file.size} bytes)`, 'info');
    };
    reader.readAsText(file);
  }

  loadSampleTemplate(type: 'devops' | 'product' | 'clinical'): void {
    if (type === 'devops') {
      this.title = 'Cassandra to Spanner Global Cutover & Latency SLA Report';
      this.userRole = 'Lead Staff Infrastructure Engineer';
      this.organization = 'Apex Global Cloud';
      this.category = 'rfc';
      this.provenanceType = 'source_backed';
      this.tagsInput = 'Cloud Spanner, Distributed Storage, Go, P99 Latency, Zero-Downtime';
      this.rawContentText = `# Architecture Cutover RFC: Spanner Global Database Migration
**Author**: Lead Staff Infrastructure Engineer
**Audited SLA Window**: Q4 Peak Traffic Readiness

## 1. Problem & Architecture
Legacy Cassandra clusters exhibited tail latency degradation (>650ms P99) during peak global writes across 3 continents. We architected a zero-downtime dual-write proxy in Go with optimistic conflict resolution.

## 2. Key Verified Benchmarks
- P99 Write Latency: Reduced from 650ms to 88ms (86.4% reduction).
- Availability: Sustained 99.999% uptime across 180M daily write transactions.
- Cloud Hosting Cost: Consolidated node footprint, reducing infrastructure spend by $48,000/month.

## 3. Operational Sign-off
Verified by SRE Lead on Dec 18. Zero customer-facing rollbacks.`;
    } else if (type === 'product') {
      this.title = 'Enterprise Free-to-Paid PLG Funnel Optimization Audit';
      this.userRole = 'Director of Product Growth';
      this.organization = 'KiteSync Enterprise SaaS';
      this.category = 'report';
      this.provenanceType = 'source_backed';
      this.tagsInput = 'Product Growth, PLG, A/B Testing, ARR, Mixpanel';
      this.rawContentText = `# Product Growth A/B Test Audit (Cohort N=54,000 accounts)
**Author**: Director of Product Growth
**Significance**: p < 0.001

## 1. Experiment Overview
Redesigned team invite viral loops and workspace seat allocation triggers.

## 2. Verified Metrics
- Free-to-Paid Conversion Rate: Increased from 3.2% to 7.8% (+143% relative lift).
- Net Expansion ARR: Added $2.1M in annualized revenue within 90 days.
- Team Activation Rate: 68% of new workspaces reached 5+ active weekly seats (up from 24%).`;
    } else {
      this.title = 'FDA 21 CFR Part 11 Electronic Data Validation Runbook';
      this.userRole = 'Principal Clinical Data Lead';
      this.organization = 'Vanguard BioMed';
      this.category = 'report';
      this.provenanceType = 'source_backed';
      this.tagsInput = 'FDA Compliance, Clinical Trials, CDISC, Python, SDTM';
      this.rawContentText = `# Clinical Trial Data Integrity Audit (Study Protocol VT-409)
**Author**: Principal Clinical Data Lead
**Trial Sites**: 28 Medical Centers (N=820 oncology subjects)

## 1. Execution
Engineered automated real-time CDISC SDTM transformation pipeline in Python with cryptographically sealed audit checksums.

## 2. Verified Audit Results
- Data Discrepancy Freeze Time: Reduced from 8 weeks to 1.8 weeks (77.5% acceleration).
- Regulatory Audit Outcome: Passed FDA inspection with 0 Form 483 citations.`;
    }

    this.onContentChanged();
  }

  async submitArtifact(): Promise<void> {
    if (!this.title || !this.rawContentText) return;

    this.isSubmitting = true;
    try {
      const tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const sha256 = this.vaultService.calculateSha256Sync(this.rawContentText);

      const created = await this.vaultService.addArtifact({
        title: this.title,
        category: this.category,
        userRole: this.userRole,
        organization: this.organization,
        provenanceType: this.provenanceType,
        description: `Preserved ${this.category.toUpperCase()} document containing ${this.getLineCount()} lines of original source context.`,
        rawContentText: this.rawContentText,
        tags,
        fileMetadata: {
          fileName: `${this.title.toLowerCase().replace(/\s+/g, '-')}.md`,
          fileSize: this.rawContentText.length,
          mimeType: 'text/markdown',
          sha256Hash: sha256,
          preservationTimestamp: new Date().toISOString(),
          checksumVerified: true
        }
      });

      // Automatically run Gemini extraction
      await this.vaultService.extractEvidenceProfile(created.id);

      // Navigate to detail view
      this.router.navigate(['/evidence', created.id]);
    } catch (err: any) {
      this.vaultService.showToast(`Error saving artifact: ${err.message}`, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }
}
