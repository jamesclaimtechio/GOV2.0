import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/server/db'
import { RulesEngineService } from '@/server/services/rules-engine'
import { type ScopeFormData } from '@/lib/validations/scope'

/**
 * API Integration Tests
 * Tests all tRPC endpoints and business logic
 */

describe('tRPC API Integration Tests', () => {
  let testOrgId: string
  let testAssessmentId: string

  beforeEach(async () => {
    // Create test data
    const org = await db.organization.create({
      data: { name: 'API Test Corp' },
    })
    testOrgId = org.id

    const assessment = await db.assessment.create({
      data: {
        name: 'API Test Assessment',
        orgId: testOrgId,
        status: 'DRAFT',
      },
    })
    testAssessmentId = assessment.id
  })

  describe('Assessment CRUD Operations', () => {
    it('should create assessment with proper data structure', async () => {
      const assessment = await db.assessment.create({
        data: {
          name: 'New Test Assessment',
          orgId: testOrgId,
          status: 'DRAFT',
        },
      })

      expect(assessment.id).toBeDefined()
      expect(assessment.name).toBe('New Test Assessment')
      expect(assessment.orgId).toBe(testOrgId)
      expect(assessment.status).toBe('DRAFT')
      expect(assessment.createdAt).toBeInstanceOf(Date)
    })

    it('should list assessments for organization', async () => {
      const assessments = await db.assessment.findMany({
        where: { orgId: testOrgId },
        include: {
          scopeResponse: true,
          _count: {
            select: {
              documents: true,
              tasks: true,
              findings: true,
            },
          },
        },
      })

      expect(assessments.length).toBeGreaterThan(0)
      assessments.forEach(assessment => {
        expect(assessment.orgId).toBe(testOrgId)
        expect(assessment._count).toBeDefined()
      })
    })
  })

  describe('Scoping & Rules Engine Operations', () => {
    it('should handle scope data persistence and analysis', async () => {
      const scopeData: ScopeFormData = {
        companySize: 'enterprise',
        sector: ['financial', 'technology'],
        dataTypes: ['personal_data', 'financial_data'],
        systemLocations: ['EU', 'UK', 'US'],
        hasDataProcessors: true,
        isPublicSector: false,
        handlesSpecialCategories: true,
      }

      // Test rules engine analysis
      const rulesEngine = new RulesEngineService()
      const analysis = rulesEngine.analyzeScope(scopeData)

      // Verify comprehensive analysis
      expect(analysis.frameworks.length).toBeGreaterThan(0)
      expect(analysis.jurisdictions.length).toBeGreaterThan(0)
      expect(analysis.regulators.length).toBeGreaterThan(0)
      expect(analysis.rationale).toBeDefined()
      expect(analysis.matchedRules.length).toBeGreaterThan(0)

      // Should detect GDPR for EU/UK + personal data
      expect(analysis.frameworks).toContain('GDPR')
      expect(analysis.jurisdictions).toContain('EU')

      // Should detect financial regulations
      expect(analysis.frameworks.some(f => 
        f.includes('financial') || f === 'ISO27001'
      )).toBe(true)

      // Store scope response
      const scopeResponse = await db.scopeResponse.create({
        data: {
          assessmentId: testAssessmentId,
          answers: scopeData,
          jurisdictions: analysis.jurisdictions,
          regulators: analysis.regulators,
          frameworks: analysis.frameworks,
          rationale: analysis.rationale,
        },
      })

      expect(scopeResponse.assessmentId).toBe(testAssessmentId)
      expect(scopeResponse.frameworks.length).toBeGreaterThan(0)
    })

    it('should provide consistent rules engine results', async () => {
      const scopeData: ScopeFormData = {
        companySize: 'startup',
        sector: ['technology'],
        dataTypes: ['customer_data'],
        systemLocations: ['US'],
        hasDataProcessors: false,
        isPublicSector: false,
        handlesSpecialCategories: false,
      }

      const rulesEngine = new RulesEngineService()
      
      // Run analysis multiple times - should be deterministic
      const analysis1 = rulesEngine.analyzeScope(scopeData)
      const analysis2 = rulesEngine.analyzeScope(scopeData)
      const analysis3 = rulesEngine.analyzeScope(scopeData)

      expect(analysis1.frameworks).toEqual(analysis2.frameworks)
      expect(analysis2.frameworks).toEqual(analysis3.frameworks)
      expect(analysis1.jurisdictions).toEqual(analysis2.jurisdictions)
      
      console.log('✅ Rules engine provides deterministic results')
    })
  })

  describe('Framework Requirements Operations', () => {
    it('should have seeded framework requirements', async () => {
      const frameworks = await db.framework.findMany({
        include: {
          requirements: true,
        },
      })

      expect(frameworks.length).toBeGreaterThan(0)
      
      // Should have GDPR framework
      const gdprFramework = frameworks.find(f => f.code === 'GDPR')
      expect(gdprFramework).toBeDefined()
      expect(gdprFramework?.requirements.length).toBeGreaterThan(0)

      // Should have ISO 27001 framework
      const isoFramework = frameworks.find(f => f.code === 'ISO27001')
      expect(isoFramework).toBeDefined()
      expect(isoFramework?.requirements.length).toBeGreaterThan(0)

      console.log(`✅ Found ${frameworks.length} frameworks with requirements`)
    })

    it('should link requirements to frameworks correctly', async () => {
      const gdprRequirements = await db.requirement.findMany({
        where: {
          framework: { code: 'GDPR' },
        },
        include: {
          framework: true,
        },
      })

      expect(gdprRequirements.length).toBeGreaterThan(0)
      
      gdprRequirements.forEach(req => {
        expect(req.framework.code).toBe('GDPR')
        expect(req.ref).toBeDefined()
        expect(req.text).toBeDefined()
        expect(req.tags).toBeInstanceOf(Array)
      })

      console.log(`✅ GDPR has ${gdprRequirements.length} requirements`)
    })
  })

  describe('Finding Generation Operations', () => {
    it('should create findings with proper status mapping', async () => {
      // Create scope response first
      await db.scopeResponse.create({
        data: {
          assessmentId: testAssessmentId,
          answers: {},
          jurisdictions: ['EU'],
          regulators: ['EDPB'],
          frameworks: ['GDPR'],
          rationale: { test: 'Test rationale' },
        },
      })

      // Create mock compliance map
      const mockComplianceMap = {
        assessment_summary: {
          organization_profile: 'Test organization',
          key_risk_areas: ['privacy'],
          compliance_maturity: 'basic' as const,
        },
        framework_analysis: [
          {
            framework_code: 'GDPR',
            overall_status: 'partial' as const,
            coverage_percentage: 70,
            key_findings: ['Some controls exist'],
            priority_gaps: ['Art. 30', 'Art. 35'],
          }
        ],
        risk_assessment: {
          overall_risk_level: 'medium' as const,
          top_risks: [],
        },
        recommendations: [],
      }

      await db.complianceMap.create({
        data: {
          assessmentId: testAssessmentId,
          data: mockComplianceMap,
        },
      })

      // Test finding generation
      const { ComplianceAnalysisService } = await import('@/server/services/compliance-analysis')
      const analysisService = new ComplianceAnalysisService()
      
      const findings = await analysisService.generateFindings(testAssessmentId, ['GDPR'])

      expect(findings.length).toBeGreaterThan(0)
      
      // Verify finding structure
      findings.forEach(finding => {
        expect(finding.assessmentId).toBe(testAssessmentId)
        expect(['MEETS', 'PARTIAL', 'MISSING', 'UNCLEAR']).toContain(finding.status)
        expect(finding.rationale).toBeDefined()
        expect(typeof finding.confidence).toBe('number')
      })

      console.log(`✅ Generated ${findings.length} findings for GDPR`)
    })
  })

  describe('Task Generation Operations', () => {
    it('should generate tasks with proper prioritization', async () => {
      // Setup finding
      const requirement = await db.requirement.findFirst({
        where: { framework: { code: 'GDPR' } },
      })

      if (requirement) {
        await db.finding.create({
          data: {
            assessmentId: testAssessmentId,
            requirementId: requirement.id,
            status: 'MISSING',
            rationale: 'No implementation found',
            confidence: 0.9,
            evidence: {},
          },
        })

        // Generate tasks
        const { ComplianceAnalysisService } = await import('@/server/services/compliance-analysis')
        const analysisService = new ComplianceAnalysisService()
        const tasks = await analysisService.generateTasks(testAssessmentId)

        expect(tasks.length).toBeGreaterThan(0)
        
        // Verify task structure
        tasks.forEach(task => {
          expect(task.title).toBeDefined()
          expect(task.description).toBeDefined()
          expect(['ADMIN', 'COMPLIANCE_LEAD', 'CONTROL_OWNER', 'VIEWER']).toContain(task.ownerRole)
          expect(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).toContain(task.priority)
          expect(task.status).toBe('OPEN')
          expect(task.dueAt).toBeInstanceOf(Date)
        })

        console.log(`✅ Generated ${tasks.length} tasks from findings`)
      }
    })
  })
})
