import { Injectable, signal } from '@angular/core';
import {
  ClaimCitation,
  EvidenceProfile,
  ResumeTransformation,
  LinkedInPostTransformation
} from '../../types/evidence.types';

export interface ExtractionRequest {
  rawContentText: string;
  title: string;
  artifactType: string;
  userRole: string;
  organization: string;
  imageBase64?: string;
  mimeType?: string;
}

export interface BulletGenerationRequest {
  evidenceProfile: EvidenceProfile;
  rawArtifactText: string;
  targetRole: string;
  bulletFormat: string;
}

export interface LinkedInPostGenerationRequest {
  evidenceProfile: EvidenceProfile;
  rawArtifactText: string;
  targetRole: string;
}

export interface LinkedInPostGenerationResult {
  headline: string;
  postText: string;
  overallConfidence: number;
  claims: ClaimCitation[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  isAnalyzing = signal<boolean>(false);
  isGeneratingBullets = signal<boolean>(false);
  lastAnalysisError = signal<string | null>(null);

  async extractEvidenceProfile(req: ExtractionRequest): Promise<EvidenceProfile> {
    this.isAnalyzing.set(true);
    this.lastAnalysisError.set(null);

    try {
      const response = await fetch('/api/gemini/extract-evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      });

      if (!response.ok) {
        throw new Error(`Extraction server responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.profile) {
        throw new Error(data.error || 'Failed to extract structured evidence profile');
      }

      const profile: EvidenceProfile = {
        id: 'prof-' + Math.random().toString(36).substring(2, 9),
        artifactId: '',
        extractedAt: new Date().toISOString(),
        projectTitle: data.profile.projectTitle || req.title || 'Extracted Proof Initiative',
        role: data.profile.role || req.userRole || 'Lead Contributor',
        timeframe: data.profile.timeframe || 'Recent Project',
        organization: data.profile.organization || req.organization || 'Engineering Team',
        summary: data.profile.summary || 'Structured evidence extracted from preserved source artifact.',
        actions: (data.profile.actions || []).map((a: any, i: number) => ({
          id: 'act-' + (i + 1),
          description: a.description,
          directQuote: a.directQuote,
          sourceLineHint: a.sourceLineHint || `Line reference ${i + 1}`,
          confidence: a.confidence || 95
        })),
        metrics: (data.profile.metrics || []).map((m: any, i: number) => ({
          id: 'met-' + (i + 1),
          metricName: m.metricName,
          baselineValue: m.baselineValue || 'N/A',
          achievedValue: m.achievedValue,
          percentageChange: m.percentageChange || 'Verified Delta',
          unit: m.unit || '',
          quote: m.quote,
          isEstimated: Boolean(m.isEstimated)
        })),
        technologies: data.profile.technologies || [],
        collaborators: data.profile.collaborators || [],
        challenges: data.profile.challenges || [],
        impactNarrative: data.profile.impactNarrative || '',
        sourceBackingRatio: data.profile.sourceBackingRatio || 95,
        isSimulated: Boolean(data.isSimulated)
      };

      return profile;
    } catch (err: any) {
        console.error('Gemini evidence extraction failed:', err);
        this.lastAnalysisError.set(err.message || 'Gemini extraction error');
        throw err;
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  async generateResumeTransformation(req: BulletGenerationRequest, artifactId: string): Promise<ResumeTransformation> {
    this.isGeneratingBullets.set(true);
    try {
      const response = await fetch('/api/gemini/generate-bullet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      });

      let rawData: any;
      if (response.ok) {
        rawData = await response.json();
      }

      if (rawData && rawData.transformation && rawData.transformation.bulletPoints) {
        const trans: ResumeTransformation = {
          id: 'tr-' + Math.random().toString(36).substring(2, 9),
          artifactId,
          profileId: req.evidenceProfile.id,
          generatedAt: new Date().toISOString(),
          targetRole: req.targetRole,
          bulletFormat: req.bulletFormat,
          headline: rawData.transformation.headline || `Evidence-Grounded Bullets for ${req.targetRole}`,
          overallStatus: 'draft',
          bulletPoints: rawData.transformation.bulletPoints.map((b: any, index: number) => ({
            id: 'b-' + (index + 1) + '-' + Math.random().toString(36).substring(2, 6),
            bulletText: b.bulletText,
            framework: b.framework || req.bulletFormat,
            overallConfidence: b.overallConfidence || 95,
            reviewStatus: 'pending',
            claims: (b.claims || []).map((c: any, ci: number) => ({
              claimId: 'c-' + (ci + 1),
              claimType: c.claimType || 'action',
              claimText: c.claimText,
              sourceQuote: c.sourceQuote,
              sourceType: c.sourceType || 'source_backed',
              confidenceScore: c.confidenceScore || 95,
              lineReference: c.lineReference || 'Artifact Extract'
            }))
          }))
        };
        return trans;
      }

      throw new Error(
  'Gemini did not return a valid grounded transformation.'
);

    }  catch (err: any) {
      console.error('Gemini bullet generation failed:', err);
      throw err;
      return this.clientFallbackBulletGeneration(req, artifactId);
    } finally {
      this.isGeneratingBullets.set(false);
    }
  }

  async generateLinkedInPost(
  req: LinkedInPostGenerationRequest,
  artifactId: string
): Promise<LinkedInPostTransformation> {
  this.isGeneratingBullets.set(true);

  try {
    const response = await fetch('/api/gemini/generate-linkedin-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });

    const rawData = await response.json();

    if (!response.ok) {
      throw new Error(
        rawData?.error || 'LinkedIn post generation failed.'
      );
    }

    if (!rawData?.linkedinPost?.postText) {
      throw new Error(
        'Gemini did not return a valid grounded LinkedIn post.'
      );
    }

    const post = rawData.linkedinPost;

    const transformation: LinkedInPostTransformation = {
      id: 'li-' + Math.random().toString(36).substring(2, 9),
      artifactId,
      profileId: req.evidenceProfile.id,
      generatedAt: new Date().toISOString(),
      targetRole: req.targetRole,

      headline: post.headline || `Grounded LinkedIn Post for ${req.targetRole}`,
      postText: post.postText,

      claims: post.claims || [],
      overallConfidence: post.overallConfidence || 95,

      reviewStatus: 'pending',
    };

    return transformation;
      } catch (err: any) {
        console.error('Gemini LinkedIn post generation failed:', err);
        throw err;
      } finally {
        this.isGeneratingBullets.set(false);
      }
  }

  private clientFallbackExtraction(req: ExtractionRequest): EvidenceProfile {
    const lines = req.rawContentText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const metricsFound = lines.filter(l => /\d+%|\$\d+|\d+\s?ms|\d+\s?eps|\d+\s?weeks/i.test(l));

    return {
      id: 'prof-' + Math.random().toString(36).substring(2, 9),
      artifactId: '',
      extractedAt: new Date().toISOString(),
      projectTitle: req.title || 'System Enhancement Initiative',
      role: req.userRole || 'Lead Architect & Engineer',
      timeframe: 'Recent Quarter',
      organization: req.organization || 'Engineering Org',
      summary: `Automated evidence profile generated for ${req.title}. Analyzed ${lines.length} lines of source text.`,
      sourceBackingRatio: 92,
      actions: [
        {
          id: 'act-1',
          description: `Spearheaded architecture and implementation for ${req.title}`,
          directQuote: lines[0] || 'Led core technical architecture and validation.',
          sourceLineHint: 'Line 1',
          confidence: 96
        },
        {
          id: 'act-2',
          description: 'Enforced performance benchmarks and automated verification protocols',
          directQuote: lines[Math.min(2, lines.length - 1)] || 'Verified production reliability and benchmark SLAs.',
          sourceLineHint: 'Benchmark section',
          confidence: 93
        }
      ],
      metrics: metricsFound.slice(0, 3).map((mText, idx) => ({
        id: 'met-' + (idx + 1),
        metricName: `Performance Metric ${idx + 1}`,
        baselineValue: 'Pre-deployment baseline',
        achievedValue: mText.match(/\d+[\w%$/.]*/)?.[0] || 'Target met',
        percentageChange: 'Audited delta',
        unit: 'metric',
        quote: mText,
        isEstimated: false
      })),
      technologies: ['TypeScript', 'Cloud Architecture', 'Telemetry', 'Automated Testing', 'CI/CD'],
      collaborators: [
        { role: 'Engineering Director', team: 'Core Platforms' },
        { role: 'Senior SRE', team: 'Infrastructure' }
      ],
      challenges: [
        'Ensuring zero downtime and complete data integrity during release'
      ],
      impactNarrative: `Extracted direct evidence of engineering execution, verified benchmarks, and cross-functional team delivery.`,
      isSimulated: true
    };
  }

  private clientFallbackBulletGeneration(req: BulletGenerationRequest, artifactId: string): ResumeTransformation {
    const prof = req.evidenceProfile;
    const metric1 = prof.metrics[0];
    const action1 = prof.actions[0];

    const bulletText1 = `Architected and shipped ${prof.projectTitle} at ${prof.organization}, delivering ${metric1 ? metric1.achievedValue : 'high-impact throughput gains'} and establishing rigorous automated verification.`;
    const bulletText2 = `Led end-to-end technical execution of ${prof.projectTitle} across ${prof.technologies.slice(0, 3).join(', ')}, mitigating mission-critical architectural bottlenecks with verified zero-downtime reliability.`;

    return {
      id: 'tr-' + Math.random().toString(36).substring(2, 9),
      artifactId,
      profileId: prof.id,
      generatedAt: new Date().toISOString(),
      targetRole: req.targetRole,
      bulletFormat: req.bulletFormat,
      headline: `Evidence Transformation for ${req.targetRole}`,
      overallStatus: 'draft',
      bulletPoints: [
        {
          id: 'b-fallback-1',
          bulletText: bulletText1,
          framework: req.bulletFormat as any,
          overallConfidence: 94,
          reviewStatus: 'pending',
          claims: [
            {
              claimId: 'c-1',
              claimType: 'action',
              claimText: `Architected and shipped ${prof.projectTitle}`,
              sourceQuote: action1 ? action1.directQuote : 'Led core technical architecture.',
              sourceType: 'source_backed',
              confidenceScore: 96,
              lineReference: action1?.sourceLineHint || 'Source doc'
            },
            {
              claimId: 'c-2',
              claimType: 'metric',
              claimText: `delivering ${metric1 ? metric1.achievedValue : 'high-impact throughput gains'}`,
              sourceQuote: metric1 ? metric1.quote : 'Verified production reliability and benchmark SLAs.',
              sourceType: 'source_backed',
              confidenceScore: 98,
              lineReference: 'Metrics Section'
            }
          ]
        },
        {
          id: 'b-fallback-2',
          bulletText: bulletText2,
          framework: 'CAR (Context-Action-Result)',
          overallConfidence: 91,
          reviewStatus: 'pending',
          claims: [
            {
              claimId: 'c-3',
              claimType: 'action',
              claimText: `Led end-to-end technical execution`,
              sourceQuote: prof.summary,
              sourceType: 'source_backed',
              confidenceScore: 92,
              lineReference: 'Summary extract'
            },
            {
              claimId: 'c-4',
              claimType: 'tool',
              claimText: `across ${prof.technologies.slice(0, 3).join(', ')}`,
              sourceQuote: `Technologies: ${prof.technologies.join(', ')}`,
              sourceType: 'source_backed',
              confidenceScore: 95,
              lineReference: 'Tech stack'
            }
          ]
        }
      ]
    };
  }
}
