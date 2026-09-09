export type ArtifactCategory = string;
export type ProvenanceType = 'source_backed' | 'self_reported';

export type BulletFramework = 
  | 'XYZ (Accomplished [X] measured by [Y] by doing [Z])'
  | 'CAR (Context-Action-Result)'
  | 'STAR (Situation-Task-Action-Result)'
  | 'Executive Brief';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'modified';

export interface PreservedFileMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  storageUrl?: string;
  preservationTimestamp: string;
  checksumVerified: boolean;
}

export interface ExtractedAction {
  id: string;
  description: string;
  directQuote: string;
  sourceLineHint?: string;
  confidence: number;
}

export interface ExtractedMetric {
  id: string;
  metricName: string;
  baselineValue: string;
  achievedValue: string;
  percentageChange?: string;
  unit: string;
  quote: string;
  isEstimated: boolean;
}

export interface ExtractedCollaborator {
  role: string;
  team: string;
}

export interface EvidenceProfile {
  id: string;
  artifactId: string;
  extractedAt: string;
  projectTitle: string;
  role: string;
  timeframe: string;
  organization: string;
  summary: string;
  actions: ExtractedAction[];
  metrics: ExtractedMetric[];
  technologies: string[];
  collaborators: ExtractedCollaborator[];
  challenges: string[];
  impactNarrative: string;
  sourceBackingRatio: number; // 0 to 100
  isSimulated?: boolean;
}

export interface ClaimCitation {
  claimId: string;
  claimType: 'action' | 'metric' | 'scope' | 'tool' | 'outcome';
  claimText: string;
  sourceQuote: string;
  sourceType: ProvenanceType;
  confidenceScore: number;
  lineReference?: string;
  highlightCoordinates?: { start: number; end: number };
}

export interface ResumeBulletItem {
  id: string;
  bulletText: string;
  framework: BulletFramework;
  claims: ClaimCitation[];
  overallConfidence: number;
  reviewStatus: ReviewStatus;
  userNotes?: string;
  editedText?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ResumeTransformation {
  id: string;
  artifactId: string;
  profileId: string;
  generatedAt: string;
  targetRole: string;
  bulletFormat: string;
  headline: string;
  bulletPoints: ResumeBulletItem[];
  overallStatus: 'draft' | 'partially_approved' | 'approved' | 'rejected';
}

export interface LinkedInPostTransformation {
  id: string;
  artifactId: string;
  profileId: string;
  generatedAt: string;
  targetRole: string;
  headline: string;
  postText: string;
  claims: ClaimCitation[];
  overallConfidence: number;
  reviewStatus: ReviewStatus;
  userNotes?: string;
  editedText?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface EvidenceArtifact {
  id: string;
  title: string;
  category: ArtifactCategory;
  userRole: string;
  organization: string;
  provenanceType: ProvenanceType;
  description: string;
  rawContentText: string;
  fileMetadata: PreservedFileMetadata;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  profile?: EvidenceProfile;
  transformations: ResumeTransformation[];
  isArchived?: boolean;
  base64Thumbnail?: string;
  linkedinTransformations?: LinkedInPostTransformation[];
}

export interface VaultStats {
  totalArtifacts: number;
  sourceBackedCount: number;
  selfReportedCount: number;
  totalExtractedProfiles: number;
  totalGeneratedBullets: number;
  approvedBulletsCount: number;
  pendingReviewCount: number;
  averageGroundednessScore: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAnonymous: boolean;
  isDemoUser: boolean;
  createdAt: string;
}
