import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const app = express();

const PORT = Number(process.env['PORT']) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserPath = path.join(__dirname, 'dist', 'credence-clean', 'browser');

app.use(cors());
app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  vertexai: true,
  project: 'credence-career-vault-2026',
  location: 'global',
});

app.post('/api/gemini/extract-evidence', async (req, res) => {
  try {
    const { rawContentText, title, artifactType, userRole, organization, imageBase64, mimeType } =
      req.body;

    if (!rawContentText && !imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Artifact content is required.',
      });
    }

    const prompt = `
You are the evidence extraction engine for Credence, a career evidence vault.

Analyze the supplied career artifact conservatively.

IMPORTANT RULES:
- Do not invent achievements, metrics, technologies, collaborators, or outcomes.
- Every extracted action and metric must be grounded in the supplied artifact.
- directQuote and quote must contain text actually present in the source.
- If information is absent, use an empty array or empty string.
- Never infer a metric that is not explicitly supported.
- Preserve every numeric value exactly as it appears in the source.
- Do not convert, normalize, approximate, round, shorten, expand, reinterpret, or replace numbers.
- This applies to currency, percentages, counts, dates, durations, quantities, ratings, scores, award amounts, incentive amounts, and any other measurable value.
- Preserve qualifiers attached to numbers, including words or symbols such as "more than", "over", "under", "approximately", "+", "<", ">", "million", "M", "K", "%", and currency symbols.
- If the source says "more than $1 million", do not rewrite it as "$1M", "$1,000,000", "$100", or any other value.
- If a numeric value is unclear or unreadable, do not guess it. Leave the corresponding metric field empty.
- confidence and sourceBackingRatio MUST be integers from 0 to 100, where 100 means fully supported by the supplied source.
- Return JSON only.

ARTIFACT METADATA:
Title: ${title || ''}
Artifact type: ${artifactType || ''}
User role: ${userRole || ''}
Organization: ${organization || ''}

SOURCE CONTENT:
${rawContentText || ''}

Return this JSON structure:

{
  "projectTitle": "",
  "role": "",
  "timeframe": "",
  "organization": "",
  "summary": "",
  "actions": [
    {
      "description": "",
      "directQuote": "",
      "sourceLineHint": "",
      "confidence": 0
    }
  ],
  "metrics": [
    {
      "metricName": "",
      "baselineValue": "",
      "achievedValue": "",
      "percentageChange": "",
      "unit": "",
      "quote": "",
      "isEstimated": false
    }
  ],
  "technologies": [],
  "collaborators": [
    {
      "role": "",
      "team": ""
    }
  ],
  "challenges": [],
  "impactNarrative": "",
  "sourceBackingRatio": 0
}
`;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        temperature: 0,
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    let rawProfile;

try {
  rawProfile = JSON.parse(response.text);
} catch (parseError) {
  console.error('Invalid Gemini JSON response:', response.text);
  throw new Error('Gemini returned malformed JSON.');
}

    const normalizeConfidence = (value: unknown): number => {
      const num = Number(value);

      if (Number.isNaN(num)) {
        return 0;
      }

      // Gemini may return 0–1 instead of 0–100
      if (num >= 0 && num <= 1) {
        return Math.round(num * 100);
      }

      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const profile = {
      ...rawProfile,

      actions: (rawProfile.actions || []).map((action: any) => ({
        ...action,
        confidence: normalizeConfidence(action.confidence),
      })),

      challenges: (rawProfile.challenges || []).map((challenge: any) => {
        if (typeof challenge === 'string') {
          return challenge;
        }

        return (
          challenge.challenge ||
          challenge.constraint ||
          challenge.description ||
          challenge.text ||
          JSON.stringify(challenge)
        );
      }),

      sourceBackingRatio: normalizeConfidence(rawProfile.sourceBackingRatio),
    };

    return res.json({
      success: true,
      profile,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini extraction failed:', error);

    return res.status(500).json({
      success: false,
      error: error?.message || 'Gemini extraction failed.',
    });
  }
  return;
});

app.post('/api/gemini/generate-bullet', async (req, res) => {
  try {
    const { evidenceProfile, rawArtifactText, targetRole, bulletFormat } = req.body;

    if (!evidenceProfile) {
      return res.status(400).json({
        success: false,
        error: 'Evidence profile is required.',
      });
    }

    const prompt = `
You are the career evidence transformation engine for Credence.

Your job is to transform VERIFIED evidence into resume-ready bullets.

CRITICAL RULES:
- Use only information supported by the supplied evidence profile and source artifact.
- Do not invent metrics, scope, technologies, outcomes, teams, or responsibilities.
- Every meaningful claim must include a supporting source quote.
- Preserve every numeric value exactly as it appears in the supporting source evidence.
- Never convert, normalize, approximate, round, shorten, expand, reinterpret, or replace a numeric value or its qualifier.
- If the exact numeric value cannot be supported by a source quote, do not include that numeric claim.
- If a claim cannot be grounded, do not include it.
- Confidence scores MUST be integers from 0 to 100.
- Artifact metadata such as organization, role, project title, filename, and target role is context only. Do not present it as a factual claim in the LinkedIn post unless it is explicitly supported by the source evidence or a direct source quote.
- TARGET ROLE is transformation guidance only. Never claim that the user currently holds that role unless the source evidence explicitly supports it.
- Return JSON only.

TARGET ROLE:
${targetRole || 'Software Engineer'}

REQUESTED FORMAT:
${bulletFormat || 'XYZ'}

EVIDENCE PROFILE:
${JSON.stringify(evidenceProfile, null, 2)}

SOURCE EVIDENCE:
${
  rawArtifactText
    ? rawArtifactText
    : `This evidence originated from a visual artifact.

The original visual artifact was analyzed during evidence extraction.
Use ONLY the Evidence Profile above, including its direct source quotes,
actions, metrics, challenges, impact narrative, and other explicitly
extracted evidence.

Do not infer additional facts from the artifact title, filename,
organization, role, or missing context.`
}

Return this JSON structure:

{
  "headline": "",
  "bulletPoints": [
    {
      "bulletText": "",
      "framework": "",
      "overallConfidence": 0,
      "claims": [
        {
          "claimType": "action",
          "claimText": "",
          "sourceQuote": "",
          "sourceType": "source_backed",
          "confidenceScore": 0,
          "lineReference": ""
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    const rawTransformation = JSON.parse(response.text);

    const normalizeForComparison = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const extractNumericExpressions = (text: string): string[] => {
  if (!text) {
    return [];
  }

  const pattern =
    /(?:more than|less than|over|under|approximately|approx\.?|about|at least|at most|up to)?\s*(?:[$£€₹]\s*)?\d+(?:,\d{3})*(?:\.\d+)?\s*(?:%|percent|k|thousand|m|mn|million|b|bn|billion)?/gi;

  return (text.match(pattern) || [])
    .map(value => normalizeForComparison(value))
    .filter(Boolean);
};

const sourceEvidenceText = normalizeForComparison(
  [
    rawArtifactText || '',

    ...(evidenceProfile.actions || []).map(
      (action: any) => action.directQuote || ''
    ),

    ...(evidenceProfile.metrics || []).map(
      (metric: any) => metric.quote || ''
    ),
  ].join(' ')
);

for (const bullet of rawTransformation.bulletPoints || []) {
  const textsToValidate = [
    bullet.bulletText || '',
    ...(bullet.claims || []).map((claim: any) => claim.claimText || ''),
  ];

  for (const text of textsToValidate) {
    const numericExpressions = extractNumericExpressions(text);

    for (const expression of numericExpressions) {
      if (!sourceEvidenceText.includes(expression)) {
        throw new Error(
          `Numeric grounding validation failed: "${expression}" is not supported by the source evidence.`
        );
      }
    }
  }
}

    const normalizeConfidence = (value: unknown): number => {
      const num = Number(value);

      if (Number.isNaN(num)) {
        return 0;
      }

      if (num >= 0 && num <= 1) {
        return Math.round(num * 100);
      }

      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const transformation = {
      ...rawTransformation,

      bulletPoints: (rawTransformation.bulletPoints || []).map((bullet: any) => ({
        ...bullet,

        overallConfidence: normalizeConfidence(bullet.overallConfidence),

        claims: (bullet.claims || []).map((claim: any) => ({
          ...claim,

          sourceType: claim.sourceType || 'source_backed',

          confidenceScore: normalizeConfidence(claim.confidenceScore),
        })),
      })),
    };

    return res.json({
      success: true,
      transformation,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini bullet generation failed:', error);

    return res.status(500).json({
      success: false,
      error: error?.message || 'Gemini bullet generation failed.',
    });
  }
});

app.post('/api/gemini/generate-linkedin-post', async (req, res) => {
  try {
    const { evidenceProfile, rawArtifactText, targetRole } = req.body;

    if (!evidenceProfile) {
      return res.status(400).json({
        success: false,
        error: 'Evidence profile is required.',
      });
    }

    const prompt = `
You are the career evidence transformation engine for Credence.

Your job is to transform VERIFIED career evidence into a grounded LinkedIn post.

CRITICAL RULES:
- Use only information supported by the supplied evidence profile and source artifact.
- Do not invent metrics, scope, technologies, outcomes, teams, responsibilities, emotions, lessons, or motivations.
- Every meaningful claim must be grounded in the supplied evidence.
- Preserve every numeric value exactly as it appears in the supporting source evidence.
- Never convert, normalize, approximate, round, shorten, expand, reinterpret, or replace a numeric value or its qualifier.
- If the exact numeric value cannot be supported by source evidence, do not include that numeric claim.
- Do not exaggerate the user's impact.
- Do not add generic inspirational language that is unsupported by the evidence.
- Do not add hashtags unless they are directly relevant to the evidence and professional context.
- Return JSON only.

TARGET ROLE:
${targetRole || 'Software Engineer'}

EVIDENCE PROFILE:
${JSON.stringify(evidenceProfile, null, 2)}

SOURCE EVIDENCE:
${
  rawArtifactText
    ? rawArtifactText
    : `This evidence originated from a visual artifact.

The original visual artifact was analyzed during evidence extraction.
Use ONLY the Evidence Profile above, including its direct source quotes,
actions, metrics, challenges, impact narrative, and other explicitly
extracted evidence.

Do not infer additional facts from the artifact title, filename,
organization, role, or missing context.`
}

Return this JSON structure:

{
  "headline": "",
  "postText": "",
  "overallConfidence": 0,
  "claims": [
    {
      "claimType": "action",
      "claimText": "",
      "sourceQuote": "",
      "sourceType": "source_backed",
      "confidenceScore": 0,
      "lineReference": ""
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    const rawPost = JSON.parse(response.text);

    const normalizeForComparison = (value: string): string =>
      value
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const extractNumericExpressions = (text: string): string[] => {
      if (!text) {
        return [];
      }

      const pattern =
        /(?:more than|less than|over|under|approximately|approx\.?|about|at least|at most|up to)?\s*(?:[$£€₹]\s*)?\d+(?:,\d{3})*(?:\.\d+)?\s*(?:%|percent|k|thousand|m|mn|million|b|bn|billion)?/gi;

      return (text.match(pattern) || [])
        .map((value) => normalizeForComparison(value))
        .filter(Boolean);
    };

    const sourceEvidenceText = normalizeForComparison(
      [
        rawArtifactText || '',

        ...(evidenceProfile.actions || []).map(
          (action: any) => action.directQuote || '',
        ),

        ...(evidenceProfile.metrics || []).map(
          (metric: any) => metric.quote || '',
        ),
      ].join(' '),
    );

    const textsToValidate = [
      rawPost.postText || '',
      ...(rawPost.claims || []).map((claim: any) => claim.claimText || ''),
    ];

    for (const text of textsToValidate) {
      const numericExpressions = extractNumericExpressions(text);

      for (const expression of numericExpressions) {
        if (!sourceEvidenceText.includes(expression)) {
          throw new Error(
            `Numeric grounding validation failed: "${expression}" is not supported by the source evidence.`,
          );
        }
      }
    }

    const normalizeConfidence = (value: unknown): number => {
      const num = Number(value);

      if (Number.isNaN(num)) {
        return 0;
      }

      if (num >= 0 && num <= 1) {
        return Math.round(num * 100);
      }

      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const linkedinPost = {
      ...rawPost,
      overallConfidence: normalizeConfidence(rawPost.overallConfidence),

      claims: (rawPost.claims || []).map((claim: any) => ({
        ...claim,
        sourceType: claim.sourceType || 'source_backed',
        confidenceScore: normalizeConfidence(claim.confidenceScore),
      })),
    };

    return res.json({
      success: true,
      linkedinPost,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini LinkedIn post generation failed:', error);

    return res.status(500).json({
      success: false,
      error: error?.message || 'Gemini LinkedIn post generation failed.',
    });
  }
});

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'credence-gemini-backend',
  });
});

// Serve the Angular production build
app.use(express.static(browserPath));

// Angular SPA fallback
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
    return res.sendFile(path.join(browserPath, 'index.html'));
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Credence running on port ${PORT}`);
});
