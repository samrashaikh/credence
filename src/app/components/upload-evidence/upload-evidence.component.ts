import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { ArtifactCategory, ProvenanceType } from '../../../types/evidence.types';
import { createWorker } from 'tesseract.js';

type OcrWord = {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
};

type SensitiveOcrFinding = {
  type: string;
  value: string;
  words: OcrWord[];
};

@Component({
  selector: 'app-upload-evidence',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
            <span class="text-xs font-bold text-blue-400 font-mono">Capture Proof</span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Capture Primary Career Proof</h1>
          <p class="text-xs text-slate-300">
            Upload or paste original unadulterated artifacts. Credence seals the document with a
            SHA-256 cryptographic hash and extracts structured evidence.
          </p>
        </div>
      </div>

      <!-- Upload & Provenance Form -->
      <div class="max-w-5xl mx-auto mt-6">
        <form (ngSubmit)="submitArtifact()" class="space-y-6">
          <!-- Provenance Type Selector (Crucial Credence Pillar) -->
          <div
            class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md"
          >
            <div
              class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between"
            >
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  1. Source Provenance Classification
                </h3>
                <p class="text-[11px] text-slate-400">
                  Credence clearly distinguishes verifiable artifacts from subjective self-reported
                  notes.
                </p>
              </div>
              <!--<span class="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              AUDIT_STANDARD
            </span>-->
            </div>

            <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/30">
              <!-- Source-Backed Option -->
              <label
                class="relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
                [ngClass]="
                  provenanceType === 'source_backed'
                    ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/70 border-slate-700/60 hover:border-slate-600'
                "
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
                    <!--<span class="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 rounded font-mono">GROUND-TRUTH</span>-->
                  </div>
                  <p class="text-[11px] text-slate-400 leading-snug">
                    Primary system documents: RFCs, Datadog/Mixpanel telemetry exports, signed PR
                    approvals, FDA audit logs, contract agreements.
                  </p>
                </div>
              </label>

              <!-- Self-Reported Option -->
              <label
                class="relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all"
                [ngClass]="
                  provenanceType === 'self_reported'
                    ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/70 border-slate-700/60 hover:border-slate-600'
                "
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
                    <!-- <span class="px-1.5 py-0.2 text-[9px] font-semibold bg-amber-500/20 text-amber-300 rounded font-mono">SUBJECTIVE</span> -->
                  </div>
                  <p class="text-[11px] text-slate-400 leading-snug">
                    Personal retrospective journal, mentorship recollections, or subjective career
                    milestones lacking third-party system proof.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Metadata Section -->
          <div
            class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md"
          >
            <div
              class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between"
            >
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                2. Proof Provenance & Author Context
              </h3>
              <span class="text-[10px] text-slate-400 font-mono"></span>
            </div>

            <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/30">
              <!-- Title -->
              <div class="space-y-1.5 sm:col-span-2">
                <label class="text-xs font-medium text-slate-300"
                  >Initiative / Artifact Title *</label
                >
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
                <label class="text-xs font-medium text-slate-300"
                  >Your Role During Execution *</label
                >
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
                <input
                  type="text"
                  [(ngModel)]="category"
                  name="category"
                  placeholder="e.g. Manager Feedback, Performance Review, Project Delivery"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder:text-slate-500"
                />
              </div>

              <!-- Tagging -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-300"
                  >Technology & Domain Tags (comma separated)</label
                >
                <input
                  type="text"
                  [(ngModel)]="tagsInput"
                  name="tagsInput"
                  placeholder="e.g. Kafka, Go, Kubernetes, P99 Latency"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <!-- Document Content / File Upload -->
          <div
            class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-md"
          >
            <div
              class="p-3.5 border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-between"
            >
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                3. Artifact Content & Preservation
              </h3>
              <div class="flex items-center gap-2">
                <label
                  class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer transition-colors border border-slate-600 flex items-center gap-1.5"
                >
                  <svg
                    class="w-3.5 h-3.5 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <span>Upload File (PNG / JPG / MD / TXT)</span>
                  <input
                    type="file"
                    (change)="onFileSelected($event)"
                    accept=".png,.jpg,.jpeg,.webp,.md,.txt"
                    class="hidden"
                  />
                </label>
              </div>
            </div>

            <!-- Image Preview -->
            @if (redactionImageUrl) {
              <div class="p-5 space-y-4 bg-slate-900/30">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-semibold text-slate-200">Image Preview</p>
                    <p class="text-xs text-slate-500 mt-1">
                      Review sensitive information before preserving this artifact.
                    </p>
                  </div>

                  <!-- <button
                    type="button"
                    (click)="applyDetectedImageRedactions()"
                    class="px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    {{ isRedactionMode ? 'Exit Redaction' : 'Redact Sensitive Info' }}
                  </button> -->
                </div>

                <div
                  class="rounded-xl border border-slate-700 bg-slate-950 p-4 flex justify-center"
                >
                  <div class="relative inline-block">
                    <img
                      [src]="redactionImageUrl"
                      alt="Artifact preview"
                      (load)="onPreviewImageLoad($event)"
                      class="block max-w-full max-h-[600px] object-contain rounded-lg"
                    />

                    @if (previewImageElement) {
                      @for (box of redactionBoxes; track $index) {
                        <div
                          class="absolute bg-black pointer-events-none"
                          [style.left.px]="
                            box.x *
                            (previewImageElement.clientWidth / previewImageElement.naturalWidth)
                          "
                          [style.top.px]="
                            box.y *
                            (previewImageElement.clientHeight / previewImageElement.naturalHeight)
                          "
                          [style.width.px]="
                            box.width *
                            (previewImageElement.clientWidth / previewImageElement.naturalWidth)
                          "
                          [style.height.px]="
                            box.height *
                            (previewImageElement.clientHeight / previewImageElement.naturalHeight)
                          "
                        ></div>
                      }
                    }
                  </div>
                </div>

                @if (isRedactionMode) {
                  <div class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <p class="text-xs text-amber-200">
                      Redaction mode enabled. Drawing redaction areas comes next.
                    </p>
                  </div>
                }
              </div>
            }

            <!-- Text Content -->
            @if (!redactionImageUrl) {
              <div class="p-5 space-y-3 bg-slate-900/30">
                <textarea
                  rows="12"
                  required
                  [(ngModel)]="rawContentText"
                  (ngModelChange)="detectSensitiveText(rawContentText); onContentChanged()"
                  name="rawContentText"
                  placeholder="Paste raw markdown, system logs, RFC text, telemetry summaries, or audit tables here..."
                  class="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-mono text-slate-200 placeholder:text-slate-600 leading-relaxed"
                ></textarea>

                <!-- Real-time SHA-256 Hash Preview -->
                <div
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-mono"
                >
                  <div class="flex items-center gap-2 text-slate-400 truncate">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="text-slate-500">Integrity Hash:</span>
                    <span class="text-emerald-300 truncate">
                      {{ liveSha256 || 'Awaiting content...' }}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 text-slate-400 shrink-0">
                    <span>{{ rawContentText.length }} bytes</span>
                    <span>•</span>
                    <span class="text-slate-300">{{ getLineCount() }} lines</span>
                  </div>
                </div>
              </div>
            }
          </div>
          <!-- Submit Button & Action -->
          @if (!redactionImageUrl && hasBlockingSensitiveFindings()) {
            <div class="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 text-red-400">⚠</div>

                <div class="space-y-1 flex-1 min-w-0">
                  <p class="text-sm font-semibold text-red-200">Sensitive Data Must Be Removed</p>

                  <p class="text-xs text-red-300/80 leading-relaxed">
                    Credence detected sensitive information that cannot be preserved or sent for AI
                    processing. Remove the blocked items below before continuing.
                  </p>

                  <div class="flex items-center justify-between gap-4 pt-2">
                    <!-- Detected sensitive-data types -->
                    <div class="flex flex-wrap gap-2">
                      @for (finding of sensitiveFindings; track $index) {
                        @if (
                          finding.type === 'Possible secret' ||
                          finding.type === 'Bearer token' ||
                          finding.type === 'Aadhaar-like number' ||
                          finding.type === 'PAN-like identifier' ||
                          finding.type === 'Card-like number'
                        ) {
                          <span
                            class="px-2.5 py-1 rounded-md bg-red-950/30 border border-red-500/15 text-[11px] font-medium text-red-300/80"
                          >
                            {{ finding.type }}
                          </span>
                        }
                      }
                    </div>

                    <!-- Redaction action -->
                    <button
                      type="button"
                      (click)="redactBlockingSensitiveData()"
                      class="shrink-0 px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-xs font-semibold text-red-100 transition-colors"
                    >
                      Redact Detected Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
          @if (
            redactionImageUrl && sensitiveOcrFindings.length > 0 && redactionBoxes.length === 0
          ) {
            <div class="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 text-red-400">⚠</div>

                <div class="space-y-1 flex-1 min-w-0">
                  <p class="text-sm font-semibold text-red-200">Sensitive Data Must Be Removed</p>

                  <p class="text-xs text-red-300/80 leading-relaxed">
                    Credence detected sensitive information that cannot be preserved or sent for AI
                    processing. Remove the blocked items below before continuing.
                  </p>

                  <div class="flex items-center justify-between gap-4 pt-2">
                    <div class="flex flex-wrap gap-2">
                      @for (finding of sensitiveOcrFindings; track $index) {
                        <span
                          class="px-2.5 py-1 rounded-md bg-red-950/30 border border-red-500/15 text-[11px] font-medium text-red-300/80"
                        >
                          {{ finding.type }}
                        </span>
                      }
                    </div>

                    <button
                      type="button"
                      (click)="applyDetectedImageRedactions()"
                      class="shrink-0 px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-xs font-semibold text-red-100 transition-colors"
                    >
                      Redact Detected Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
          <div class="flex items-center justify-end gap-3 pt-2">
            <a
              routerLink="/vault"
              class="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-600 transition-colors"
            >
              Cancel
            </a>

            <button
              type="submit"
              [disabled]="
                isSubmitting ||
                !title ||
                !userRole ||
                !organization ||
                (!rawContentText && !selectedFile) ||
                (!!redactionImageUrl &&
                  sensitiveOcrFindings.length > 0 &&
                  redactionBoxes.length === 0) ||
                (!redactionImageUrl && hasBlockingSensitiveFindings())
              "
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02]"
            >
              @if (isSubmitting) {
                <svg
                  class="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>Preserving & Extracting with Gemini...</span>
              } @else {
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Preserve in Vault & Extract Profile</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class UploadEvidenceComponent {
  title = '';
  userRole = '';
  organization = '';
  category = '';
  provenanceType: ProvenanceType = 'source_backed';
  tagsInput = '';
  rawContentText = '';
  liveSha256 = '';
  isSubmitting = false;
  selectedFile: File | null = null;
  vaultService = inject(EvidenceVaultService);
  router = inject(Router);
  redactionImageUrl: string | null = null;
  redactionBoxes: Array<{ x: number; y: number; width: number; height: number }> = [];
  isRedactionMode = false;
  sensitiveFindings: Array<{
    type: string;
    value: string;
    start: number;
    end: number;
  }> = [];
  previewImageElement: HTMLImageElement | null = null;
  isOcrRunning = false;
  ocrText = '';
  ocrWords: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }> = [];

  sensitiveOcrFindings: SensitiveOcrFinding[] = [];

  onPreviewImageLoad(event: Event): void {
    this.previewImageElement = event.target as HTMLImageElement;
  }

  hasBlockingSensitiveFindings(): boolean {
    return this.sensitiveFindings.some((finding) =>
      [
        'Possible secret',
        'Bearer token',
        'Aadhaar-like number',
        'PAN-like identifier',
        'Card-like number',
      ].includes(finding.type),
    );
  }

  detectSensitiveText(content: string): void {
    const findings: Array<{
      type: string;
      value: string;
      start: number;
      end: number;
    }> = [];

    const patterns = [
      {
        type: 'Email address',
        regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      },
      {
        type: 'Phone number',
        regex: /(?:\+91[\s-]?)?[6-9]\d{9}\b/g,
      },
      {
        type: 'Aadhaar-like number',
        regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
      },
      {
        type: 'PAN-like identifier',
        regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
      },
      {
        type: 'Card-like number',
        regex: /\b(?:\d[ -]*?){13,19}\b/g,
      },
      {
        type: 'Bearer token',
        regex: /\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b/gi,
      },
      {
        type: 'Possible secret',
        regex:
          /\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*[^\s,;]+/gi,
      },
    ];

    for (const pattern of patterns) {
      for (const match of content.matchAll(pattern.regex)) {
        if (match.index === undefined) continue;

        findings.push({
          type: pattern.type,
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }

    this.sensitiveFindings = findings;
  }

  private detectSensitiveOcrWords(): void {
    if (!this.ocrWords.length) {
      console.log('No OCR words available for sensitive-data detection.');
      return;
    }

    // Build one searchable string while remembering where each OCR word sits.
    let searchableText = '';

    const wordRanges = this.ocrWords.map((word, index) => {
      const start = searchableText.length;

      searchableText += word.text;

      const end = searchableText.length;

      searchableText += ' ';

      return {
        index,
        start,
        end,
        word,
      };
    });

    const patterns = [
      {
        type: 'Aadhaar-like number',
        regex: /\b\d{4}\s+\d{4}\s+\d{4}\b/g,
      },
      {
        type: 'PAN-like identifier',
        regex: /\b[A-Z]{5}\d{4}[A-Z]\b/gi,
      },
      {
        type: 'Possible secret',
        regex:
          /\b(?:password|passwd|pwd|secret|api[_ -]?key|access[_ -]?token|bearer)\b(?:\s*\([^)]*\))?\s*[:=]?\s*\S+/gi,
      },
    ];

    const findings: SensitiveOcrFinding[] = [];

    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;

      let match: RegExpExecArray | null;

      while ((match = pattern.regex.exec(searchableText)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        const matchedWords = wordRanges
          .filter((range) => range.start < matchEnd && range.end > matchStart)
          .map((range) => range.word);

        findings.push({
          type: pattern.type,
          value: match[0],
          words: matchedWords,
        });
      }
    }

    this.sensitiveOcrFindings = findings;
  }

  redactBlockingSensitiveData(): void {
    const blockingTypes = new Set([
      'Possible secret',
      'Bearer token',
      'Aadhaar-like number',
      'PAN-like identifier',
      'Card-like number',
    ]);

    const blockingFindings = this.sensitiveFindings
      .filter((finding) => blockingTypes.has(finding.type))
      .sort((a, b) => b.start - a.start);

    let redactedText = this.rawContentText;

    for (const finding of blockingFindings) {
      redactedText =
        redactedText.slice(0, finding.start) + '[REDACTED]' + redactedText.slice(finding.end);
    }

    this.rawContentText = redactedText;

    // Re-scan the sanitized text.
    this.detectSensitiveText(this.rawContentText);

    // Recalculate the integrity hash for what will actually be preserved.
    this.onContentChanged();

    this.vaultService.showToast('Blocked sensitive data was redacted locally.', 'success');
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

    this.selectedFile = file;
    this.title = file.name.replace(/\.[^/.]+$/, '');

    const isImage = file.type.startsWith('image/');

    const isText =
      file.type.startsWith('text/') ||
      file.name.toLowerCase().endsWith('.txt') ||
      file.name.toLowerCase().endsWith('.md');

    if (isImage) {
      // Do not read image bytes as text.
      // Gemini will receive the original image separately.
      this.rawContentText = '';
      this.redactionImageUrl = URL.createObjectURL(file);
      this.redactionBoxes = [];
      this.isRedactionMode = false;
      await this.runLocalOcr(file);

      this.vaultService.showToast(`Loaded image ${file.name} (${file.size} bytes)`, 'info');

      return;
    }

    if (isText) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.rawContentText = e.target.result || '';
        this.detectSensitiveText(this.rawContentText);
        this.onContentChanged();

        this.vaultService.showToast(`Loaded ${file.name} (${file.size} bytes)`, 'info');
      };

      reader.readAsText(file);
      return;
    }

    this.selectedFile = null;

    this.vaultService.showToast(
      'Unsupported file type. Please upload TXT, MD, PNG, JPG, JPEG, or WEBP.',
      'error',
    );

    event.target.value = '';
  }

  async runLocalOcr(file: File): Promise<void> {
    this.isOcrRunning = true;
    this.ocrText = '';

    const worker = await createWorker('eng');

    try {
      const result = await worker.recognize(file, {}, { blocks: true });
      this.ocrText = result.data.text || '';

      const words = (result.data.blocks || [])
        .flatMap((block) => block.paragraphs || [])
        .flatMap((paragraph) => paragraph.lines || [])
        .flatMap((line) => line.words || []);

      this.ocrWords = words.map((word) => ({
        text: word.text,
        confidence: word.confidence,
        bbox: {
          x0: word.bbox.x0,
          y0: word.bbox.y0,
          x1: word.bbox.x1,
          y1: word.bbox.y1,
        },
      }));

      this.detectSensitiveOcrWords();
    } catch (err) {
      console.error('Local OCR failed:', err);

      this.vaultService.showToast('Could not scan image locally for sensitive text.', 'error');
    } finally {
      await worker.terminate();
      this.isOcrRunning = false;
    }
  }

  applyDetectedImageRedactions(): void {
    if (!this.sensitiveOcrFindings.length) {
      this.vaultService.showToast('No sensitive information detected in this image.', 'info');
      return;
    }

    const boxes: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];

    for (const finding of this.sensitiveOcrFindings) {
      if (!finding.words.length) {
        continue;
      }

      const x0 = Math.min(...finding.words.map((word: OcrWord) => word.bbox.x0));

      const y0 = Math.min(...finding.words.map((word: OcrWord) => word.bbox.y0));

      const x1 = Math.max(...finding.words.map((word: OcrWord) => word.bbox.x1));

      const y1 = Math.max(...finding.words.map((word: OcrWord) => word.bbox.y1));

      const padding = 4;

      boxes.push({
        x: Math.max(0, x0 - padding),
        y: Math.max(0, y0 - padding),
        width: x1 - x0 + padding * 2,
        height: y1 - y0 + padding * 2,
      });
    }

    this.redactionBoxes = boxes;
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
    const isImage = !!this.selectedFile?.type.startsWith('image/');
    let fileToProcess = this.selectedFile;

    if (!this.title || (!this.rawContentText && !isImage)) {
      return;
    }

    if (!isImage && this.hasBlockingSensitiveFindings()) {
      this.vaultService.showToast(
        'Sensitive information detected. Remove or redact blocked data before preserving this artifact.',
        'error',
      );
      return;
    }

    this.isSubmitting = true;

    try {
      const tags = this.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      let sha256: string;

      if (isImage && fileToProcess) {
        // Hash the actual image bytes.
        const fileBuffer = await fileToProcess.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);

        sha256 = Array.from(new Uint8Array(hashBuffer))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
      } else {
        // Existing text path stays unchanged.
        sha256 = this.vaultService.calculateSha256Sync(this.rawContentText);
      }

      const created = await this.vaultService.addArtifact(
        {
          title: this.title,
          category: this.category,
          userRole: this.userRole,
          organization: this.organization,
          provenanceType: this.provenanceType,

          description: isImage
            ? `Preserved image artifact uploaded as original career evidence.`
            : `Preserved ${this.category.toUpperCase()} document containing ${this.getLineCount()} lines of original source context.`,

          rawContentText: this.rawContentText,

          tags,

          fileMetadata: {
            fileName:
              isImage && fileToProcess
                ? fileToProcess.name
                : `${this.title.toLowerCase().replace(/\s+/g, '-')}.md`,

            fileSize: isImage && fileToProcess ? fileToProcess.size : this.rawContentText.length,

            mimeType: isImage && fileToProcess ? fileToProcess.type : 'text/markdown',

            sha256Hash: sha256,
            preservationTimestamp: new Date().toISOString(),
            checksumVerified: true,
          },
        },
        fileToProcess || undefined,
      );

      // Automatically run Gemini extraction
      await this.vaultService.extractEvidenceProfile(created.id, fileToProcess || undefined);

      // Navigate to detail view
      this.router.navigate(['/evidence', created.id]);
    } catch (err: any) {
      this.vaultService.showToast(`Error saving artifact: ${err.message}`, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }
}
