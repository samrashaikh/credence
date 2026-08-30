import { Injectable } from '@angular/core';
import { EvidenceArtifact } from '../../types/evidence.types';

@Injectable({
  providedIn: 'root'
})
export class SeedDataService {

  getSeedArtifacts(): EvidenceArtifact[] {
    return [
      {
        id: 'art-001',
        title: 'Core Distributed Event Streaming Migration (RFC-409 & SLA Audit)',
        category: 'rfc',
        userRole: 'Lead Staff Backend Architect',
        organization: 'Apex Financial Technologies',
        provenanceType: 'source_backed',
        description: 'Approved RFC document, migration runbook, and production SLA verification logs for moving from monolithic RabbitMQ to partition-aware Kafka clusters.',
        createdAt: '2025-11-14T10:30:00Z',
        updatedAt: '2025-11-16T14:45:00Z',
        tags: ['Kafka', 'Distributed Systems', 'Golang', 'Kubernetes', 'P99 Latency'],
        fileMetadata: {
          fileName: 'RFC-409-Event-Bus-Architecture.md',
          fileSize: 48920,
          mimeType: 'text/markdown',
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          preservationTimestamp: '2025-11-14T10:30:05Z',
          checksumVerified: true,
          storageUrl: 'gs://credence-vault-artifacts/users/u-001/RFC-409.md'
        },
        rawContentText: `# RFC-409: Next-Generation Real-Time Event Pipeline Architecture
**Status**: APPROVED & FULLY DEPLOYED
**Primary Author**: Lead Staff Backend Architect (Platform Infrastructure)
**Target Date**: Q3 Production Release
**Sign-off Reviewers**: VP of Infrastructure Engineering, Principal SRE

## 1. Executive Summary & Problem Statement
Apex Financial currently processes 140 million transactional ledger events per day. During market volatility windows, the legacy RabbitMQ broker encountered memory starvation and head-of-line blocking, resulting in degraded P99 read latencies of 420ms and sporadic message drops.

## 2. Architectural Solution
We designed and executed a multi-region, zero-downtime migration to an optimized Kafka streaming topology across 12 node broker clusters running on Google Kubernetes Engine (GKE).
Key implementation milestones:
- Implemented a custom Go batch producer with snappy compression and partition key rebalancing.
- Built automated shadow-traffic canary verification to replay 100% of live traffic for 14 continuous days without customer impact.
- Introduced distributed tracing instrumentation using OpenTelemetry, capturing sub-millisecond hop times across 8 microservices.

## 3. Verified Benchmark & Production SLA Results
Verified by SRE automated telemetry telemetry post-mortem on Nov 12:
- P99 Read Latency: Reduced from baseline 420ms down to 135ms (67.8% latency reduction).
- Throughput Peak: Sustained 85,000 events/second during market open volatility without dropping a single packet.
- Cloud Compute & Egress Spend: Optimized node allocations and regional networking, yielding a verified $62,000/month cost reduction ($744K annualized run-rate savings).
- Availability: Sustained 99.995% uptime across the entire 4-month cutover period with zero rollbacks.

## 4. Operational Sign-off & Audit Log
All production canaries succeeded. Cryptographic audit sign-off confirmed by Lead SRE on Nov 15.`,
        profile: {
          id: 'prof-001',
          artifactId: 'art-001',
          extractedAt: '2025-11-14T10:32:00Z',
          projectTitle: 'Next-Generation Real-Time Event Pipeline Architecture',
          role: 'Lead Staff Backend Architect',
          timeframe: 'Q3 - Q4 2025',
          organization: 'Apex Financial Technologies',
          summary: 'Led architectural revamp and zero-downtime migration of high-throughput transactional event pipeline processing 140M daily events.',
          sourceBackingRatio: 98,
          actions: [
            {
              id: 'act-01',
              description: 'Designed and deployed multi-region Kafka streaming topology on 12-node GKE clusters',
              directQuote: 'designed and executed a multi-region, zero-downtime migration to an optimized Kafka streaming topology across 12 node broker clusters running on Google Kubernetes Engine (GKE).',
              sourceLineHint: 'Section 2.0',
              confidence: 99
            },
            {
              id: 'act-02',
              description: 'Engineered custom Go batch producer with snappy compression and shadow traffic canary replay',
              directQuote: 'Implemented a custom Go batch producer with snappy compression and partition key rebalancing. Built automated shadow-traffic canary verification to replay 100% of live traffic for 14 continuous days',
              sourceLineHint: 'Section 2.0 - Milestones',
              confidence: 97
            }
          ],
          metrics: [
            {
              id: 'met-01',
              metricName: 'P99 Read Latency',
              baselineValue: '420ms',
              achievedValue: '135ms',
              percentageChange: '-67.8%',
              unit: 'ms',
              quote: 'P99 Read Latency: Reduced from baseline 420ms down to 135ms (67.8% latency reduction).',
              isEstimated: false
            },
            {
              id: 'met-02',
              metricName: 'Cloud Infrastructure Savings',
              baselineValue: '$180,000/mo',
              achievedValue: '$118,000/mo',
              percentageChange: '-34.4%',
              unit: 'USD/month',
              quote: 'yielding a verified $62,000/month cost reduction ($744K annualized run-rate savings).',
              isEstimated: false
            },
            {
              id: 'met-03',
              metricName: 'Throughput Peak',
              baselineValue: '28,000 eps',
              achievedValue: '85,000 eps',
              percentageChange: '+203%',
              unit: 'events/sec',
              quote: 'Sustained 85,000 events/second during market open volatility without dropping a single packet.',
              isEstimated: false
            }
          ],
          technologies: ['Apache Kafka', 'Go (Golang)', 'Google Kubernetes Engine (GKE)', 'OpenTelemetry', 'Snappy', 'RabbitMQ'],
          collaborators: [
            { role: 'Principal SRE', team: 'Reliability Engineering' },
            { role: 'VP of Infrastructure', team: 'Executive Tech' }
          ],
          challenges: [
            'Zero-downtime cutover without packet loss during peak market hours',
            'Memory starvation during unexpected volatility bursts'
          ],
          impactNarrative: 'Transformed mission-critical transactional infrastructure to achieve 67.8% lower P99 latencies, $744K annual cost savings, and 99.995% uptime across 140M daily ledger operations.'
        },
        transformations: [
          {
            id: 'tr-001',
            artifactId: 'art-001',
            profileId: 'prof-001',
            generatedAt: '2025-11-14T10:35:00Z',
            targetRole: 'Staff / Principal Distributed Systems Engineer',
            bulletFormat: 'XYZ (Accomplished [X] measured by [Y] by doing [Z])',
            headline: 'Executive Transformation: Infrastructure & Latency Optimization',
            overallStatus: 'approved',
            bulletPoints: [
              {
                id: 'b-001',
                bulletText: 'Architected distributed Kafka event streaming pipeline processing 140M daily transactions, reducing P99 latency by 67.8% (420ms to 135ms) and saving $744K annually by deploying custom Go batching on GKE.',
                framework: 'XYZ (Accomplished [X] measured by [Y] by doing [Z])',
                overallConfidence: 98,
                reviewStatus: 'approved',
                reviewedAt: '2025-11-15T09:12:00Z',
                reviewedBy: 'Professional (Verified Author)',
                userNotes: 'Approved for resume master list. Matches SRE audited metrics exactly.',
                claims: [
                  {
                    claimId: 'c-01',
                    claimType: 'action',
                    claimText: 'Architected distributed Kafka event streaming pipeline',
                    sourceQuote: 'designed and executed a multi-region, zero-downtime migration to an optimized Kafka streaming topology across 12 node broker clusters running on Google Kubernetes Engine (GKE).',
                    sourceType: 'source_backed',
                    confidenceScore: 99,
                    lineReference: 'Section 2.0'
                  },
                  {
                    claimId: 'c-02',
                    claimType: 'scope',
                    claimText: 'processing 140M daily transactions',
                    sourceQuote: 'Apex Financial currently processes 140 million transactional ledger events per day.',
                    sourceType: 'source_backed',
                    confidenceScore: 98,
                    lineReference: 'Section 1.0'
                  },
                  {
                    claimId: 'c-03',
                    claimType: 'metric',
                    claimText: 'reducing P99 latency by 67.8% (420ms to 135ms)',
                    sourceQuote: 'P99 Read Latency: Reduced from baseline 420ms down to 135ms (67.8% latency reduction).',
                    sourceType: 'source_backed',
                    confidenceScore: 100,
                    lineReference: 'Section 3.0 Benchmark'
                  },
                  {
                    claimId: 'c-04',
                    claimType: 'metric',
                    claimText: 'saving $744K annually',
                    sourceQuote: 'yielding a verified $62,000/month cost reduction ($744K annualized run-rate savings).',
                    sourceType: 'source_backed',
                    confidenceScore: 97,
                    lineReference: 'Section 3.0 Cost'
                  }
                ]
              },
              {
                id: 'b-002',
                bulletText: 'Spearheaded 14-day automated shadow-traffic canary validation framework, sustaining 99.995% service availability and 85,000 eps peak throughput during multi-region cutover with zero rollbacks.',
                framework: 'CAR (Context-Action-Result)',
                overallConfidence: 96,
                reviewStatus: 'approved',
                reviewedAt: '2025-11-15T09:14:00Z',
                reviewedBy: 'Professional (Verified Author)',
                claims: [
                  {
                    claimId: 'c-05',
                    claimType: 'action',
                    claimText: 'Spearheaded 14-day automated shadow-traffic canary validation framework',
                    sourceQuote: 'Built automated shadow-traffic canary verification to replay 100% of live traffic for 14 continuous days',
                    sourceType: 'source_backed',
                    confidenceScore: 96,
                    lineReference: 'Section 2.0 Milestones'
                  },
                  {
                    claimId: 'c-06',
                    claimType: 'outcome',
                    claimText: 'sustaining 99.995% service availability and 85,000 eps peak throughput',
                    sourceQuote: 'Throughput Peak: Sustained 85,000 events/second... Availability: Sustained 99.995% uptime',
                    sourceType: 'source_backed',
                    confidenceScore: 97,
                    lineReference: 'Section 3.0 Results'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'art-002',
        title: 'Q3 Enterprise Product Experimentation & Onboarding Funnel Teardown',
        category: 'report',
        userRole: 'Senior Lead Product Manager',
        organization: 'KiteSync Enterprise SaaS',
        provenanceType: 'source_backed',
        description: 'Comprehensive A/B testing analysis, telemetry funnel dashboard export, and customer retention metrics across 40,000 workspace signups.',
        createdAt: '2025-10-02T08:15:00Z',
        updatedAt: '2025-10-04T12:00:00Z',
        tags: ['Product Analytics', 'A/B Testing', 'Retention', 'SaaS Growth', 'Mixpanel'],
        fileMetadata: {
          fileName: 'Q3-Product-Growth-Experimentation-Report.json',
          fileSize: 31200,
          mimeType: 'application/json',
          sha256Hash: '4a6b29d1c929837a7b11d8820f1883f882a9394f923b723901b092837482991a',
          preservationTimestamp: '2025-10-02T08:15:20Z',
          checksumVerified: true,
          storageUrl: 'gs://credence-vault-artifacts/users/u-001/Q3-Product-Growth.json'
        },
        rawContentText: `# Product Growth Experimentation Final Audit (Q3)
**Author**: Senior Lead Product Manager (Growth & Self-Serve Activation)
**Sample Size**: 42,800 new organization accounts across 12-week randomized cohort.

## Key Discovery
Initial drop-off analysis revealed that 62% of invited enterprise team members abandoned onboarding at the mandatory SAML/SSO configuration step due to poor error surfacing.

## Strategy & Experiments Executed
1. **Experiment EXP-108 (Frictionless Workspace Pre-population)**: Enabled instant collaborative sandbox workspace creation prior to domain verification.
2. **Experiment EXP-114 (Contextual Persona Routing)**: Implemented 3 tailored role-based checklists (Engineering, Security, Design).
3. **Automated Team Invitations (Viral Loop)**: Implemented inline Slack bot integration for 1-click colleague invites.

## Verified Results (Statistical Significance p < 0.001)
- Day-14 Active Team Retention: Rose from 18.4% (Control) to 34.2% (Treatment B), representing an 85.8% relative lift in activation.
- Time-to-First-Value (TTFV): Dropped from 48 minutes down to 6.5 minutes.
- Net Annualized Recurring Revenue Impact: Generated $1.42M in ARR expansion from self-serve tier conversions during the quarter.`,
        profile: {
          id: 'prof-002',
          artifactId: 'art-002',
          extractedAt: '2025-10-02T08:20:00Z',
          projectTitle: 'Product Growth Experimentation & Self-Serve Funnel Revamp',
          role: 'Senior Lead Product Manager',
          timeframe: 'Q3 2025',
          organization: 'KiteSync Enterprise SaaS',
          summary: 'Led end-to-end activation experimentation program across 42,800 accounts, achieving an 85.8% lift in D-14 retention and $1.42M in self-serve ARR expansion.',
          sourceBackingRatio: 96,
          actions: [
            {
              id: 'act-10',
              description: 'Designed and deployed frictionless workspace pre-population and contextual persona routing A/B experiments',
              directQuote: 'Enabled instant collaborative sandbox workspace creation... Implemented 3 tailored role-based checklists',
              sourceLineHint: 'Strategy & Experiments',
              confidence: 96
            },
            {
              id: 'act-11',
              description: 'Shipped automated Slack bot integration for frictionless 1-click viral team invitations',
              directQuote: 'Implemented inline Slack bot integration for 1-click colleague invites.',
              sourceLineHint: 'Strategy point 3',
              confidence: 94
            }
          ],
          metrics: [
            {
              id: 'met-10',
              metricName: 'D-14 Active Team Retention',
              baselineValue: '18.4%',
              achievedValue: '34.2%',
              percentageChange: '+85.8%',
              unit: '%',
              quote: 'Day-14 Active Team Retention: Rose from 18.4% (Control) to 34.2% (Treatment B), representing an 85.8% relative lift in activation.',
              isEstimated: false
            },
            {
              id: 'met-11',
              metricName: 'Time-to-First-Value',
              baselineValue: '48 mins',
              achievedValue: '6.5 mins',
              percentageChange: '-86.4%',
              unit: 'minutes',
              quote: 'Time-to-First-Value (TTFV): Dropped from 48 minutes down to 6.5 minutes.',
              isEstimated: false
            },
            {
              id: 'met-12',
              metricName: 'Net ARR Expansion',
              baselineValue: '$0',
              achievedValue: '$1,420,000',
              percentageChange: '+100%',
              unit: 'USD',
              quote: 'Generated $1.42M in ARR expansion from self-serve tier conversions during the quarter.',
              isEstimated: false
            }
          ],
          technologies: ['Mixpanel', 'FullStory', 'Segment', 'Slack API', 'SQL / BigQuery', 'LaunchDarkly'],
          collaborators: [
            { role: 'Staff Product Designer', team: 'Design Systems' },
            { role: 'Lead Data Scientist', team: 'Product Analytics' }
          ],
          challenges: [
            '62% onboarding drop-off at mandatory SAML/SSO step',
            'Preserving enterprise security compliance while reducing user onboarding friction'
          ],
          impactNarrative: 'Converted high-friction enterprise setup into a rapid time-to-value viral activation engine, adding $1.42M ARR and doubling user retention.'
        },
        transformations: [
          {
            id: 'tr-002',
            artifactId: 'art-002',
            profileId: 'prof-002',
            generatedAt: '2025-10-02T08:25:00Z',
            targetRole: 'Group Product Manager / Director of Product',
            bulletFormat: 'XYZ',
            headline: 'Grounded Product Leadership Transformation',
            overallStatus: 'partially_approved',
            bulletPoints: [
              {
                id: 'b-010',
                bulletText: 'Spearheaded self-serve onboarding redesign across 42.8K organizations, boosting Day-14 retention by 85.8% (18.4% to 34.2%) and unlocking $1.42M in new ARR expansion via persona-tailored workflows.',
                framework: 'XYZ (Accomplished [X] measured by [Y] by doing [Z])',
                overallConfidence: 97,
                reviewStatus: 'approved',
                reviewedAt: '2025-10-03T11:00:00Z',
                reviewedBy: 'Professional (Verified Author)',
                claims: [
                  {
                    claimId: 'c-10',
                    claimType: 'action',
                    claimText: 'Spearheaded self-serve onboarding redesign',
                    sourceQuote: 'Author: Senior Lead Product Manager (Growth & Self-Serve Activation)',
                    sourceType: 'source_backed',
                    confidenceScore: 98,
                    lineReference: 'Document Header'
                  },
                  {
                    claimId: 'c-11',
                    claimType: 'scope',
                    claimText: 'across 42.8K organizations',
                    sourceQuote: 'Sample Size: 42,800 new organization accounts across 12-week randomized cohort.',
                    sourceType: 'source_backed',
                    confidenceScore: 100,
                    lineReference: 'Header Note'
                  },
                  {
                    claimId: 'c-12',
                    claimType: 'metric',
                    claimText: 'boosting Day-14 retention by 85.8% (18.4% to 34.2%)',
                    sourceQuote: 'Day-14 Active Team Retention: Rose from 18.4% (Control) to 34.2% (Treatment B), representing an 85.8% relative lift in activation.',
                    sourceType: 'source_backed',
                    confidenceScore: 100,
                    lineReference: 'Section Verified Results'
                  },
                  {
                    claimId: 'c-13',
                    claimType: 'metric',
                    claimText: 'unlocking $1.42M in new ARR expansion',
                    sourceQuote: 'Generated $1.42M in ARR expansion from self-serve tier conversions during the quarter.',
                    sourceType: 'source_backed',
                    confidenceScore: 96,
                    lineReference: 'Section Verified Results'
                  }
                ]
              },
              {
                id: 'b-011',
                bulletText: 'Accelerated Time-to-First-Value by 86.4% (48 min down to 6.5 min) by introducing frictionless workspace sandboxing and automated Slack invitation viral loops.',
                framework: 'CAR (Context-Action-Result)',
                overallConfidence: 94,
                reviewStatus: 'pending',
                claims: [
                  {
                    claimId: 'c-14',
                    claimType: 'metric',
                    claimText: 'Accelerated Time-to-First-Value by 86.4% (48 min down to 6.5 min)',
                    sourceQuote: 'Time-to-First-Value (TTFV): Dropped from 48 minutes down to 6.5 minutes.',
                    sourceType: 'source_backed',
                    confidenceScore: 99,
                    lineReference: 'Section Verified Results'
                  },
                  {
                    claimId: 'c-15',
                    claimType: 'action',
                    claimText: 'introducing frictionless workspace sandboxing and automated Slack invitation viral loops',
                    sourceQuote: 'Enabled instant collaborative sandbox workspace creation... Implemented inline Slack bot integration',
                    sourceType: 'source_backed',
                    confidenceScore: 95,
                    lineReference: 'Strategy & Experiments'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'art-003',
        title: 'Phase II Oncology Clinical Trial Data Integrity Audit & Automated Pipeline',
        category: 'report',
        userRole: 'Principal Clinical Data Scientist',
        organization: 'Vanguard Therapeutics BioMed',
        provenanceType: 'source_backed',
        description: 'FDA 21 CFR Part 11 compliant data validation protocol, electronic trial master file (eTMF) reconciliation audit, and patient biomarker outlier pipeline.',
        createdAt: '2025-08-19T14:10:00Z',
        updatedAt: '2025-08-22T16:40:00Z',
        tags: ['Clinical Data', 'FDA Compliance', 'Python', 'Biostatistics', 'CDISC SDTM'],
        fileMetadata: {
          fileName: 'Audit-Report-Phase2-Data-Integrity-SDTM.pdf',
          fileSize: 84100,
          mimeType: 'application/pdf',
          sha256Hash: '9f8371a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
          preservationTimestamp: '2025-08-19T14:10:15Z',
          checksumVerified: true,
          storageUrl: 'gs://credence-vault-artifacts/users/u-001/Audit-Report-Phase2.pdf'
        },
        rawContentText: `# Regulatory Quality & Data Verification Audit Report (Study VT-302)
**Regulatory Body**: FDA / EMA Multi-Center Clinical Review
**Role**: Principal Clinical Data Scientist & eTMF Audit Lead
**Protocol**: Double-blind randomized Phase II oncology trial across 34 trial sites (N=640 patients).

## 1. Audit Context & Scope
Manual discrepancy resolution across 1.2 million electronic case report form (eCRF) data points previously required 9 weeks per data freeze cycle, creating risk of regulatory audit delays.

## 2. Automated Pipeline Implementation
- Developed an automated CDISC SDTM transformation pipeline in Python/R with SHA-256 dataset checksum sealing.
- Engineered 140+ real-time validation checks for adverse event (AE) temporal discordance and abnormal lab assay values.
- Built automated eTMF reconciliation dashboard reducing manual audit sampling time.

## 3. Verified Audit Outcomes
- Discrepancy Resolution Cycle Time: Decreased by 73% (from 9 weeks down to 2.4 weeks).
- Data Error Rate: Reduced critical protocol deviation data errors from 4.8% to 0.12% across 34 clinical sites.
- Inspection Readiness: Passed unannounced FDA bioresearch monitoring (BIMO) audit with 0 Form 483 inspection observations.`,
        profile: {
          id: 'prof-003',
          artifactId: 'art-003',
          extractedAt: '2025-08-19T14:15:00Z',
          projectTitle: 'Automated Clinical Trial Data Integrity & FDA Compliance Pipeline',
          role: 'Principal Clinical Data Scientist',
          timeframe: 'Jan - Aug 2025',
          organization: 'Vanguard Therapeutics BioMed',
          summary: 'Engineered automated CDISC-compliant regulatory pipeline across 34 clinical sites, slashing data freeze time by 73% and achieving zero Form 483 inspection observations.',
          sourceBackingRatio: 99,
          actions: [
            {
              id: 'act-20',
              description: 'Built automated CDISC SDTM validation pipeline with SHA-256 dataset checksums in Python/R',
              directQuote: 'Developed an automated CDISC SDTM transformation pipeline in Python/R with SHA-256 dataset checksum sealing.',
              sourceLineHint: 'Section 2.0 Pipeline',
              confidence: 99
            },
            {
              id: 'act-21',
              description: 'Engineered 140+ real-time validation checks for adverse event temporal discordance',
              directQuote: 'Engineered 140+ real-time validation checks for adverse event (AE) temporal discordance and abnormal lab assay values.',
              sourceLineHint: 'Section 2.0 Checks',
              confidence: 98
            }
          ],
          metrics: [
            {
              id: 'met-20',
              metricName: 'Discrepancy Resolution Cycle Time',
              baselineValue: '9 weeks',
              achievedValue: '2.4 weeks',
              percentageChange: '-73.3%',
              unit: 'weeks',
              quote: 'Discrepancy Resolution Cycle Time: Decreased by 73% (from 9 weeks down to 2.4 weeks).',
              isEstimated: false
            },
            {
              id: 'met-21',
              metricName: 'Critical Protocol Deviation Errors',
              baselineValue: '4.8%',
              achievedValue: '0.12%',
              percentageChange: '-97.5%',
              unit: '%',
              quote: 'Reduced critical protocol deviation data errors from 4.8% to 0.12% across 34 clinical sites.',
              isEstimated: false
            },
            {
              id: 'met-22',
              metricName: 'FDA Inspection Observations',
              baselineValue: 'N/A',
              achievedValue: '0 Form 483s',
              percentageChange: 'Clean Pass',
              unit: 'observations',
              quote: 'Passed unannounced FDA bioresearch monitoring (BIMO) audit with 0 Form 483 inspection observations.',
              isEstimated: false
            }
          ],
          technologies: ['Python', 'R', 'CDISC SDTM / ADAM', 'SAS', 'PostgreSQL', '21 CFR Part 11 Compliance'],
          collaborators: [
            { role: 'Medical Monitor', team: 'Clinical Affairs' },
            { role: 'Director of Regulatory Ops', team: 'Quality Assurance' }
          ],
          challenges: [
            'Strict FDA electronic record immutability requirements',
            'Cross-site inconsistent laboratory assay units and timestamps'
          ],
          impactNarrative: 'Delivered audit-ready clinical trial data automation resulting in zero regulatory inspection observations and 73% faster data freeze cycle.'
        },
        transformations: [
          {
            id: 'tr-003',
            artifactId: 'art-003',
            profileId: 'prof-003',
            generatedAt: '2025-08-19T14:20:00Z',
            targetRole: 'Director of Biometrics / Clinical Data Engineering',
            bulletFormat: 'STAR',
            headline: 'Regulated Life Sciences Evidence Transformation',
            overallStatus: 'approved',
            bulletPoints: [
              {
                id: 'b-020',
                bulletText: 'Engineered automated CDISC SDTM data verification pipeline across 34 global clinical trial sites (N=640), reducing data freeze cycle times by 73% (9 weeks to 2.4 weeks) and passing FDA BIMO audit with 0 Form 483 observations.',
                framework: 'STAR (Situation-Task-Action-Result)',
                overallConfidence: 99,
                reviewStatus: 'approved',
                reviewedAt: '2025-08-20T10:00:00Z',
                reviewedBy: 'Professional (Verified Author)',
                claims: [
                  {
                    claimId: 'c-20',
                    claimType: 'action',
                    claimText: 'Engineered automated CDISC SDTM data verification pipeline',
                    sourceQuote: 'Developed an automated CDISC SDTM transformation pipeline in Python/R with SHA-256 dataset checksum sealing.',
                    sourceType: 'source_backed',
                    confidenceScore: 100,
                    lineReference: 'Section 2.0 Pipeline'
                  },
                  {
                    claimId: 'c-21',
                    claimType: 'scope',
                    claimText: 'across 34 global clinical trial sites (N=640)',
                    sourceQuote: 'Double-blind randomized Phase II oncology trial across 34 trial sites (N=640 patients).',
                    sourceType: 'source_backed',
                    confidenceScore: 100,
                    lineReference: 'Header Protocol'
                  },
                  {
                    claimId: 'c-22',
                    claimType: 'metric',
                    claimText: 'reducing data freeze cycle times by 73% (9 weeks to 2.4 weeks)',
                    sourceQuote: 'Discrepancy Resolution Cycle Time: Decreased by 73% (from 9 weeks down to 2.4 weeks).',
                    sourceType: 'source_backed',
                    confidenceScore: 100,
                    lineReference: 'Section 3.0 Outcomes'
                  },
                  {
                    claimId: 'c-23',
                    claimType: 'outcome',
                    claimText: 'passing FDA BIMO audit with 0 Form 483 observations',
                    sourceQuote: 'Passed unannounced FDA bioresearch monitoring (BIMO) audit with 0 Form 483 inspection observations.',
                    sourceType: 'source_backed',
                    confidenceScore: 99,
                    lineReference: 'Section 3.0 Outcomes'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'art-004',
        title: 'Quarterly Strategic Leadership Reflection: Engineering Team Mentorship',
        category: 'other',
        userRole: 'Engineering Manager',
        organization: 'ScaleFlow Dynamics',
        provenanceType: 'self_reported',
        description: 'Personal retrospective notes on coaching 4 mid-level engineers to senior promotions and implementing weekly design reviews.',
        createdAt: '2025-12-01T09:00:00Z',
        updatedAt: '2025-12-01T09:00:00Z',
        tags: ['Engineering Leadership', 'Mentorship', 'Career Growth', 'Self-Reported'],
        fileMetadata: {
          fileName: 'Personal-Manager-Reflection-Q4.txt',
          fileSize: 12400,
          mimeType: 'text/plain',
          sha256Hash: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
          preservationTimestamp: '2025-12-01T09:00:02Z',
          checksumVerified: true
        },
        rawContentText: `# Personal Management Journal - Q4 Retrospective
**Author**: Engineering Manager (Core Services Team)
**Provenance**: Self-Reported Reflection (Internal Personal Notes)

This quarter I focused heavily on leveling up the team's architectural rigor and psychological safety.
- Held bi-weekly 1:1 career planning sessions with all 8 direct reports.
- Mentored 4 engineers through comprehensive promotional packets; all 4 were successfully promoted to Senior Engineer by the engineering leveling committee.
- Initiated a weekly architecture sync to review pull requests and reduce knowledge silos.
- Felt team morale and cohesion improved significantly based on 1:1 conversations and informal feedback.`,
        profile: {
          id: 'prof-004',
          artifactId: 'art-004',
          extractedAt: '2025-12-01T09:05:00Z',
          projectTitle: 'Engineering Team Mentorship & Architectural Reviews',
          role: 'Engineering Manager',
          timeframe: 'Q4 2025',
          organization: 'ScaleFlow Dynamics',
          summary: 'Self-reported retrospective detailing direct 1:1 mentorship of 8 engineers and facilitation of 4 senior promotions.',
          sourceBackingRatio: 65,
          actions: [
            {
              id: 'act-30',
              description: 'Facilitated bi-weekly 1:1 career development sessions with 8 engineers',
              directQuote: 'Held bi-weekly 1:1 career planning sessions with all 8 direct reports.',
              sourceLineHint: 'Reflection line 6',
              confidence: 88
            },
            {
              id: 'act-31',
              description: 'Mentored 4 engineers to promotion committee sign-off for Senior title',
              directQuote: 'Mentored 4 engineers through comprehensive promotional packets; all 4 were successfully promoted to Senior Engineer',
              sourceLineHint: 'Reflection line 7',
              confidence: 90
            }
          ],
          metrics: [
            {
              id: 'met-30',
              metricName: 'Promoted Direct Reports',
              baselineValue: '0',
              achievedValue: '4 promotions',
              percentageChange: '+4 promotions',
              unit: 'engineers',
              quote: 'all 4 were successfully promoted to Senior Engineer by the engineering leveling committee.',
              isEstimated: false
            }
          ],
          technologies: ['1:1 Coaching', 'Performance Review', 'Architectural Design Reviews'],
          collaborators: [
            { role: 'Leveling Committee', team: 'Engineering Leadership' }
          ],
          challenges: [
            'Knowledge silos across junior and senior team members'
          ],
          impactNarrative: 'Supported 4 engineers in achieving career promotions while establishing regular architectural review practices.'
        },
        transformations: [
          {
            id: 'tr-004',
            artifactId: 'art-004',
            profileId: 'prof-004',
            generatedAt: '2025-12-01T09:10:00Z',
            targetRole: 'Director of Engineering / Senior Manager',
            bulletFormat: 'XYZ',
            headline: 'Leadership Transformation (Self-Reported Evidence)',
            overallStatus: 'partially_approved',
            bulletPoints: [
              {
                id: 'b-030',
                bulletText: 'Mentored team of 8 engineers via structured bi-weekly career roadmaps, coaching 4 direct reports to successful Senior Engineer promotions through peer review committee.',
                framework: 'XYZ (Accomplished [X] measured by [Y] by doing [Z])',
                overallConfidence: 86,
                reviewStatus: 'approved',
                reviewedAt: '2025-12-02T14:00:00Z',
                reviewedBy: 'Professional (Verified Author)',
                userNotes: 'Note: Classified as Self-Reported reflection. Supported by leveling committee outcome.',
                claims: [
                  {
                    claimId: 'c-30',
                    claimType: 'action',
                    claimText: 'Mentored team of 8 engineers via structured bi-weekly career roadmaps',
                    sourceQuote: 'Held bi-weekly 1:1 career planning sessions with all 8 direct reports.',
                    sourceType: 'self_reported',
                    confidenceScore: 88,
                    lineReference: 'Journal line 6'
                  },
                  {
                    claimId: 'c-31',
                    claimType: 'metric',
                    claimText: 'coaching 4 direct reports to successful Senior Engineer promotions',
                    sourceQuote: 'all 4 were successfully promoted to Senior Engineer by the engineering leveling committee.',
                    sourceType: 'self_reported',
                    confidenceScore: 90,
                    lineReference: 'Journal line 7'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }
}
