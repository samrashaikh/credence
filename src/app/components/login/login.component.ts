import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { EvidenceVaultService } from '../../services/evidence-vault.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isSigningIn = false;
  errorMessage = '';

  constructor(
    public firebaseService: FirebaseService,
    private vaultService: EvidenceVaultService,
    private router: Router,
  ) {
    effect(() => {
      const user = this.firebaseService.currentUser();

      if (user && !this.firebaseService.isAuthLoading()) {
        void this.loadVaultAndNavigate();
      }
    });
  }

  private async loadVaultAndNavigate(): Promise<void> {
    await this.vaultService.reloadForCurrentUser();
    await this.router.navigate(['/vault']);
  }

  async continueWithGoogle(): Promise<void> {
    this.isSigningIn = true;
    this.errorMessage = '';

    try {
      await this.firebaseService.signInWithGoogle();
    } catch (error: any) {
      console.error('Login failed:', error);

      this.errorMessage = error?.message || 'Unable to sign in. Please try again.';
    } finally {
      this.isSigningIn = false;
    }
  }
}
