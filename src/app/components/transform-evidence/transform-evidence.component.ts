import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { GeminiService } from '../../services/gemini.service';
import { ClaimCitation, ResumeTransformation } from '../../../types/evidence.types';

@Component({
  selector: 'app-transform-evidence',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (vaultService.selectedArtifact(); as art) {
      <div class="space-y-6 pb-24">
        <!-- Header & Target Role Config -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 pb-5"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <a
                [routerLink]="['/evidence', art.id]"
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
                Evidence Profile
              </a>
              <span class="text-slate-600">/</span>
              <span class="text-xs font-semibold text-blue-400 font-mono"
                >Resume Transformation Studio</span
              >
            </div>

            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Grounded Transformation & Traceability
            </h1>
            <p class="text-xs text-slate-400">
              Transform proof into executive resume bullets. Every generated claim is mapped
              directly to source line citations and requires explicit human approval.
            </p>
          </div>

          <!-- Proof Packet Action -->
          <a
            [routerLink]="['/proof', art.id]"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold border border-blue-500 shadow-md shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] w-fit self-start"
          >
            <svg
              class="w-4 h-4 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Cryptographic Proof Packet</span>
          </a>
        </div>

        <!-- Transformation Control Toolbar (Bento Card) -->
        <div
          class="bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-700/50 space-y-4 shadow-md"
        >
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <!-- Transformation Controls -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <!-- Transform Into -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300"> Transform Into </label>

                <div class="relative">
                  <select
                    [(ngModel)]="transformInto"
                    (ngModelChange)="onTransformIntoChange(art.id)"
                    class="w-full appearance-none pl-3.5 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-white focus:outline-none"
                  >
                    <option value="Resume">Resume</option>
                    <option value="LinkedIn Post">LinkedIn Post</option>
                    <!-- <option value="Career Development">Career Development</option> -->
                  </select>

                  <svg
                    class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>

              <!-- Target Role -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300"> Target Role </label>

                <input
                  type="text"
                  [(ngModel)]="targetRole"
                  placeholder="e.g. Staff Distributed Systems Engineer"
                  class="w-full pl-3.5 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <!-- Format -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-300"> Format </label>

                <div class="relative">
                  <select
                    [(ngModel)]="selectedFramework"
                    (ngModelChange)="saveTransformDropdownState(art.id)"
                    class="w-full appearance-none pl-3.5 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-white focus:outline-none"
                  >
                    @for (format of availableFormats; track format) {
                      <option [value]="format">
                        {{ format }}
                      </option>
                    }
                  </select>

                  <svg
                    class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <!-- Trigger Button -->
            <button
              (click)="triggerNewTransformation(art.id)"
              [disabled]="geminiService.isGeneratingBullets()"
              class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02]"
            >
              @if (geminiService.isGeneratingBullets()) {
                <svg
                  class="w-4 h-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>Grounding Claims with Gemini 2.5...</span>
              } @else {
                <svg
                  class="w-4 h-4"
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
                </svg>
                <span>{{ generateButtonLabel }}</span>
              }
            </button>
          </div>
        </div>

        <!-- Studio Main Area: Generated Bullets (Left) vs Interactive Claim-to-Source Trace Viewer (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Generated LinkedIn Post -->
          <div class="lg:col-span-7 space-y-4" [class.hidden]="transformInto !== 'LinkedIn Post'">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Generated LinkedIn Post (Human Review Required)
                </h3>
              </div>
            </div>

            @if (getLatestLinkedInTransformation(art); as post) {
              <div
                class="bg-slate-800/50 rounded-2xl p-5 border transition-all space-y-4 shadow-md"
                [ngClass]="{
                  'border-emerald-500/50 bg-emerald-950/15': post.reviewStatus === 'approved',
                  'border-amber-500/50 bg-amber-950/15': post.reviewStatus === 'pending',
                  'border-rose-500/50 bg-rose-950/15': post.reviewStatus === 'rejected',
                  'border-blue-500/50 bg-blue-950/15': post.reviewStatus === 'modified',
                }"
              >
                <!-- Top Status & Confidence Row -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    @if (post.reviewStatus === 'approved') {
                      <span
                        class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        APPROVED BY AUTHOR
                      </span>
                    } @else if (post.reviewStatus === 'modified') {
                      <span
                        class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        EDITED BY AUTHOR
                      </span>
                    } @else if (post.reviewStatus === 'rejected') {
                      <span
                        class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        REJECTED
                      </span>
                    } @else {
                      <span
                        class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        AWAITING HUMAN REVIEW
                      </span>
                    }

                    <span class="text-[10px] text-slate-500 font-mono">
                      Grounded LinkedIn Post
                    </span>
                  </div>

                  <div class="flex items-center gap-1.5 text-xs font-mono">
                    <span class="text-slate-400 text-[10px]">Grounded:</span>
                    <span class="font-bold text-emerald-400"> {{ post.overallConfidence }}% </span>
                  </div>
                </div>

                <!-- Generated Post Text -->
                <div
                  class="text-sm font-medium text-slate-100 leading-relaxed pl-3 border-l-2 border-blue-500 whitespace-pre-line"
                >
                  @if (editingLinkedInId === post.id) {
                    <div class="space-y-2">
                      <textarea
                        rows="6"
                        [(ngModel)]="tempLinkedInText"
                        class="w-full p-3 rounded-lg bg-slate-950 border border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white leading-relaxed font-sans"
                      ></textarea>

                      <div class="flex items-center justify-end gap-2">
                        <button
                          (click)="cancelEditingLinkedIn()"
                          class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700"
                        >
                          Cancel
                        </button>

                        <button
                          (click)="saveLinkedInEdit(art.id, post.id)"
                          class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold"
                        >
                          Save Edits
                        </button>
                      </div>
                    </div>
                  } @else {
                    {{ post.postText }}
                  }
                </div>
                <!-- Claim-to-Source Breakdown Chips (Interactive Citation Jump) -->
                <div class="space-y-1.5 pt-2 border-t border-slate-700/50"></div>
                <!-- User Notes -->
                @if (post.userNotes) {
                  <div
                    class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <span class="text-blue-400 font-bold font-mono">AUTHOR NOTE:</span>
                    <span>{{ post.userNotes }}</span>
                  </div>
                }

                <!-- Human Review Action Bar -->
                <div
                  class="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3"
                >
                  <div class="flex items-center gap-1.5">
                    <button
                      (click)="startEditingLinkedIn(post)"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>

                      <span>Edit Text</span>
                    </button>

                    <button
                      (click)="promptLinkedInNote(art.id, post.id)"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      + Note
                    </button>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      (click)="rejectLinkedIn(art.id, post.id)"
                      class="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3 text-rose-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>

                      <span>Reject</span>
                    </button>

                    <button
                      (click)="approveLinkedIn(art.id, post.id)"
                      class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>

                      <span>Approve Post</span>
                    </button>
                  </div>
                </div>
              </div>
            } @else {
              <div
                class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center space-y-4 shadow-md"
              >
                <div
                  class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto"
                >
                  <svg
                    class="w-6 h-6 animate-pulse"
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
                  </svg>
                </div>

                <div>
                  <h3 class="text-base font-bold text-white">Generate Grounded LinkedIn Post</h3>
                  <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Generate a traceable LinkedIn post from this Evidence Profile.
                  </p>
                </div>
              </div>
            }
          </div>
          <div class="lg:col-span-7 space-y-4" [class.hidden]="transformInto === 'LinkedIn Post'">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Generated Resume Bullets (Human Review Required)
                </h3>
              </div>
              <!-- <span class="text-[11px] text-slate-400 font-mono">
                Click claim chips to trace source
              </span> -->
            </div>

            @if (getActiveTransformation(art); as trans) {
              <div class="space-y-4">
                @for (bullet of trans.bulletPoints; track bullet.id) {
                  <div
                    class="bg-slate-800/50 rounded-2xl p-5 border transition-all space-y-4 shadow-md"
                    [ngClass]="{
                      'border-emerald-500/50 bg-emerald-950/15': bullet.reviewStatus === 'approved',
                      'border-amber-500/50 bg-amber-950/15': bullet.reviewStatus === 'pending',
                      'border-rose-500/50 bg-rose-950/15': bullet.reviewStatus === 'rejected',
                      'border-blue-500/50 bg-blue-950/15': bullet.reviewStatus === 'modified',
                    }"
                  >
                    <!-- Top Status & Confidence Row -->
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <!-- Review Status Pill -->
                        @if (bullet.reviewStatus === 'approved') {
                          <span
                            class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                          >
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            APPROVED BY AUTHOR
                          </span>
                        } @else if (bullet.reviewStatus === 'modified') {
                          <span
                            class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"
                          >
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            EDITED & APPROVED
                          </span>
                        } @else if (bullet.reviewStatus === 'rejected') {
                          <span
                            class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                          >
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            REJECTED
                          </span>
                        } @else {
                          <span
                            class="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                          >
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"
                            ></span>
                            AWAITING HUMAN REVIEW
                          </span>
                        }

                        <span class="text-[10px] text-slate-500 font-mono">{{
                          bullet.framework
                        }}</span>
                      </div>

                      <div class="flex items-center gap-1.5 text-xs font-mono">
                        <span class="text-slate-400 text-[10px]">Grounded:</span>
                        <span class="font-bold text-emerald-400"
                          >{{ bullet.overallConfidence }}%</span
                        >
                      </div>
                    </div>

                    <!-- Bullet Text (Editable or Display) -->
                    @if (editingBulletId === bullet.id) {
                      <div class="space-y-2">
                        <textarea
                          rows="3"
                          [(ngModel)]="tempEditText"
                          class="w-full p-3 rounded-lg bg-slate-950 border border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white leading-relaxed font-sans"
                        ></textarea>
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="cancelEditing()"
                            class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            (click)="saveEditing(art.id, trans.id, bullet.id)"
                            class="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold"
                          >
                            Save Edits
                          </button>
                        </div>
                      </div>
                    } @else {
                      <div
                        class="text-sm font-medium text-slate-100 leading-relaxed pl-3 border-l-2 border-blue-500"
                      >
                        {{ bullet.bulletText }}
                      </div>
                    }

                    <!-- Claim-to-Source Breakdown Chips (Interactive Citation Jump) -->
                    <div class="space-y-1.5 pt-2 border-t border-slate-700/50">
                      <div class="flex items-center justify-between text-[11px]">
                        <!-- <span class="text-slate-400 font-medium">Decomposed Claims & Groundings:</span>
                        <span class="text-[10px] text-blue-400 font-mono font-bold">CLICK TO TRACE ↗</span> -->
                        <span class="text-slate-400 font-medium">CLAIMS IN THIS BULLET</span>
                        <span class="text-[10px] text-blue-400 font-mono font-bold">
                          SELECT A CLAIM TO TRACE ↗
                        </span>
                      </div>

                      <div class="flex flex-wrap gap-1.5">
                        @for (claim of bullet.claims; track claim.claimId) {
                          <button
                            (click)="selectClaim(claim)"
                            class="px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 text-left border"
                            [ngClass]="
                              selectedClaim()?.claimId === claim.claimId
                                ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40'
                                : claim.sourceType === 'source_backed'
                                  ? 'bg-slate-900 text-emerald-300 border-slate-700 hover:border-emerald-500/50'
                                  : 'bg-slate-900 text-amber-300 border-slate-700 hover:border-amber-500/50'
                            "
                          >
                            <span
                              class="w-1.5 h-1.5 rounded-full"
                              [ngClass]="
                                claim.sourceType === 'source_backed'
                                  ? 'bg-emerald-400'
                                  : 'bg-amber-400'
                              "
                            ></span>
                            <span class="font-mono text-[10px] uppercase text-slate-400"
                              >[{{ claim.claimType }}]</span
                            >
                            <span class="truncate max-w-[200px]">{{ claim.claimText }}</span>
                            <span class="text-[10px] font-mono text-slate-500 ml-1"
                              >{{ claim.confidenceScore }}%</span
                            >
                          </button>
                        }
                      </div>
                    </div>

                    <!-- User Notes (if any) -->
                    @if (bullet.userNotes) {
                      <div
                        class="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span class="text-blue-400 font-bold font-mono">AUTHOR NOTE:</span>
                        <span>{{ bullet.userNotes }}</span>
                      </div>
                    }

                    <!-- Human Review Action Bar -->
                    <div
                      class="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div class="flex items-center gap-1.5">
                        <button
                          (click)="startEditing(bullet)"
                          class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <svg
                            class="w-3 h-3 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span>Edit Text</span>
                        </button>

                        <button
                          (click)="promptUserNote(art.id, trans.id, bullet.id)"
                          class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                        >
                          + Note
                        </button>
                      </div>

                      <!-- Review Actions: Approve / Reject -->
                      <div class="flex items-center gap-2">
                        <button
                          (click)="rejectBullet(art.id, trans.id, bullet.id)"
                          class="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <svg
                            class="w-3 h-3 text-rose-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          <span>Reject</span>
                        </button>

                        <button
                          (click)="approveBullet(art.id, trans.id, bullet.id)"
                          class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                        >
                          <svg
                            class="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Approve Claim</span>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- No Transformations Yet -->
              <div
                class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center space-y-4 shadow-md"
              >
                <div
                  class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto"
                >
                  <svg
                    class="w-6 h-6 animate-pulse"
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
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-white">
                    Generate Verified Resume Transformation
                  </h3>
                  <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Click "Generate Grounded Bullets" above to transform this
                    {{ art.category }} proof into traceable executive resume bullets.
                  </p>
                </div>
                <button
                  (click)="triggerNewTransformation(art.id)"
                  class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all"
                >
                  Start Gemini Transformation
                </button>
              </div>
            }
          </div>

          <!-- Right Column: Interactive Source Trace & Citation Inspector (5 Cols) -->
          <div class="lg:col-span-5 lg:col-start-8 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Claim-to-Source Inspector
                </h3>
              </div>
              <!-- <span class="text-[10px] text-cyan-400 font-mono">LIVE_GROUNDING_CHECK</span> -->
            </div>

            <!-- Active Claim Inspector Box (Bento Card) -->
            @if (selectedClaim(); as claim) {
              <div
                class="bg-slate-800/50 rounded-2xl p-5 border border-blue-500/50 bg-blue-950/15 space-y-4 shadow-md"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-1">
                    <span
                      class="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-900/60 text-blue-300 border border-blue-700"
                    >
                      {{ claim.claimType }} Claim
                    </span>
                    <h4 class="text-xs font-bold text-white mt-1">"{{ claim.claimText }}"</h4>
                  </div>

                  <div class="text-right shrink-0">
                    <div class="text-xs font-bold font-mono text-emerald-400">
                      {{ claim.confidenceScore }}%
                    </div>
                    <div class="text-[9px] text-slate-400 uppercase font-mono">GROUNDEDNESS</div>
                  </div>
                </div>

                <!-- Provenance Status -->
                <div class="flex items-center gap-2 text-xs">
                  <span class="text-slate-400 font-medium">Provenance:</span>
                  @if (claim.sourceType === 'source_backed') {
                    <span
                      class="px-2 py-0.5 text-[11px] font-semibold font-mono text-emerald-300 bg-emerald-950/60 rounded border border-emerald-800/40 flex items-center gap-1"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Source-Backed (Primary Artifact)
                    </span>
                  } @else {
                    <span
                      class="px-2 py-0.5 text-[11px] font-semibold font-mono text-amber-300 bg-amber-950/60 rounded border border-amber-800/40 flex items-center gap-1"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Self-Reported Claim
                    </span>
                  }
                </div>

                <!-- Verbatim Source Citation -->
                <div class="space-y-1 pt-2 border-t border-slate-700/50">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-blue-300 font-semibold">Matched Source Citation:</span>
                    <span class="text-slate-400 font-mono text-[10px]">{{
                      claim.lineReference || 'Artifact Context'
                    }}</span>
                  </div>

                  <div
                    class="p-3 rounded-lg bg-slate-950 border border-emerald-500/40 text-xs font-mono text-emerald-300 leading-relaxed relative"
                  >
                    <div
                      class="absolute -top-2 right-3 px-1.5 py-0.2 text-[9px] font-bold bg-emerald-900 text-emerald-300 rounded font-mono"
                    >
                      EXACT ARTIFACT MATCH
                    </div>
                    "{{ claim.sourceQuote }}"
                  </div>
                </div>
              </div>
            } @else {
              <div
                class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 text-center space-y-2 shadow-md"
              >
                <p class="text-xs text-slate-300 font-medium">Select any claim pill above</p>
                <p class="text-[11px] text-slate-500">
                  Credence will jump directly to the exact source quote proving that claim with
                  confidence metrics.
                </p>
              </div>
            }

            <!-- Preserved Source Document Snapshot (Bento Card) -->
            <div
              class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[460px] shadow-md"
            >
              <div
                class="p-3 bg-slate-900/80 border-b border-slate-700/50 flex items-center justify-between text-[11px] font-mono"
              >
                <span class="text-slate-300 font-medium truncate">{{
                  art.fileMetadata.fileName
                }}</span>
                <span class="text-emerald-400 font-bold shrink-0">INTEGRITY VERIFIED</span>
              </div>

              @if (art.fileMetadata.mimeType.startsWith('image/') && art.fileMetadata.storageUrl) {
                <div
                  class="p-4 overflow-auto flex-1 bg-slate-950/80 flex items-center justify-center"
                >
                  <img
                    [src]="art.fileMetadata.storageUrl"
                    [alt]="art.title"
                    class="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              } @else {
                <div
                  class="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed space-y-1 bg-slate-950/80"
                >
                  @for (line of getSourceLines(art.rawContentText); track $index) {
                    <div
                      class="flex items-start gap-3 py-0.5 px-1.5 rounded transition-all"
                      [ngClass]="{
                        'bg-blue-950/90 border-l-2 border-blue-400 text-white font-semibold':
                          isLineHighlighted(line),
                        'hover:bg-slate-900/50': !isLineHighlighted(line),
                      }"
                    >
                      <span
                        class="text-[10px] text-slate-600 font-mono w-5 text-right shrink-0 select-none"
                      >
                        {{ $index + 1 }}
                      </span>

                      <span class="flex-1 whitespace-pre-wrap break-words">
                        {{ line }}
                      </span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class TransformEvidenceComponent implements OnInit {
  vaultService = inject(EvidenceVaultService);
  geminiService = inject(GeminiService);
  route = inject(ActivatedRoute);

  targetRole = 'Staff / Principal Engineer';
  transformInto = 'Resume';
  resumeFormats = [
    'XYZ (Accomplished [X] measured by [Y] by doing [Z])',
    'CAR (Context-Action-Result)',
    'STAR (Situation-Task-Action-Result)',
    'Executive Brief',
  ];

  linkedinFormats = ['Grounded LinkedIn Post'];

  // careerDevelopmentFormats = ['Performance Review Statement', 'STAR Interview Story'];
  selectedFramework = 'XYZ (Accomplished [X] measured by [Y] by doing [Z])';
  selectedClaim = this.vaultService.activeHighlightedClaim;

  linkedinPostResult: Awaited<ReturnType<GeminiService['generateLinkedInPost']>> | null = null;

  editingBulletId: string | null = null;
  tempEditText = '';

  editingLinkedInId: string | null = null;
  tempLinkedInText = '';

  getLatestLinkedInTransformation(art: any) {
    if (this.linkedinPostResult) {
      return this.linkedinPostResult;
    }

    if (art.linkedinTransformations?.length) {
      return art.linkedinTransformations[0];
    }

    return null;
  }

  onTransformIntoChange(artifactId: string): void {
  this.selectedFramework = this.availableFormats[0];
  this.saveTransformDropdownState(artifactId);
}

saveTransformDropdownState(artifactId: string): void {
  localStorage.setItem(
    `credence-transform-ui-${artifactId}`,
    JSON.stringify({
      transformInto: this.transformInto,
      selectedFramework: this.selectedFramework,
    })
  );
}

restoreTransformDropdownState(artifactId: string): void {
  const saved = localStorage.getItem(`credence-transform-ui-${artifactId}`);

  if (!saved) {
    return;
  }

  try {
    const state = JSON.parse(saved);

    if (state.transformInto === 'Resume' || state.transformInto === 'LinkedIn Post') {
      this.transformInto = state.transformInto;
    }

    if (this.availableFormats.includes(state.selectedFramework)) {
      this.selectedFramework = state.selectedFramework;
    } else {
      this.selectedFramework = this.availableFormats[0];
    }
  } catch {
    // Keep defaults if saved state is invalid.
  }
}

  get availableFormats(): string[] {
    if (this.transformInto === 'LinkedIn Post') {
      return this.linkedinFormats;
    }

    // if (this.transformInto === 'Career Development') {
    //   return this.careerDevelopmentFormats;
    // }

    return this.resumeFormats;
  }

  get generateButtonLabel(): string {
    if (this.transformInto === 'LinkedIn Post') {
      return 'Generate Grounded Post';
    }

    // if (this.transformInto === 'Career Development') {
    //   if (this.selectedFramework === 'STAR Interview Story') {
    //     return 'Generate Grounded Story';
    //   }

    //   return 'Generate Grounded Statement';
    // }

    return 'Generate Grounded Bullets';
  }

  startEditingLinkedIn(post: any): void {
    this.editingLinkedInId = post.id;
    this.tempLinkedInText = post.postText;
  }

  cancelEditingLinkedIn(): void {
    this.editingLinkedInId = null;
    this.tempLinkedInText = '';
  }

  async saveLinkedInEdit(artifactId: string, transformationId: string): Promise<void> {
    if (!this.tempLinkedInText.trim()) return;

    await this.vaultService.editLinkedInPost(
      artifactId,
      transformationId,
      this.tempLinkedInText.trim(),
    );

    this.linkedinPostResult = null;
    this.editingLinkedInId = null;
    this.tempLinkedInText = '';
  }

  async approveLinkedIn(artifactId: string, transformationId: string): Promise<void> {
    await this.vaultService.approveLinkedInPost(artifactId, transformationId);

    this.linkedinPostResult = null;
  }

  async rejectLinkedIn(artifactId: string, transformationId: string): Promise<void> {
    await this.vaultService.rejectLinkedInPost(artifactId, transformationId);

    this.linkedinPostResult = null;
  }

  async promptLinkedInNote(artifactId: string, transformationId: string): Promise<void> {
    const note = prompt('Enter verification note or author context for this LinkedIn post:');

    if (note !== null && note.trim()) {
      await this.vaultService.addLinkedInNote(artifactId, transformationId, note.trim());

      this.linkedinPostResult = null;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.vaultService.selectArtifact(id);
        this.restoreTransformDropdownState(id);

        const art = this.vaultService.selectedArtifact();
        if (art) {
          this.targetRole = art.userRole || 'Staff Technical Leader';

          const trans = this.getActiveTransformation(art);

          if (trans && trans.bulletPoints.length > 0 && trans.bulletPoints[0].claims.length > 0) {
            this.selectClaim(trans.bulletPoints[0].claims[0]);
          }
        }
      }
    });
  }

  getActiveTransformation(art: any): ResumeTransformation | null {
    if (art.transformations && art.transformations.length > 0) {
      return art.transformations[0];
    }
    return null;
  }

  getSourceLines(rawText: string): string[] {
    return (rawText || '').split('\n');
  }

  selectClaim(claim: ClaimCitation): void {
    this.vaultService.setHighlightedClaim(claim);
  }

  isLineHighlighted(line: string): boolean {
    const claim = this.selectedClaim();
    if (!claim || !claim.sourceQuote) return false;
    const cleanLine = line.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuote = claim.sourceQuote.toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      cleanQuote.includes(cleanLine) ||
      cleanLine.includes(cleanQuote.substring(0, Math.min(20, cleanQuote.length)))
    );
  }

  async triggerNewTransformation(artifactId: string): Promise<void> {
    if (this.transformInto === 'LinkedIn Post') {
      const art = this.vaultService.artifacts().find((a) => a.id === artifactId);

      if (!art) {
        return;
      }

      if (!art.profile) {
        await this.vaultService.extractEvidenceProfile(artifactId);
      }

      const refreshedArtifact = this.vaultService.artifacts().find((a) => a.id === artifactId);

      if (!refreshedArtifact?.profile) {
        return;
      }

      const result = await this.vaultService.generateLinkedInTransformation(
        artifactId,
        this.targetRole,
      );

      if (!result) {
        return;
      }

      this.linkedinPostResult = result;

      if (result.claims.length > 0) {
        this.selectClaim(result.claims[0]);
      }

      return;
    }

    const result = await this.vaultService.generateResumeTransformation(
      artifactId,
      this.targetRole,
      this.selectedFramework,
    );

    if (result && result.bulletPoints.length > 0 && result.bulletPoints[0].claims.length > 0) {
      this.selectClaim(result.bulletPoints[0].claims[0]);
    }
  }

  approveBullet(artifactId: string, transformationId: string, bulletId: string): void {
    this.vaultService.approveBullet(artifactId, transformationId, bulletId);
  }

  rejectBullet(artifactId: string, transformationId: string, bulletId: string): void {
    this.vaultService.rejectBullet(artifactId, transformationId, bulletId);
  }

  startEditing(bullet: any): void {
    this.editingBulletId = bullet.id;
    this.tempEditText = bullet.bulletText;
  }

  cancelEditing(): void {
    this.editingBulletId = null;
    this.tempEditText = '';
  }

  saveEditing(artifactId: string, transformationId: string, bulletId: string): void {
    if (this.tempEditText.trim()) {
      this.vaultService.editBulletText(
        artifactId,
        transformationId,
        bulletId,
        this.tempEditText.trim(),
      );
      this.editingBulletId = null;
    }
  }

  promptUserNote(artifactId: string, transformationId: string, bulletId: string): void {
    const note = prompt('Enter verification note or author context for this bullet:');
    if (note !== null && note.trim()) {
      this.vaultService.approveBullet(artifactId, transformationId, bulletId, note.trim());
    }
  }
}
