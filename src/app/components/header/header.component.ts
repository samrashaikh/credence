import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EvidenceVaultService } from '../../services/evidence-vault.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-4">
          
          <!-- Logo & Brand Identity -->
          <div class="flex items-center gap-6">
            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/30 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                C
              </div>
              <div class="flex items-center">
                <span class="text-xl font-semibold tracking-tight uppercase text-white border-l border-slate-700 pl-3 group-hover:text-blue-400 transition-colors">Credence</span>
                <span class="ml-2.5 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Vault</span>
              </div>
            </a>

            <!-- Nav Links -->
            <nav class="hidden md:flex items-center gap-2">
              <a 
                routerLink="/vault" 
                routerLinkActive="bg-slate-800 text-blue-400 border-slate-700 font-semibold shadow-sm"
                [routerLinkActiveOptions]="{exact: false}"
                class="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 border border-transparent transition-all flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                Evidence Vault
              </a>

              <a 
                routerLink="/upload" 
                routerLinkActive="bg-slate-800 text-blue-400 border-slate-700 font-semibold shadow-sm"
                class="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 border border-transparent transition-all flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                Upload Proof
              </a>

              <a 
                routerLink="/review-queue" 
                routerLinkActive="bg-slate-800 text-blue-400 border-slate-700 font-semibold shadow-sm"
                class="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 border border-transparent transition-all flex items-center gap-1.5 relative"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Human Review
                @if (vaultService.vaultStats().pendingReviewCount > 0) {
                  <span class="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {{ vaultService.vaultStats().pendingReviewCount }}
                  </span>
                }
              </a>
            </nav>
          </div>

          <!-- Quick Metrics Bar & Actions -->
          <div class="flex items-center gap-3">
            
            <!-- Groundedness Badge -->
            <div class="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span class="font-mono text-emerald-400 font-bold">{{ vaultService.vaultStats().averageGroundednessScore }}%</span>
              <span class="text-slate-400">Integrity Index</span>
            </div>

            <!-- Upload CTA -->
            <a 
              routerLink="/upload"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              <span>Capture Proof</span>
            </a>

            <!-- Auth Status / Demo Persona -->
            <div class="relative group">
              @if (firebaseService.currentUser(); as user) {
                <button 
                  class="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-left transition-colors"
                  (click)="showUserDropdown = !showUserDropdown"
                >
                  <div class="w-7 h-7 rounded-md bg-slate-700 border border-slate-600 text-white flex items-center justify-center text-xs font-bold">
                    {{ user.displayName.charAt(0) }}
                  </div>
                  <div class="hidden sm:flex flex-col pr-1">
                    <span class="text-xs font-medium text-slate-200 truncate max-w-[130px] leading-tight">{{ user.displayName }}</span>
                    <span class="text-[10px] text-emerald-400 flex items-center gap-1 leading-tight">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Verified Author
                    </span>
                  </div>
                  <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                @if (showUserDropdown) {
                  <div class="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs text-slate-300 animate-fade-in">
                    <div class="p-2 border-b border-slate-800 mb-1">
                      <div class="font-semibold text-white truncate">{{ user.displayName }}</div>
                      <div class="text-[11px] text-slate-400 truncate">{{ user.email }}</div>
                      <div class="mt-2 flex items-center gap-1.5 text-[10px] text-blue-300 bg-blue-950/60 p-1.5 rounded border border-blue-800/40">
                        <svg class="w-3.5 h-3.5 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>Firebase Auth: Signed in with Google Credentials</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <button 
                        (click)="switchPersona('google'); showUserDropdown = false"
                        class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
                      >
                        <span>Switch: Alex Chen (Staff Architect)</span>
                        <span class="text-[10px] text-blue-400">Google Verified</span>
                      </button>
                      
                      <button 
                        (click)="switchPersona('recruiter'); showUserDropdown = false"
                        class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
                      >
                        <span>Switch: Hiring Auditor (Audit Mode)</span>
                        <span class="text-[10px] text-amber-400">Auditor</span>
                      </button>

                      <button 
                        (click)="resetSeeds(); showUserDropdown = false"
                        class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300"
                      >
                        <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                        <span>Reset Seed Work Artifacts</span>
                      </button>

                      <div class="border-t border-slate-800 pt-1 mt-1">
                        <button 
                          (click)="signOut(); showUserDropdown = false"
                          class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2"
                        >
                          <svg class="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="21" y1="12" y2="12"/><line x1="9" x2="21" y1="12" y2="12"/></svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              } @else {
                <button 
                  (click)="firebaseService.signInWithGoogle()"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white shadow-sm"
                >
                  <svg class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
                  </svg>
                  <span>Google Sign-In</span>
                </button>
              }
            </div>

          </div>

        </div>
      </div>
    </header>

    <!-- Global Toast Notifications -->
    @if (vaultService.toastMessage(); as toast) {
      <div class="fixed bottom-5 right-5 z-50 animate-fade-in">
        <div 
          class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md text-xs font-medium max-w-md"
          [ngClass]="{
            'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-500/10': toast.type === 'success',
            'bg-slate-900/95 border-indigo-500/50 text-indigo-300 shadow-indigo-500/10': toast.type === 'info',
            'bg-slate-900/95 border-amber-500/50 text-amber-300 shadow-amber-500/10': toast.type === 'warning',
            'bg-slate-900/95 border-rose-500/50 text-rose-300 shadow-rose-500/10': toast.type === 'error'
          }"
        >
          @if (toast.type === 'success') {
            <svg class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          } @else if (toast.type === 'info') {
            <svg class="w-4 h-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
          } @else {
            <svg class="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          }
          <span>{{ toast.text }}</span>
        </div>
      </div>
    }
  `
})
export class HeaderComponent {
  vaultService = inject(EvidenceVaultService);
  firebaseService = inject(FirebaseService);
  showUserDropdown = false;

  switchPersona(type: 'google' | 'guest' | 'recruiter'): void {
    this.firebaseService.simulateLogin(type);
    this.vaultService.showToast(`Switched active profile session to ${type.toUpperCase()}`, 'info');
  }

  resetSeeds(): void {
    this.vaultService.resetToSeedData();
  }

  signOut(): void {
    this.firebaseService.signOut();
    this.vaultService.showToast('Signed out of Credence Vault session', 'info');
  }
}
