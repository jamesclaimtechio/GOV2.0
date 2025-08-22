import OpenAI from 'openai'
import { z } from 'zod'

/**
 * Centralized OpenAI client factory as required by setup.mdc
 * Handles all LLM tasks: responses, chat, embeddings
 */

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default configuration for deterministic tasks
export const DEFAULT_CONFIG = {
  model: 'gpt-4o', // Latest stable model
  temperature: 0.1, // Low temperature for consistent, deterministic results
  max_tokens: 4000,
  top_p: 0.9,
} as const

// Fallback model for when primary is unavailable
export const FALLBACK_CONFIG = {
  model: 'gpt-4o-mini',
  temperature: 0.1,
  max_tokens: 4000,
  top_p: 0.9,
} as const

/**
 * Compliance Map Analysis Schema
 * Enforces JSON structure for compliance mapping responses
 */
export const ComplianceMapSchema = z.object({
  assessment_summary: z.object({
    organization_profile: z.string(),
    key_risk_areas: z.array(z.string()),
    compliance_maturity: z.enum(['basic', 'developing', 'managed', 'optimized']),
  }),
  framework_analysis: z.array(z.object({
    framework_code: z.string(),
    overall_status: z.enum(['compliant', 'partial', 'non_compliant', 'not_applicable']),
    coverage_percentage: z.number().min(0).max(100),
    key_findings: z.array(z.string()),
    priority_gaps: z.array(z.string()),
  })),
  risk_assessment: z.object({
    overall_risk_level: z.enum(['low', 'medium', 'high', 'critical']),
    top_risks: z.array(z.object({
      description: z.string(),
      impact: z.enum(['low', 'medium', 'high', 'critical']),
      likelihood: z.enum(['low', 'medium', 'high', 'critical']),
      frameworks_affected: z.array(z.string()),
    })),
  }),
  recommendations: z.array(z.object({
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    category: z.string(),
    description: z.string(),
    frameworks: z.array(z.string()),
    estimated_effort: z.enum(['hours', 'days', 'weeks', 'months']),
  })),
})

export type ComplianceMapResult = z.infer<typeof ComplianceMapSchema>

/**
 * Generate compliance map from scoping data and optional documents
 */
export async function generateComplianceMap(
  scopeData: any,
  applicableFrameworks: string[],
  documentContext?: string
): Promise<ComplianceMapResult> {
  
  const prompt = `You are a senior compliance expert analyzing an organization's regulatory requirements.

ORGANIZATION CONTEXT:
${JSON.stringify(scopeData, null, 2)}

APPLICABLE FRAMEWORKS:
${applicableFrameworks.join(', ')}

${documentContext ? `DOCUMENT CONTEXT:\n${documentContext}\n` : ''}

Based on this information, provide a comprehensive compliance analysis following this exact JSON schema:

{
  "assessment_summary": {
    "organization_profile": "Brief description of the organization's risk profile",
    "key_risk_areas": ["area1", "area2", "area3"],
    "compliance_maturity": "basic|developing|managed|optimized"
  },
  "framework_analysis": [
    {
      "framework_code": "GDPR",
      "overall_status": "compliant|partial|non_compliant|not_applicable", 
      "coverage_percentage": 85,
      "key_findings": ["finding1", "finding2"],
      "priority_gaps": ["gap1", "gap2"]
    }
  ],
  "risk_assessment": {
    "overall_risk_level": "low|medium|high|critical",
    "top_risks": [
      {
        "description": "Risk description",
        "impact": "low|medium|high|critical",
        "likelihood": "low|medium|high|critical", 
        "frameworks_affected": ["GDPR", "ISO27001"]
      }
    ]
  },
  "recommendations": [
    {
      "priority": "low|medium|high|urgent",
      "category": "Category name",
      "description": "Detailed recommendation",
      "frameworks": ["GDPR"],
      "estimated_effort": "hours|days|weeks|months"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON matching this exact schema. No markdown, no explanations, just the JSON object.`

  try {
    const response = await openai.chat.completions.create({
      ...DEFAULT_CONFIG,
      messages: [
        {
          role: 'system',
          content: 'You are a compliance expert. Always respond with valid JSON only.',
        },
        {
          role: 'user', 
          content: prompt,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse and validate JSON response
    const parsed = JSON.parse(content)
    return ComplianceMapSchema.parse(parsed)

  } catch (error) {
    console.error('OpenAI compliance analysis failed:', error)
    
    // Retry with fallback model
    try {
      const fallbackResponse = await openai.chat.completions.create({
        ...FALLBACK_CONFIG,
        messages: [
          {
            role: 'system',
            content: 'You are a compliance expert. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const fallbackContent = fallbackResponse.choices[0]?.message?.content
      if (!fallbackContent) {
        throw new Error('No response from fallback model')
      }

      const parsed = JSON.parse(fallbackContent)
      return ComplianceMapSchema.parse(parsed)
      
    } catch (fallbackError) {
      console.error('Fallback model also failed:', fallbackError)
      throw new Error('Failed to generate compliance analysis')
    }
  }
}

/**
 * Generate embeddings for document similarity search
 */
export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
      encoding_format: 'float',
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Failed to generate embeddings:', error)
    throw new Error('Embedding generation failed')
  }
}

/**
 * Conflict analysis between frameworks
 */
export const ConflictAnalysisSchema = z.object({
  conflicts: z.array(z.object({
    summary: z.string(),
    description: z.string(),
    impact: z.enum(['low', 'medium', 'high', 'critical']),
    affected_requirements: z.array(z.object({
      framework: z.string(),
      requirement_ref: z.string(),
      requirement_text: z.string(),
    })),
    mitigations: z.array(z.object({
      strategy: z.string(),
      description: z.string(),
      effort: z.enum(['low', 'medium', 'high']),
      effectiveness: z.enum(['low', 'medium', 'high']),
    })),
  })),
})

export type ConflictAnalysisResult = z.infer<typeof ConflictAnalysisSchema>

/**
 * Analyze conflicts between multiple frameworks
 */
export async function analyzeFrameworkConflicts(
  findings: any[],
  frameworks: string[]
): Promise<ConflictAnalysisResult> {
  
  const prompt = `You are analyzing potential conflicts between regulatory frameworks.

FRAMEWORKS: ${frameworks.join(', ')}

CURRENT FINDINGS:
${JSON.stringify(findings, null, 2)}

Identify conflicts where:
1. Different frameworks have contradictory requirements
2. Timeline conflicts (different deadlines for similar controls)
3. Implementation approaches that can't coexist
4. Overlapping but inconsistent documentation requirements

Return analysis in this exact JSON format:

{
  "conflicts": [
    {
      "summary": "Brief conflict description",
      "description": "Detailed explanation of the conflict",
      "impact": "low|medium|high|critical",
      "affected_requirements": [
        {
          "framework": "GDPR",
          "requirement_ref": "Art. 30",
          "requirement_text": "Records of processing activities"
        }
      ],
      "mitigations": [
        {
          "strategy": "Unified approach",
          "description": "How to resolve the conflict",
          "effort": "low|medium|high",
          "effectiveness": "low|medium|high"
        }
      ]
    }
  ]
}

Return ONLY valid JSON, no markdown or explanations.`

  try {
    const response = await openai.chat.completions.create({
      ...DEFAULT_CONFIG,
      messages: [
        {
          role: 'system',
          content: 'You are a regulatory compliance expert specializing in framework conflicts. Respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(content)
    return ConflictAnalysisSchema.parse(parsed)

  } catch (error) {
    console.error('Conflict analysis failed:', error)
    throw new Error('Failed to analyze framework conflicts')
  }
}
