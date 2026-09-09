import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadEvidenceComponent } from './components/upload-evidence/upload-evidence.component';
import { EvidenceDetailComponent } from './components/evidence-detail/evidence-detail.component';
import { TransformEvidenceComponent } from './components/transform-evidence/transform-evidence.component';
import { TransformProofComponent } from './components/transform-proof/transform-proof.component';
import { HumanReviewQueueComponent } from './components/human-review-queue/human-review-queue.component';
import { ProofPacketComponent } from './components/proof-packet/proof-packet.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'vault',
    pathMatch: 'full'
  },
  {
    path: 'vault',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'upload',
    component: UploadEvidenceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transform-proof',
    component: TransformProofComponent,
    canActivate: [authGuard]
  },
  {
    path: 'evidence/:id',
    component: EvidenceDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transform/:id',
    component: TransformEvidenceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'review-queue',
    component: HumanReviewQueueComponent,
    canActivate: [authGuard]
  },
  {
    path: 'proof/:id',
    component: ProofPacketComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'vault'
  }
];