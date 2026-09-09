import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-proof-packet',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (vaultService.selectedArtifact(); as art) {
      <div class="max-w-4xl mx-auto space-y-6 pb-24">
        <!-- Header & Action Bar -->
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
                Vault
              </a>
              <span class="text-slate-600">/</span>
              <span class="text-xs font-semibold text-emerald-400 font-mono">Proof Packet</span>
            </div>

            <h1 class="text-2xl font-bold text-white tracking-tight">
              Cryptographic Career Proof Packet
            </h1>
            <p class="text-xs text-slate-400">
              An unalterable audit bundle connecting the original preserved artifact, Gemini
              extraction schemas, and author-approved claims.
            </p>
          </div>

          <!-- Packet Actions -->
          <div class="flex items-center gap-2.5 shrink-0">
            <button
              (click)="downloadManifest(art)"
              class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all flex items-center gap-1.5"
            >
              <svg
                class="w-3.5 h-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Download Proof Packet</span>
            </button>

            <button
              (click)="copyVerificationLink(art)"
              class="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Copy Verification Seal</span>
            </button>
          </div>
        </div>

        <!-- The Proof Packet Document (Printable / Auditable Bento Card) -->
        <div
          class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
        >
          <!-- Seal Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/50"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-white uppercase tracking-wider font-mono"
                    >Credence Cryptographic Seal</span
                  >
                  <span
                    class="px-2 py-0.2 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono"
                    >VERIFIED</span
                  >
                </div>
                <div class="text-xs text-slate-400 font-mono">
                  Packet ID: CRED-{{ art.id.toUpperCase() }}-AUDIT
                </div>
              </div>
            </div>

            <div class="text-right font-mono text-xs text-slate-400">
              <div>
                Sealed Timestamp:
                <span class="text-slate-200">{{
                  art.fileMetadata.preservationTimestamp | date: 'medium'
                }}</span>
              </div>
              <div class="text-[11px] text-emerald-400 font-bold">Cloud Firestore Record</div>
            </div>
          </div>

          <!-- Cryptographic Metadata Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono"
          >
            <div class="space-y-1 truncate">
              <span class="text-slate-400 text-[10px] uppercase font-bold"
                >Artifact SHA-256 Checksum:</span
              >
              <div class="text-emerald-400 font-semibold truncate">
                {{ art.fileMetadata.sha256Hash }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[10px] uppercase font-bold"
                >Provenance Classification:</span
              >
              <div class="text-slate-200 font-semibold capitalize flex items-center gap-1.5">
                <span
                  class="w-2 h-2 rounded-full"
                  [ngClass]="
                    art.provenanceType === 'source_backed' ? 'bg-emerald-400' : 'bg-amber-400'
                  "
                ></span>
                {{ art.provenanceType.replace('_', ' ') }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[10px] uppercase font-bold"
                >Author Claimed Role:</span
              >
              <div class="text-slate-200 font-semibold">{{ art.userRole }}</div>
            </div>
            <div class="space-y-1">
              <span class="text-slate-400 text-[10px] uppercase font-bold"
                >Preserved Organization:</span
              >
              <div class="text-slate-200 font-semibold">{{ art.organization }}</div>
            </div>
          </div>

          <!-- Section 1: Preserved Proof Summary -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              1. Original Work Artifact
            </h3>
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
              <div class="font-bold text-white text-sm">{{ art.title }}</div>
              <p class="text-xs text-slate-300 leading-relaxed">{{ art.description }}</p>
              <div class="flex flex-wrap gap-1.5 pt-1">
                @for (t of art.tags; track t) {
                  <span
                    class="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono border border-slate-700"
                    >{{ t }}</span
                  >
                }
              </div>
            </div>
          </div>

          <!-- Section 2: Structured Evidence Profile & Grounded Metrics -->
          @if (art.profile; as prof) {
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  2. Gemini Multimodal Extraction
                </h3>
                <span class="text-xs font-bold font-mono text-blue-400"
                  >{{ prof.sourceBackingRatio }}% Source-Grounded Ratio</span
                >
              </div>

              <!-- Metrics -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (m of prof.metrics; track m.id) {
                  <div
                    class="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs space-y-1"
                  >
                    <div class="flex items-center justify-between font-bold">
                      <span class="text-slate-200">{{ m.metricName }}</span>
                      <span class="text-emerald-400 font-mono">{{ m.achievedValue }}</span>
                    </div>
                    <div class="text-[11px] font-mono text-slate-400 italic">"{{ m.quote }}"</div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Section 3: Final Human-Approved Transformations -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              3. Verified Human-Approved Transformations
            </h3>

            <div class="space-y-3">
              <!-- Approved Resume Bullets -->
              @for (trans of art.transformations; track trans.id) {
                @for (bullet of trans.bulletPoints; track bullet.id) {
                  @if (bullet.reviewStatus === 'approved') {
                    <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="font-bold text-emerald-400 font-mono"> RESUME BULLET </span>

                        <span class="font-mono text-slate-400">
                          {{ bullet.overallConfidence }}% Traceability Score
                        </span>
                      </div>

                      <div
                        class="text-xs text-slate-100 font-medium leading-relaxed pl-2 border-l-2 border-emerald-400"
                      >
                        {{ bullet.bulletText }}
                      </div>

                      <div class="text-[11px] font-bold text-emerald-400 font-mono">
                        Sign-off: {{ bullet.reviewedBy || 'Verified Professional Author' }}
                      </div>
                    </div>
                  }
                }
              }

              <!-- Approved LinkedIn Posts -->
              @for (post of art.linkedinTransformations || []; track post.id) {
                @if (post.reviewStatus === 'approved') {
                  <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="font-bold text-blue-400 font-mono"> LINKEDIN POST </span>

                      <span class="font-mono text-slate-400">
                        {{ post.overallConfidence }}% Traceability Score
                      </span>
                    </div>

                    <div
                      class="text-xs text-slate-100 font-medium leading-relaxed pl-2 border-l-2 border-blue-400 whitespace-pre-line"
                    >
                      {{ post.postText }}
                    </div>

                    <div class="text-[11px] font-bold text-emerald-400 font-mono">
                      Sign-off: {{ post.reviewedBy || 'Verified Professional Author' }}
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Bottom Audit Declaration -->
          <div
            class="pt-4 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500 font-mono"
          >
            <span>Powered by Google Gemini 2.5 Flash & Firebase Vault</span>
            <span>https://credence.app/verify/{{ art.id }}</span>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProofPacketComponent implements OnInit {
  vaultService = inject(EvidenceVaultService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.vaultService.selectArtifact(id);
      }
    });
  }

  downloadManifest(art: any): void {
    const doc = new jsPDF();

    const left = 20;
    const right = 190;
    const contentWidth = 170;
    const pageBottom = 275;

    let y = 20;

    // Keep long packets from overflowing the page.
    const ensureSpace = (requiredHeight: number): void => {
      if (y + requiredHeight > pageBottom) {
        doc.addPage();
        y = 20;
      }
    };

    const addDivider = (): void => {
      doc.setDrawColor(226, 232, 240);
      doc.line(left, y, right, y);
      y += 8;
    };

    const formatProvenance = (value: string | undefined): string => {
      if (!value) return 'NOT AVAILABLE';

      return value.replace(/_/g, '-').toUpperCase();
    };

    const sealedTimestamp = art.fileMetadata?.preservationTimestamp
      ? new Date(art.fileMetadata.preservationTimestamp).toLocaleString()
      : 'Not available';

    // ---------------------------------------------------------
    // DOCUMENT HEADER
    // ---------------------------------------------------------

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 34, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(255);
    doc.text('CREDENCE PROOF PACKET', left, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);

    doc.text(`Packet ID: CRED-${art.id.toUpperCase()}-AUDIT`, left, 25);

    doc.setFillColor(52, 211, 153);
    doc.circle(157, 17, 1.6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(167, 243, 208);

    doc.text('VERIFIED EVIDENCE', 162, 18.2);

    y = 44;

    // ---------------------------------------------------------
    // 1. PRESERVED SOURCE ARTIFACT
    // ---------------------------------------------------------

    doc.setTextColor(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. PRESERVED SOURCE ARTIFACT', left, y);

    y += 9;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Artifact', left, y);

    doc.setFont('helvetica', 'normal');
    doc.text(art.title || 'Not provided', 52, y);

    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Role', left, y);

    doc.setFont('helvetica', 'normal');
    doc.text(art.userRole || 'Not provided', 52, y);

    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Organization', left, y);

    doc.setFont('helvetica', 'normal');
    doc.text(art.organization || 'Not provided', 52, y);

    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Sealed', left, y);

    doc.setFont('helvetica', 'normal');
    doc.text(sealedTimestamp, 52, y);

    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Provenance', left, y);

    doc.setFont('helvetica', 'normal');
    doc.text(formatProvenance(art.provenanceType), 52, y);

    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text('ARTIFACT SHA-256 CHECKSUM', left, y);

    y += 6;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30);

    const hashLines = doc.splitTextToSize(
      art.fileMetadata?.sha256Hash || 'Not available',
      contentWidth,
    );

    doc.text(hashLines, left, y);

    y += hashLines.length * 4 + 8;

    addDivider();

    // ---------------------------------------------------------
    // 2. GEMINI MULTIMODAL EXTRACTION
    // ---------------------------------------------------------

    ensureSpace(55);

    doc.setTextColor(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. GEMINI MULTIMODAL EXTRACTION', left, y);

    y += 8;

    if (art.profile) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      doc.text(
        `SOURCE-GROUNDED RATIO: ${art.profile.sourceBackingRatio ?? 'Not available'}%`,
        left,
        y,
      );

      y += 9;

      for (const metric of art.profile.metrics || []) {
        ensureSpace(25);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);

        const metricTitle = `${metric.metricName || 'Metric'}: ${metric.achievedValue || ''}`;

        const metricTitleLines = doc.splitTextToSize(metricTitle, contentWidth);

        doc.text(metricTitleLines, left, y);

        y += metricTitleLines.length * 5;

        if (metric.quote) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.setTextColor(90);

          const quoteLines = doc.splitTextToSize(`"${metric.quote}"`, 160);

          doc.text(quoteLines, 25, y);

          y += quoteLines.length * 4.5 + 6;

          doc.setTextColor(30);
        } else {
          y += 5;
        }
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('No Gemini extraction profile available.', left, y);

      y += 7;
    }

    y += 3;
    addDivider();

    // ---------------------------------------------------------
    // 3. VERIFIED HUMAN-APPROVED CLAIMS
    // ---------------------------------------------------------

    ensureSpace(30);

    doc.setTextColor(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. VERIFIED HUMAN-APPROVED TRANSFORMATIONS', left, y);

    y += 9;

    const approvedBullets = (art.transformations || [])
      .flatMap((trans: any) => trans.bulletPoints || [])
      .filter((bullet: any) => bullet.reviewStatus === 'approved');

    const approvedLinkedInPosts = (art.linkedinTransformations || []).filter(
      (post: any) => post.reviewStatus === 'approved',
    );

    if (approvedBullets.length > 0) {
      for (const bullet of approvedBullets) {
        const bulletLines = doc.splitTextToSize(bullet.bulletText, contentWidth);

        const estimatedHeight = bulletLines.length * 5 + 18;

        ensureSpace(estimatedHeight);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30);

        doc.text(bulletLines, left, y);

        y += bulletLines.length * 5 + 3;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(70);

        doc.text(`SIGN-OFF: ${bullet.reviewedBy || 'Verified Professional Author'}`, 25, y);

        y += 5;

        doc.text(`TRACEABILITY SCORE: ${bullet.overallConfidence ?? 'Not available'}%`, 25, y);

        y += 10;
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      doc.text('No human-approved claims are available for this artifact.', left, y);

      y += 7;
    }

    if (approvedLinkedInPosts.length > 0) {
      for (const post of approvedLinkedInPosts) {
        const postLines = doc.splitTextToSize(post.postText, contentWidth);

        const estimatedHeight = postLines.length * 5 + 23;

        ensureSpace(estimatedHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(37, 99, 235);
        doc.text('LINKEDIN POST', left, y);

        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30);
        doc.text(postLines, left, y);

        y += postLines.length * 5 + 3;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(70);

        doc.text(`SIGN-OFF: ${post.reviewedBy || 'Verified Professional Author'}`, 25, y);

        y += 5;

        doc.text(`TRACEABILITY SCORE: ${post.overallConfidence ?? 'Not available'}%`, 25, y);

        y += 10;
      }
    }

    // ---------------------------------------------------------
    // FOOTER + PAGE NUMBERS
    // ---------------------------------------------------------

    const pageCount = doc.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);

      doc.setDrawColor(220);
      doc.line(left, 282, right, 282);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.setFont('helvetica', 'bold');

      doc.text('CREDENCE', left, 288);

      doc.setFont('helvetica', 'normal');

      doc.text('Career evidence, preserved and grounded', left + 18, 288);

      doc.text(`Page ${page} of ${pageCount}`, right, 288, { align: 'right' });
    }

    doc.save(`credence-proof-${art.id}.pdf`);

    this.vaultService.showToast('Downloaded Credence Proof Packet', 'success');
  }
  copyVerificationLink(art: any): void {
    const text = `--- CREDENCE VERIFIABLE CAREER PROOF ---
    Artifact: ${art.title}
    Author: ${art.userRole} (${art.organization})
    SHA-256 Integrity: ${art.fileMetadata.sha256Hash}
    Verification Seal: https://credence.app/verify/${art.id}
    ----------------------------------------`;
    navigator.clipboard.writeText(text);
    this.vaultService.showToast('Copied signed verification seal to clipboard', 'info');
  }
}
