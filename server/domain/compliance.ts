/**
 * Pure domain entities and business logic
 * No dependencies on external services or databases
 */

export interface ComplianceEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface OrganizationProfile {
  size: 'startup' | 'sme' | 'large' | 'enterprise'
  sectors: string[]
  jurisdictions: string[]
  dataTypes: string[]
  isPublicSector: boolean
  hasDataProcessors: boolean
  handlesSpecialCategories: boolean
}

export interface RegulatoryFramework {
  code: string
  name: string
  version: string
  jurisdiction: string
  applicabilityRules: FrameworkRule[]
}

export interface FrameworkRule {
  id: string
  triggers: {
    sectors?: string[]
    jurisdictions?: string[]
    dataTypes?: string[]
    companySize?: string[]
    conditions?: Record<string, boolean>
  }
  weight: number // For prioritization when multiple rules match
}

export interface ComplianceRequirement {
  id: string
  frameworkCode: string
  reference: string
  title: string
  description: string
  category: string
  tags: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  implementationComplexity: 'simple' | 'moderate' | 'complex' | 'expert'
}

export interface ComplianceFinding {
  requirementId: string
  status: 'meets' | 'partial' | 'missing' | 'unclear'
  confidence: number // 0-1
  evidence: Evidence[]
  rationale: string
  recommendations: string[]
}

export interface Evidence {
  type: 'document' | 'policy' | 'procedure' | 'control' | 'audit'
  description: string
  source?: string
  quality: 'low' | 'medium' | 'high'
}

export interface ComplianceConflict {
  id: string
  summary: string
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  affectedRequirements: ComplianceRequirement[]
  mitigationStrategies: MitigationStrategy[]
}

export interface MitigationStrategy {
  strategy: string
  description: string
  effort: 'low' | 'medium' | 'high'
  effectiveness: 'low' | 'medium' | 'high'
  timeline: string
  resources: string[]
}

export interface ComplianceTask {
  id: string
  title: string
  description: string
  ownerRole: 'admin' | 'compliance_lead' | 'control_owner' | 'viewer'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'blocked' | 'done'
  dueDate?: Date
  estimatedEffort: string
  linkedRequirements: string[]
  dependencies: string[]
}

/**
 * Business Rules for Compliance Analysis
 */
export class ComplianceAnalysisRules {
  /**
   * Determine if a framework applies to an organization
   */
  static isFrameworkApplicable(
    framework: RegulatoryFramework,
    profile: OrganizationProfile
  ): boolean {
    return framework.applicabilityRules.some(rule => 
      this.evaluateRule(rule, profile)
    )
  }

  /**
   * Calculate compliance priority based on risk and impact
   */
  static calculatePriority(
    requirement: ComplianceRequirement,
    finding: ComplianceFinding,
    organizationProfile: OrganizationProfile
  ): 'low' | 'medium' | 'high' | 'urgent' {
    // High-risk requirements in regulated sectors get urgent priority
    if (requirement.riskLevel === 'critical' && finding.status === 'missing') {
      return 'urgent'
    }

    // Missing requirements with high confidence get high priority
    if (finding.status === 'missing' && finding.confidence > 0.8) {
      return 'high'
    }

    // Partial implementations get medium priority
    if (finding.status === 'partial') {
      return 'medium'
    }

    return 'low'
  }

  /**
   * Evaluate a framework rule against organization profile
   */
  private static evaluateRule(rule: FrameworkRule, profile: OrganizationProfile): boolean {
    // Check sector matching
    if (rule.triggers.sectors) {
      const hasMatchingSector = profile.sectors.some(sector => 
        rule.triggers.sectors!.includes(sector)
      )
      if (!hasMatchingSector) return false
    }

    // Check jurisdiction matching
    if (rule.triggers.jurisdictions) {
      const hasMatchingJurisdiction = profile.jurisdictions.some(jurisdiction => 
        rule.triggers.jurisdictions!.includes(jurisdiction)
      )
      if (!hasMatchingJurisdiction) return false
    }

    // Check data type matching
    if (rule.triggers.dataTypes) {
      const hasMatchingDataType = profile.dataTypes.some(dataType => 
        rule.triggers.dataTypes!.includes(dataType)
      )
      if (!hasMatchingDataType) return false
    }

    // Check company size
    if (rule.triggers.companySize && !rule.triggers.companySize.includes(profile.size)) {
      return false
    }

    // Check additional conditions
    if (rule.triggers.conditions) {
      for (const [key, expectedValue] of Object.entries(rule.triggers.conditions)) {
        const actualValue = (profile as any)[key]
        if (actualValue !== expectedValue) return false
      }
    }

    return true
  }
}
