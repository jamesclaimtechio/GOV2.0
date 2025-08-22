import { RegulatorRule, ScopeFormData } from '@/lib/types'
import rulesData from '@/server/rules/regulator_rules.json'

/**
 * Rules Engine Service
 * 
 * Analyzes scoping form responses and determines:
 * - Applicable jurisdictions
 * - Relevant regulatory bodies  
 * - Required compliance frameworks
 * - Justification rationale
 */

interface RulesEngineResult {
  jurisdictions: string[]
  regulators: string[]
  frameworks: string[]
  rationale: Record<string, string>
  matchedRules: string[]
}

export class RulesEngineService {
  private rules: RegulatorRule[]

  constructor() {
    this.rules = rulesData.rules as RegulatorRule[]
  }

  /**
   * Analyze scope responses to determine applicable compliance requirements
   */
  public analyzeScope(scopeData: ScopeFormData): RulesEngineResult {
    const matchedRules: RegulatorRule[] = []
    
    // Evaluate each rule against the scope data
    for (const rule of this.rules) {
      if (this.evaluateRule(rule, scopeData)) {
        matchedRules.push(rule)
      }
    }

    // Aggregate results from matched rules
    const jurisdictions = new Set<string>()
    const regulators = new Set<string>()
    const frameworks = new Set<string>()
    const rationale: Record<string, string> = {}

    for (const rule of matchedRules) {
      // Add results
      rule.results.jurisdictions.forEach(j => jurisdictions.add(j))
      rule.results.regulators.forEach(r => regulators.add(r))
      rule.results.frameworks.forEach(f => frameworks.add(f))
      
      // Track rationale
      rationale[rule.id] = rule.rationale
    }

    return {
      jurisdictions: Array.from(jurisdictions),
      regulators: Array.from(regulators),
      frameworks: Array.from(frameworks),
      rationale,
      matchedRules: matchedRules.map(r => r.id),
    }
  }

  /**
   * Evaluate if a rule should trigger based on scope data
   */
  private evaluateRule(rule: RegulatorRule, scopeData: ScopeFormData): boolean {
    const triggers = rule.triggers

    // Check sector matching
    if (triggers.sectors && scopeData.sector) {
      const sectorMatch = scopeData.sector.some(s => triggers.sectors!.includes(s))
      if (!sectorMatch) return false
    }

    // Check jurisdiction matching  
    if (triggers.jurisdictions && scopeData.systemLocations) {
      const jurisdictionMatch = scopeData.systemLocations.some(loc => 
        triggers.jurisdictions!.includes(loc)
      )
      if (!jurisdictionMatch) return false
    }

    // Check data types matching
    if (triggers.dataTypes && scopeData.dataTypes) {
      const dataTypeMatch = scopeData.dataTypes.some(dt => 
        triggers.dataTypes!.includes(dt)
      )
      if (!dataTypeMatch) return false
    }

    // Check company size
    if (triggers.companySize && !triggers.companySize.includes(scopeData.companySize)) {
      return false
    }

    // Check additional conditions
    if (triggers.conditions) {
      for (const [key, expectedValue] of Object.entries(triggers.conditions)) {
        switch (key) {
          case 'any_eu_data_processing':
            if (expectedValue && !this.hasEuDataProcessing(scopeData)) return false
            break
          case 'handles_financial_transactions':
            if (expectedValue && !this.handlesFinancialData(scopeData)) return false
            break
          case 'fca_regulated':
            if (expectedValue && !this.isFcaRegulated(scopeData)) return false
            break
        }
      }
    }

    return true
  }

  /**
   * Helper methods for complex conditions
   */
  private hasEuDataProcessing(scopeData: ScopeFormData): boolean {
    const euJurisdictions = ['EU', 'UK', 'EEA', 'Germany', 'France', 'Netherlands', 'Ireland']
    return scopeData.systemLocations.some(loc => euJurisdictions.includes(loc)) ||
           scopeData.dataTypes.includes('personal_data')
  }

  private handlesFinancialData(scopeData: ScopeFormData): boolean {
    return scopeData.dataTypes.includes('financial_data') ||
           scopeData.sector.includes('financial') ||
           scopeData.sector.includes('banking') ||
           scopeData.sector.includes('payment_services')
  }

  private isFcaRegulated(scopeData: ScopeFormData): boolean {
    return scopeData.systemLocations.includes('UK') &&
           (scopeData.sector.includes('financial') || scopeData.sector.includes('banking'))
  }

  /**
   * Get available options for the scoping form
   */
  public static getScopeOptions() {
    return {
      sectors: rulesData.sectors,
      dataTypes: rulesData.data_types,
      jurisdictions: rulesData.jurisdictions,
    }
  }
}
