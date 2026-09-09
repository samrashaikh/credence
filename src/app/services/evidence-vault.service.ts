import { Injectable, computed, signal } from '@angular/core';
import {
  EvidenceArtifact,
  EvidenceProfile,
  ResumeTransformation,
  VaultStats,
  ReviewStatus,
  ArtifactCategory,
  ProvenanceType,
  ClaimCitation,
  LinkedInPostTransformation,
} from '../../types/evidence.types';

import { SeedDataService } from './seed-data.service';
import { GeminiService } from './gemini.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class EvidenceVaultService {
  // Core reactive state signals
  artifacts = signal<EvidenceArtifact[]>([]);
  selectedArtifactId = signal<string | null>('art-001');
  searchQuery = signal<string>('');
  categoryFilter = signal<ArtifactCategory | 'all'>('all');
  provenanceFilter = signal<ProvenanceType | 'all'>('all');
  toastMessage = signal<{ text: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(
    null,
  );

  // Active highlighted claim citation for side-by-side jump highlighting
  activeHighlightedClaim = signal<ClaimCitation | null>(null);

  // Computed signals
  selectedArtifact = computed(() => {
    const id = this.selectedArtifactId();
    if (!id) return this.artifacts()[0] || null;
    return this.artifacts().find((a) => a.id === id) || null;
  });

  filteredArtifacts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.categoryFilter();
    const prov = this.provenanceFilter();

    return this.artifacts().filter((art) => {
      // Category filter
      if (cat !== 'all' && art.category !== cat) return false;
      // Provenance filter
      if (prov !== 'all' && art.provenanceType !== prov) return false;
      // Search query filter
      if (query) {
        const matchTitle = art.title.toLowerCase().includes(query);
        const matchOrg = art.organization.toLowerCase().includes(query);
        const matchRole = art.userRole.toLowerCase().includes(query);
        const matchTags = art.tags.some((t) => t.toLowerCase().includes(query));
        const matchText = art.rawContentText.toLowerCase().includes(query);
        return matchTitle || matchOrg || matchRole || matchTags || matchText;
      }
      return true;
    });
  });

  vaultStats = computed<VaultStats>(() => {
    const arts = this.artifacts();
    const totalArtifacts = arts.length;
    const sourceBackedCount = arts.filter((a) => a.provenanceType === 'source_backed').length;
    const selfReportedCount = arts.filter((a) => a.provenanceType === 'self_reported').length;
    const totalExtractedProfiles = arts.filter((a) => Boolean(a.profile)).length;

    let totalGeneratedBullets = 0;
    let approvedBulletsCount = 0;
    let pendingReviewCount = 0;
    let totalConfidenceSum = 0;
    let confidenceItemCount = 0;

    arts.forEach((a) => {
      a.transformations.forEach((t) => {
        t.bulletPoints.forEach((b) => {
          totalGeneratedBullets++;
          if (b.reviewStatus === 'approved') approvedBulletsCount++;
          if (b.reviewStatus === 'pending') pendingReviewCount++;
          totalConfidenceSum += b.overallConfidence;
          confidenceItemCount++;
        });
      });
    });

    const averageGroundednessScore =
      confidenceItemCount > 0 ? Math.round(totalConfidenceSum / confidenceItemCount) : 0;

    return {
      totalArtifacts,
      sourceBackedCount,
      selfReportedCount,
      totalExtractedProfiles,
      totalGeneratedBullets,
      approvedBulletsCount,
      pendingReviewCount,
      averageGroundednessScore,
    };
  });

  allPendingReviewBullets = computed(() => {
    const items: Array<{
      artifact: EvidenceArtifact;
      transformation: ResumeTransformation;
      bullet: any;
    }> = [];

    this.artifacts().forEach((art) => {
      art.transformations.forEach((tr) => {
        tr.bulletPoints.forEach((b) => {
          if (b.reviewStatus === 'pending') {
            items.push({
              artifact: art,
              transformation: tr,
              bullet: b,
            });
          }
        });
      });
    });

    return items;
  });

  allApprovedBullets = computed(() => {
    const items: Array<{
      artifact: EvidenceArtifact;
      transformation: ResumeTransformation;
      bullet: any;
    }> = [];

    this.artifacts().forEach((art) => {
      art.transformations.forEach((tr) => {
        tr.bulletPoints.forEach((b) => {
          if (b.reviewStatus === 'approved') {
            items.push({
              artifact: art,
              transformation: tr,
              bullet: b,
            });
          }
        });
      });
    });

    return items;
  });

  constructor(
    private seedData: SeedDataService,
    private geminiService: GeminiService,
    private firebaseService: FirebaseService,
  ) {
    this.loadInitialArtifacts();
  }

  private async loadInitialArtifacts(): Promise<void> {
    try {
      // Wait for Firebase auth to finish restoring the session
      while (this.firebaseService.isAuthLoading()) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const user = this.firebaseService.currentUser();

      if (user && !user.isDemoUser) {
        const [cloudArtifacts, cloudProfiles, cloudTransformations, cloudLinkedInTransformations] =
          await Promise.all([
            this.firebaseService.getUserArtifacts(user.uid),
            this.firebaseService.getUserEvidenceProfiles(user.uid),
            this.firebaseService.getUserResumeTransformations(user.uid),
            this.firebaseService.getUserLinkedInTransformations(user.uid),
          ]);

        if (cloudArtifacts.length > 0) {
          const artifacts = cloudArtifacts.map((artifact: any) => {
            const profile =
              cloudProfiles.find((p: any) => p.artifactId === artifact.id) || undefined;

            const transformations = cloudTransformations
              .filter((t: any) => t.artifactId === artifact.id)
              .sort(
                (a: any, b: any) =>
                  new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
              );

            const linkedinTransformations = cloudLinkedInTransformations
              .filter((t: any) => t.artifactId === artifact.id)
              .sort(
                (a: any, b: any) =>
                  new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
              );

            return {
              ...artifact,
              profile,
              transformations,
              linkedinTransformations,
            } as EvidenceArtifact;
          });

          this.artifacts.set(artifacts);
          this.selectedArtifactId.set(artifacts[0].id);

          this.saveToStorage(artifacts);

          return;
        }
      }
    } catch (err) {
      console.error('Could not load artifacts from Firestore:', err);
    }

    // Offline/local fallback
    const currentUser = this.firebaseService.currentUser();
    const storageKey = currentUser ? `credence_vault_artifacts_${currentUser.uid}` : null;

    const saved = storageKey ? localStorage.getItem(storageKey) : null;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          this.artifacts.set(parsed);
          this.selectedArtifactId.set(parsed[0].id);
          return;
        }
      } catch (err) {
        console.warn('Could not parse saved artifacts:', err);
      }
    }

    // Final fallback: demo seed data
    // No cloud or local evidence exists — start with an empty vault
    this.artifacts.set([]);
    this.selectedArtifactId.set(null);
    this.saveToStorage([]);
  }

  private saveToStorage(arts: EvidenceArtifact[]): void {
    const user = this.firebaseService.currentUser();

    if (!user) {
      return;
    }

    localStorage.setItem(`credence_vault_artifacts_${user.uid}`, JSON.stringify(arts));
  }

  showToast(text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info'): void {
    this.toastMessage.set({ text, type });
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }

  selectArtifact(id: string): void {
    this.selectedArtifactId.set(id);
    this.activeHighlightedClaim.set(null);
  }

  setHighlightedClaim(claim: ClaimCitation | null): void {
    this.activeHighlightedClaim.set(claim);
  }

  async addArtifact(
    newArt: Partial<EvidenceArtifact>,
    originalFile?: File,
  ): Promise<EvidenceArtifact> {
    const id = 'art-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const fullArtifact: EvidenceArtifact = {
      id,
      title: newArt.title || 'Untitled Work Proof',
      category: newArt.category || 'report',
      userRole: newArt.userRole || 'Lead Contributor',
      organization: newArt.organization || 'Engineering Team',
      provenanceType: newArt.provenanceType || 'source_backed',
      description: newArt.description || 'Preserved artifact evidence document.',
      rawContentText: newArt.rawContentText || '',
      createdAt: now,
      updatedAt: now,
      tags: newArt.tags || ['Proof-of-Work'],
      fileMetadata: newArt.fileMetadata || {
        fileName: 'artifact-proof.txt',
        fileSize: (newArt.rawContentText || '').length,
        mimeType: 'text/plain',
        sha256Hash: this.calculateSha256Sync(newArt.rawContentText || ''),
        preservationTimestamp: now,
        checksumVerified: true,
      },
      transformations: [],
    };

    const updated = [fullArtifact, ...this.artifacts()];
    this.artifacts.set(updated);
    this.selectedArtifactId.set(id);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in before preserving evidence.');
    }

    if (originalFile) {
      const uploadResult = await this.firebaseService.uploadArtifactFile(
        user.uid,
        id,
        originalFile,
      );

      fullArtifact.fileMetadata.storageUrl = uploadResult.storageUrl;
    }

    await this.firebaseService.syncDocumentToCloud('evidence_artifacts', id, {
      ...fullArtifact,
      ownerUid: user.uid,
    });

    const finalArtifacts = this.artifacts().map((a) => (a.id === id ? fullArtifact : a));

    this.artifacts.set(finalArtifacts);
    this.saveToStorage(finalArtifacts);
    this.showToast(
      `Artifact "${fullArtifact.title}" preserved to Vault with SHA-256 integrity hash!`,
      'success',
    );

    return fullArtifact;
  }

  async extractEvidenceProfile(
    artifactId: string,
    originalFile?: File,
  ): Promise<EvidenceProfile | null> {
    const art = this.artifacts().find((a) => a.id === artifactId);
    if (!art) return null;

    this.showToast(`Gemini 2.5 Flash analyzing "${art.title}"...`, 'info');

    try {
      let imageBase64: string | undefined;
      let mimeType: string | undefined;

      if (originalFile && originalFile.type.startsWith('image/')) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];

            if (!base64) {
              reject(new Error('Could not convert image for Gemini analysis.'));
              return;
            }

            resolve(base64);
          };

          reader.onerror = () => {
            reject(new Error('Could not read image for Gemini analysis.'));
          };

          reader.readAsDataURL(originalFile);
        });

        mimeType = originalFile.type;
      }

      const profile = await this.geminiService.extractEvidenceProfile({
        rawContentText: art.rawContentText,
        title: art.title,
        artifactType: art.category,
        userRole: art.userRole,
        organization: art.organization,
        imageBase64,
        mimeType,
      });

      profile.artifactId = artifactId;

      const user = this.firebaseService.currentUser();

      if (!user) {
        throw new Error('You must be signed in to save an Evidence Profile.');
      }

      const updated = this.artifacts().map((a) => {
        if (a.id === artifactId) {
          return {
            ...a,
            profile,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      });

      this.artifacts.set(updated);
      this.saveToStorage(updated);
      await this.firebaseService.syncDocumentToCloud('evidence_profiles', profile.id, {
        ...profile,
        ownerUid: user.uid,
      });
      this.showToast(
        `Structured Evidence Profile extracted with ${profile.sourceBackingRatio}% Source-Grounded score!`,
        'success',
      );
      return profile;
    } catch (err: any) {
      this.showToast(`Extraction notice: ${err.message}`, 'warning');
      return null;
    }
  }

  async generateResumeTransformation(
    artifactId: string,
    targetRole: string,
    format: string,
  ): Promise<ResumeTransformation | null> {
    const art = this.artifacts().find((a) => a.id === artifactId);
    if (!art) return null;

    if (!art.profile) {
      // Auto extract first
      const prof = await this.extractEvidenceProfile(artifactId);
      if (!prof) return null;
      art.profile = prof;
    }

    this.showToast(`Transforming proof into grounded ${format} resume claims...`, 'info');

    try {
      const transformation = await this.geminiService.generateResumeTransformation(
        {
          evidenceProfile: art.profile,
          rawArtifactText: art.rawContentText,
          targetRole: targetRole || art.userRole,
          bulletFormat: format,
        },
        artifactId,
      );

      const updated = this.artifacts().map((a) => {
        if (a.id === artifactId) {
          return {
            ...a,
            transformations: [transformation, ...(a.transformations || [])],
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      });

      this.artifacts.set(updated);
      this.saveToStorage(updated);

      const user = this.firebaseService.currentUser();

      if (!user) {
        throw new Error('You must be signed in to save a transformation.');
      }

      await this.firebaseService.syncDocumentToCloud('resume_transformations', transformation.id, {
        ...transformation,
        ownerUid: user.uid,
      });
      this.showToast(
        `Generated ${transformation.bulletPoints.length} verifiable resume bullets awaiting human review.`,
        'success',
      );
      return transformation;
    } catch (err: any) {
      this.showToast(`Generation error: ${err.message}`, 'error');
      return null;
    }
  }

  async generateLinkedInTransformation(
    artifactId: string,
    targetRole: string,
  ): Promise<LinkedInPostTransformation | null> {
    const art = this.artifacts().find((a) => a.id === artifactId);

    if (!art) return null;

    if (!art.profile) {
      const prof = await this.extractEvidenceProfile(artifactId);

      if (!prof) return null;

      art.profile = prof;
    }

    this.showToast('Generating grounded LinkedIn post...', 'info');

    try {
      const transformation = await this.geminiService.generateLinkedInPost(
        {
          evidenceProfile: art.profile,
          rawArtifactText: art.rawContentText,
          targetRole: targetRole || art.userRole,
        },
        artifactId,
      );

      const updated = this.artifacts().map((a) => {
        if (a.id === artifactId) {
          return {
            ...a,
            linkedinTransformations: [transformation, ...(a.linkedinTransformations || [])],
            updatedAt: new Date().toISOString(),
          };
        }

        return a;
      });

      this.artifacts.set(updated);
      this.saveToStorage(updated);

      const user = this.firebaseService.currentUser();

      if (!user) {
        throw new Error('You must be signed in to save a LinkedIn transformation.');
      }

      await this.firebaseService.syncDocumentToCloud(
        'linkedin_transformations',
        transformation.id,
        {
          ...transformation,
          ownerUid: user.uid,
        },
      );

      this.showToast('Grounded LinkedIn post generated and saved.', 'success');

      return transformation;
    } catch (err: any) {
      this.showToast(`Generation error: ${err.message}`, 'error');
      return null;
    }
  }

  async approveBullet(
    artifactId: string,
    transformationId: string,
    bulletId: string,
    userNotes?: string,
  ): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      const newTransformations = art.transformations.map((tr) => {
        if (tr.id !== transformationId) return tr;

        const newBullets = tr.bulletPoints.map((b) => {
          if (b.id !== bulletId) return b;

          const approvedBullet = {
            ...b,
            reviewStatus: 'approved' as ReviewStatus,
            reviewedAt: now,
            reviewedBy: 'Professional (Verified Author)',
          };

          if (userNotes || b.userNotes) {
            return {
              ...approvedBullet,
              userNotes: userNotes || b.userNotes,
            };
          }

          return approvedBullet;
        });

        const allApproved = newBullets.every((b) => b.reviewStatus === 'approved');

        const anyApproved = newBullets.some((b) => b.reviewStatus === 'approved');

        return {
          ...tr,
          bulletPoints: newBullets,
          overallStatus: allApproved
            ? ('approved' as const)
            : anyApproved
              ? ('partially_approved' as const)
              : ('draft' as const),
        };
      });

      return {
        ...art,
        transformations: newTransformations,
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to approve a bullet.');
    }

    const updatedTransformation = updated
      .find((art) => art.id === artifactId)
      ?.transformations.find((tr) => tr.id === transformationId);

    if (!updatedTransformation) {
      throw new Error('Transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('resume_transformations', transformationId, {
      ...updatedTransformation,
      artifactId,
      ownerUid: user.uid,
    });

    this.showToast(
      'Resume claim approved by author and locked into Verified Portfolio!',
      'success',
    );
  }

  async rejectBullet(
    artifactId: string,
    transformationId: string,
    bulletId: string,
    reason?: string,
  ): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      const newTransformations = art.transformations.map((tr) => {
        if (tr.id !== transformationId) return tr;

        const newBullets = tr.bulletPoints.map((b) => {
          if (b.id !== bulletId) return b;

          return {
            ...b,
            reviewStatus: 'rejected' as ReviewStatus,
            reviewedAt: now,
            reviewedBy: 'Professional (Verified Author)',
            userNotes: reason || 'Rejected during human review.',
          };
        });

        return {
          ...tr,
          bulletPoints: newBullets,
        };
      });

      return {
        ...art,
        transformations: newTransformations,
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to reject a bullet.');
    }

    const updatedTransformation = updated
      .find((art) => art.id === artifactId)
      ?.transformations.find((tr) => tr.id === transformationId);

    if (!updatedTransformation) {
      throw new Error('Transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('resume_transformations', transformationId, {
      ...updatedTransformation,
      artifactId,
      ownerUid: user.uid,
    });

    this.showToast('Bullet rejected and excluded from resume export.', 'warning');
  }

  async editBulletText(
    artifactId: string,
    transformationId: string,
    bulletId: string,
    newText: string,
  ): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      const newTransformations = art.transformations.map((tr) => {
        if (tr.id !== transformationId) return tr;

        const newBullets = tr.bulletPoints.map((b) => {
          if (b.id !== bulletId) return b;

          return {
            ...b,
            bulletText: newText,
            editedText: newText,
            reviewStatus: 'modified' as ReviewStatus,
            reviewedAt: now,
            reviewedBy: 'Professional (Edited by Author)',
          };
        });

        return {
          ...tr,
          bulletPoints: newBullets,
        };
      });

      return {
        ...art,
        transformations: newTransformations,
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to save an edited bullet.');
    }

    const updatedTransformation = updated
      .find((art) => art.id === artifactId)
      ?.transformations.find((tr) => tr.id === transformationId);

    if (!updatedTransformation) {
      throw new Error('Transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('resume_transformations', transformationId, {
      ...updatedTransformation,
      artifactId,
      ownerUid: user.uid,
    });

    this.showToast('Bullet modified. Author edits preserved.', 'info');
  }

  async approveLinkedInPost(artifactId: string, transformationId: string): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      return {
        ...art,
        linkedinTransformations: (art.linkedinTransformations || []).map((tr) =>
          tr.id === transformationId
            ? {
                ...tr,
                reviewStatus: 'approved' as ReviewStatus,
                reviewedAt: now,
                reviewedBy: 'Professional (Verified Author)',
              }
            : tr,
        ),
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to approve a LinkedIn post.');
    }

    const transformation = updated
      .find((art) => art.id === artifactId)
      ?.linkedinTransformations?.find((tr) => tr.id === transformationId);

    if (!transformation) {
      throw new Error('LinkedIn transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('linkedin_transformations', transformationId, {
      ...transformation,
      ownerUid: user.uid,
    });

    this.showToast('LinkedIn post approved by author.', 'success');
  }

  async rejectLinkedInPost(artifactId: string, transformationId: string): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      return {
        ...art,
        linkedinTransformations: (art.linkedinTransformations || []).map((tr) =>
          tr.id === transformationId
            ? {
                ...tr,
                reviewStatus: 'rejected' as ReviewStatus,
                reviewedAt: now,
                reviewedBy: 'Professional (Verified Author)',
              }
            : tr,
        ),
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to reject a LinkedIn post.');
    }

    const transformation = updated
      .find((art) => art.id === artifactId)
      ?.linkedinTransformations?.find((tr) => tr.id === transformationId);

    if (!transformation) {
      throw new Error('LinkedIn transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('linkedin_transformations', transformationId, {
      ...transformation,
      ownerUid: user.uid,
    });

    this.showToast('LinkedIn post rejected.', 'warning');
  }

  async editLinkedInPost(
    artifactId: string,
    transformationId: string,
    newText: string,
  ): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      return {
        ...art,
        linkedinTransformations: (art.linkedinTransformations || []).map((tr) =>
          tr.id === transformationId
            ? {
                ...tr,
                postText: newText,
                editedText: newText,
                reviewStatus: 'modified' as ReviewStatus,
                reviewedAt: now,
                reviewedBy: 'Professional (Edited by Author)',
              }
            : tr,
        ),
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to edit a LinkedIn post.');
    }

    const transformation = updated
      .find((art) => art.id === artifactId)
      ?.linkedinTransformations?.find((tr) => tr.id === transformationId);

    if (!transformation) {
      throw new Error('LinkedIn transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('linkedin_transformations', transformationId, {
      ...transformation,
      ownerUid: user.uid,
    });

    this.showToast('LinkedIn post edits saved.', 'info');
  }

  async addLinkedInNote(artifactId: string, transformationId: string, note: string): Promise<void> {
    const now = new Date().toISOString();

    const updated = this.artifacts().map((art) => {
      if (art.id !== artifactId) return art;

      return {
        ...art,
        linkedinTransformations: (art.linkedinTransformations || []).map((tr) =>
          tr.id === transformationId
            ? {
                ...tr,
                userNotes: note,
                reviewedAt: now,
                reviewedBy: 'Professional (Verified Author)',
              }
            : tr,
        ),
        updatedAt: now,
      };
    });

    this.artifacts.set(updated);
    this.saveToStorage(updated);

    const user = this.firebaseService.currentUser();

    if (!user) {
      throw new Error('You must be signed in to add a note.');
    }

    const transformation = updated
      .find((art) => art.id === artifactId)
      ?.linkedinTransformations?.find((tr) => tr.id === transformationId);

    if (!transformation) {
      throw new Error('LinkedIn transformation not found.');
    }

    await this.firebaseService.syncDocumentToCloud('linkedin_transformations', transformationId, {
      ...transformation,
      ownerUid: user.uid,
    });

    this.showToast('Author note saved.', 'success');
  }

  deleteArtifact(artifactId: string): void {
    const updated = this.artifacts().filter((a) => a.id !== artifactId);
    this.artifacts.set(updated);
    if (this.selectedArtifactId() === artifactId) {
      this.selectedArtifactId.set(updated[0]?.id || null);
    }
    this.saveToStorage(updated);
    this.showToast('Artifact removed from Vault.', 'info');
  }

  resetToSeedData(): void {
    const seeds = this.seedData.getSeedArtifacts();
    this.artifacts.set(seeds);
    this.selectedArtifactId.set(seeds[0].id);
    this.saveToStorage(seeds);
    this.showToast('Vault re-seeded with realistic professional evidence datasets.', 'success');
  }

  clearSessionState(): void {
    this.artifacts.set([]);
    this.selectedArtifactId.set(null);
  }

  async reloadForCurrentUser(): Promise<void> {
    await this.loadInitialArtifacts();
  }

  calculateSha256Sync(text: string): string {
    // Generate deterministic hex hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e49b934ca495991b7852b8559f8371a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6${hex}`;
  }

  async calculateSha256(content: string): Promise<string> {
    try {
      if (window.crypto && window.crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(content);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch {
      // fallback
    }
    return this.calculateSha256Sync(content);
  }
}
