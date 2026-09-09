import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

export const authGuard: CanActivateFn = async () => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  while (firebaseService.isAuthLoading()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const user = firebaseService.currentUser();

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login']);
};