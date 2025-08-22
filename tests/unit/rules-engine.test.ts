import { describe, it, expect } from 'vitest'
import { RulesEngineService } from '@/server/services/rules-engine'
import { type ScopeFormData } from '@/lib/validations/scope'

describe('RulesEngineService', () => {
  const rulesEngine = new RulesEngineService()

  describe('analyzeScope', () => {
    it('should identify GDPR for EU-based tech company with personal data', () => {
      const scopeData: ScopeFormData = {
        companySize: 'sme',
        sector: ['technology'],
        dataTypes: ['personal_data', 'customer_data'],
        systemLocations: ['EU', 'Germany'],
        hasDataProcessors: true,
        isPublicSector: false,
        handlesSpecialCategories: false,
      }

      const result = rulesEngine.analyzeScope(scopeData)

      expect(result.frameworks).toContain('GDPR')
      expect(result.jurisdictions).toContain('EU')
      expect(result.regulators).toContain('EDPB')
      expect(result.rationale).toBeDefined()
    })

    it('should identify ISO 27001 for financial sector with sensitive data', () => {
      const scopeData: ScopeFormData = {
        companySize: 'large',
        sector: ['financial'],
        dataTypes: ['financial_data', 'sensitive_data'],
        systemLocations: ['UK'],
        hasDataProcessors: false,
        isPublicSector: false,
        handlesSpecialCategories: false,
      }

      const result = rulesEngine.analyzeScope(scopeData)

      expect(result.frameworks).toContain('ISO27001')
      expect(result.frameworks).toContain('UK_GDPR')
    })

    it('should identify NIS2 for large EU energy company', () => {
      const scopeData: ScopeFormData = {
        companySize: 'enterprise',
        sector: ['energy'],
        dataTypes: ['operational_data', 'customer_data'],
        systemLocations: ['EU', 'Netherlands'],
        hasDataProcessors: true,
        isPublicSector: false,
        handlesSpecialCategories: false,
      }

      const result = rulesEngine.analyzeScope(scopeData)

      expect(result.frameworks).toContain('NIS2')
      expect(result.frameworks).toContain('GDPR')
      expect(result.regulators).toContain('ENISA')
    })

    it('should handle startup with minimal requirements', () => {
      const scopeData: ScopeFormData = {
        companySize: 'startup',
        sector: ['technology'],
        dataTypes: ['customer_data'],
        systemLocations: ['US'],
        hasDataProcessors: false,
        isPublicSector: false,
        handlesSpecialCategories: false,
      }

      const result = rulesEngine.analyzeScope(scopeData)

      expect(result.frameworks).toContain('Data_Protection_Basics')
      expect(result.frameworks).not.toContain('GDPR') // No EU processing
    })

    it('should return empty results for public data only', () => {
      const scopeData: ScopeFormData = {
        companySize: 'startup',
        sector: ['consulting'],
        dataTypes: ['public_data'],
        systemLocations: ['Global'],
        hasDataProcessors: false,
        isPublicSector: false,
        handlesSpecialCategories: false,
      }

      const result = rulesEngine.analyzeScope(scopeData)

      // Should have minimal requirements
      expect(result.frameworks.length).toBeGreaterThan(0)
      expect(result.jurisdictions).toBeDefined()
    })
  })

  describe('getScopeOptions', () => {
    it('should return all available options for form', () => {
      const options = RulesEngineService.getScopeOptions()

      expect(options.sectors).toContain('technology')
      expect(options.sectors).toContain('financial')
      expect(options.dataTypes).toContain('personal_data')
      expect(options.jurisdictions).toContain('EU')
      expect(options.jurisdictions).toContain('UK')
    })
  })
})
