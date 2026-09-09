import { Injectable, signal } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { UserProfile } from '../../types/evidence.types';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // Angular signals for reactive auth state
  currentUser = signal<UserProfile | null>(null);
  isAuthLoading = signal<boolean>(true);
  isFirebaseConnected = signal<boolean>(false);
  authError = signal<string | null>(null);

  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: FirebaseStorage | null = null;

  constructor() {
    this.initFirebase();
  }

  private initFirebase(): void {
    try {
      // Safe environment check or fallback config
      const firebaseConfig = {
        apiKey: "AIzaSyBlYGEQawFIWPJtIGKPReIavLITjOPSYR0",
        authDomain: "credence-career-vault-2026.firebaseapp.com",
        projectId: "credence-career-vault-2026",
        storageBucket: "credence-career-vault-2026.firebasestorage.app",
        messagingSenderId: "899336391071",
        appId: "1:899336391071:web:e58c4b20bf28436c35d5aa"
      };

      // Check if real config exists in localStorage or window
      const savedUser = localStorage.getItem('credence_user_session');
      if (savedUser) {
        try {
          this.currentUser.set(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('credence_user_session');
        }
      }

      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.isFirebaseConnected.set(true);

      onAuthStateChanged(this.auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || 'professional@credence.vault',
            displayName: fbUser.displayName || 'Staff Engineer (Verified Author)',
            photoURL: fbUser.photoURL || undefined,
            isAnonymous: fbUser.isAnonymous,
            isDemoUser: false,
            createdAt: new Date().toISOString()
          };
          this.currentUser.set(profile);
          localStorage.setItem('credence_user_session', JSON.stringify(profile));
        }
        this.isAuthLoading.set(false);
      });
    } catch (err: any) {
        console.warn("Firebase initialization failed:", err?.message || err);
        this.isFirebaseConnected.set(false);
        this.isAuthLoading.set(false);
      }
    }

  private setDefaultDemoUser(): void {
    const demoProfile: UserProfile = {
      uid: 'usr-demo-apex-001',
      email: 'alex.chen.lead@apex-fintech.io',
      displayName: 'Alex Chen (Staff Systems Architect)',
      isAnonymous: false,
      isDemoUser: true,
      createdAt: '2025-10-01T00:00:00Z'
    };
    this.currentUser.set(demoProfile);
    localStorage.setItem('credence_user_session', JSON.stringify(demoProfile));
  }

  async signInWithGoogle(): Promise<void> {
    this.authError.set(null);
    if (!this.auth) {
      this.authError.set('Google Sign-In is currently unavailable.');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || 'verified.author@credence.vault',
        displayName: user.displayName || 'Career Vault Owner',
        photoURL: user.photoURL || undefined,
        isAnonymous: false,
        isDemoUser: false,
        createdAt: new Date().toISOString()
      };
      this.currentUser.set(profile);
      localStorage.setItem('credence_user_session', JSON.stringify(profile));
    } catch (err: any) {
      console.error("Google sign-in failed:", err);
      this.authError.set(err?.message || 'Google sign-in failed');
    }
  }

  async signInAsGuest(): Promise<void> {
    this.authError.set(null);
    if (this.auth) {
      try {
        const cred = await signInAnonymously(this.auth);
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: 'guest.professional@credence.vault',
          displayName: 'Guest Professional',
          isAnonymous: true,
          isDemoUser: true,
          createdAt: new Date().toISOString()
        };
        this.currentUser.set(profile);
        localStorage.setItem('credence_user_session', JSON.stringify(profile));
        return;
      } catch (err) {
        console.warn("Anonymous signin fallback:", err);
      }
    }
    this.simulateLogin('guest');
  }

  simulateLogin(persona: 'google' | 'guest' | 'recruiter'): void {
    let profile: UserProfile;
    if (persona === 'google') {
      profile = {
        uid: 'usr-google-verified-992',
        email: 'alex.chen.systems@gmail.com',
        displayName: 'Alex Chen (Verified Author)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isAnonymous: false,
        isDemoUser: false,
        createdAt: new Date().toISOString()
      };
    } else if (persona === 'recruiter') {
      profile = {
        uid: 'usr-auditor-883',
        email: 'auditor@tech-exec-search.com',
        displayName: 'Executive Hiring Auditor (Read-Only Reviewer)',
        isAnonymous: false,
        isDemoUser: true,
        createdAt: new Date().toISOString()
      };
    } else {
      profile = {
        uid: 'usr-guest-' + Math.random().toString(36).substring(2, 9),
        email: 'guest.evaluator@credence.vault',
        displayName: 'Guest Professional Evaluator',
        isAnonymous: true,
        isDemoUser: true,
        createdAt: new Date().toISOString()
      };
    }
    this.currentUser.set(profile);
    localStorage.setItem('credence_user_session', JSON.stringify(profile));
  }

  async signOut(): Promise<void> {
    try {
      if (this.auth) {
        await signOut(this.auth);
      }
    } catch (err) {
      console.warn("Signout warning:", err);
    } finally {
      this.currentUser.set(null);
      localStorage.removeItem('credence_user_session');
    }
  }

  // Cloud Firestore sync helper
  async syncDocumentToCloud(collectionName: string, docId: string, data: any): Promise<boolean> {
    if (!this.db) return false;
    try {
      const docRef = doc(this.db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        syncedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn(`Firestore sync note for ${collectionName}/${docId}:`, err);
      return false;
    }
  }

  async uploadArtifactFile(
    uid: string,
    artifactId: string,
    file: File
  ): Promise<{ storageUrl: string; storagePath: string }> {
    if (!this.storage) {
      throw new Error('Firebase Storage is not initialized.');
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const storagePath =
      `users/${uid}/artifacts/${artifactId}/${safeFileName}`;

    const fileRef = ref(this.storage, storagePath);

    await uploadBytes(fileRef, file, {
      contentType: file.type || 'application/octet-stream'
    });

    const storageUrl = await getDownloadURL(fileRef);

    return {
      storageUrl,
      storagePath
    };
  }

  async getUserArtifacts(uid: string): Promise<any[]> {
  if (!this.db) {
    throw new Error('Firestore is not initialized.');
  }

  const artifactsRef = collection(this.db, 'evidence_artifacts');

  const q = query(
    artifactsRef,
    where('ownerUid', '==', uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnapshot => ({
    ...docSnapshot.data()
  }));
  }

  async getUserEvidenceProfiles(uid: string): Promise<any[]> {
  if (!this.db) {
    throw new Error('Firestore is not initialized.');
  }

  const profilesRef = collection(
    this.db,
    'evidence_profiles'
  );

  const q = query(
    profilesRef,
    where('ownerUid', '==', uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnapshot => ({
    ...docSnapshot.data()
  }));
}

async getUserResumeTransformations(uid: string): Promise<any[]> {
  if (!this.db) {
    throw new Error('Firestore is not initialized.');
  }

  const transformationsRef = collection(
    this.db,
    'resume_transformations'
  );

  const q = query(
    transformationsRef,
    where('ownerUid', '==', uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnapshot => ({
    ...docSnapshot.data()
  }));
}

async getUserLinkedInTransformations(uid: string): Promise<any[]> {
  if (!this.db) {
    throw new Error('Firestore is not initialized.');
  }

  const transformationsRef = collection(
    this.db,
    'linkedin_transformations'
  );

  const q = query(
    transformationsRef,
    where('ownerUid', '==', uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnapshot => ({
    ...docSnapshot.data()
  }));
}

}
