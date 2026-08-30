import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      
      <!-- Top Navigation Header -->
      <app-header></app-header>

      <!-- Main Application Router View -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <router-outlet></router-outlet>
      </main>

      <!-- Global Footer -->
      <footer class="border-t border-slate-700/50 bg-slate-900 py-8 text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 font-bold font-mono text-slate-200">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>CREDENCE EVIDENCE VAULT</span>
            </div>
            <span class="text-slate-700">|</span>
            <span class="text-slate-400">Multimodal Gemini 3.7 Flash + Firebase Cloud Storage</span>
          </div>

          <div class="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span class="flex items-center gap-1.5 text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              HUMAN_IN_THE_LOOP_ACTIVE
            </span>
            <span class="text-slate-700">•</span>
            <span class="text-slate-400">SHA-256 VERIFIED</span>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class AppComponent {}
