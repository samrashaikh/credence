import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadEvidenceComponent } from './components/upload-evidence/upload-evidence.component';
import { EvidenceDetailComponent } from './components/evidence-detail/evidence-detail.component';
import { TransformEvidenceComponent } from './components/transform-evidence/transform-evidence.component';
import { HumanReviewQueueComponent } from './components/human-review-queue/human-review-queue.component';
import { ProofPacketComponent } from './components/proof-packet/proof-packet.component';

export const routes: Routes = [
  { path: '', redirectTo: 'vault', pathMatch: 'full' },
  { path: 'vault', component: DashboardComponent },
  { path: 'upload', component: UploadEvidenceComponent },
  { path: 'evidence/:id', component: EvidenceDetailComponent },
  { path: 'transform/:id', component: TransformEvidenceComponent },
  { path: 'review-queue', component: HumanReviewQueueComponent },
  { path: 'proof/:id', component: ProofPacketComponent },
  { path: '**', redirectTo: 'vault' }
];
