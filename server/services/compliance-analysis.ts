import { db } from '@/server/db'
import { generateComplianceMap, analyzeFrameworkConflicts, type ComplianceMapResult, type ConflictAnalysisResult } from '@/server/ai/openai'
import { RulesEngineService } from './rules-engine'
import { type ScopeFormData } from '@/lib/validations/scope'

/**
 * Compliance Analysis Service
 * Orchestrates the complete compliance analysis workflow
 */
export class ComplianceAnalysisService {
  private rulesEngine: RulesEngineService

  constructor() {
    this.rulesEngine = new RulesEngineService()
  }

  /**
   * Build complete compliance map for an assessment
   */
  async buildComplianceMap(assessmentId: string): Promise<ComplianceMapResult> {
    // Get assessment with scope data
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        scopeResponse: true,
        documents: true,
      },
    })

    if (!assessment?.scopeResponse) {
      throw new Error('Assessment must have scope data before building compliance map')
    }

    // Extract document context if available
    let documentContext: string | undefined
    if (assessment.documents.length > 0) {
      // TODO: Extract text from uploaded documents
      documentContext = 'Document analysis will be implemented with file upload service'
    }

    // Generate AI-powered compliance analysis
    const complianceMap = await generateComplianceMap(
      assessment.scopeResponse.answers,
      assessment.scopeResponse.frameworks,
      documentContext
    )

    // Store the compliance map
    await db.complianceMap.upsert({
      where: { assessmentId },
      update: { data: complianceMap },
      create: {
        assessmentId,
        data: complianceMap,
      },
    })

    // Audit log
    await db.auditLog.create({
      data: {
        assessmentId,
        action: 'compliance_map.build',
        entityType: 'ComplianceMap',
        entityId: assessmentId,
        data: { frameworks: assessment.scopeResponse.frameworks },
      },
    })

    return complianceMap
  }

  /**
   * Generate findings for each framework requirement
   */
  async generateFindings(assessmentId: string, frameworkCodes: string[]) {
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        complianceMap: true,
        scopeResponse: true,
      },
    })

    if (!assessment?.complianceMap) {
      throw new Error('Compliance map must be built before generating findings')
    }

    // Get requirements for selected frameworks
    const requirements = await db.requirement.findMany({
      where: {
        framework: {
          code: {
            in: frameworkCodes,
          },
        },
      },
      include: {
        framework: true,
      },
    })

    const complianceData = assessment.complianceMap.data as ComplianceMapResult
    const findings = []

    // Create findings based on AI analysis
    for (const frameworkAnalysis of complianceData.framework_analysis) {
      const frameworkRequirements = requirements.filter(
        req => req.framework.code === frameworkAnalysis.framework_code
      )

      for (const requirement of frameworkRequirements) {
        // Determine status based on framework analysis
        let status: 'MEETS' | 'PARTIAL' | 'MISSING' | 'UNCLEAR'
        let confidence = 0.8

        if (frameworkAnalysis.overall_status === 'compliant') {
          status = 'MEETS'
        } else if (frameworkAnalysis.overall_status === 'partial') {
          status = 'PARTIAL'
        } else if (frameworkAnalysis.overall_status === 'non_compliant') {
          status = 'MISSING'
        } else {
          status = 'UNCLEAR'
          confidence = 0.5
        }

        // Check if this requirement is mentioned in priority gaps
        if (frameworkAnalysis.priority_gaps.some(gap => 
          gap.toLowerCase().includes(requirement.ref.toLowerCase())
        )) {
          status = 'MISSING'
          confidence = 0.9
        }

        const finding = await db.finding.upsert({
          where: {
            assessmentId_requirementId: {
              assessmentId,
              requirementId: requirement.id,
            },
          },
          update: {
            status,
            confidence,
            rationale: `Based on AI analysis of ${frameworkAnalysis.framework_code} compliance`,
            evidence: {},
          },
          create: {
            assessmentId,
            requirementId: requirement.id,
            status,
            confidence,
            rationale: `Based on AI analysis of ${frameworkAnalysis.framework_code} compliance`,
            evidence: {},
          },
        })

        findings.push(finding)
      }
    }

    return findings
  }

  /**
   * Detect and analyze conflicts between frameworks
   */
  async detectConflicts(assessmentId: string): Promise<ConflictAnalysisResult> {
    const findings = await db.finding.findMany({
      where: { assessmentId },
      include: {
        requirement: {
          include: {
            framework: true,
          },
        },
      },
    })

    const frameworks = Array.from(new Set(findings.map(f => f.requirement.framework.code)))
    
    if (frameworks.length < 2) {
      return { conflicts: [] } // No conflicts possible with single framework
    }

    // Use AI to analyze potential conflicts
    const conflictAnalysis = await analyzeFrameworkConflicts(findings, frameworks)

    // Store conflicts in database
    for (const conflict of conflictAnalysis.conflicts) {
      const createdConflict = await db.conflict.create({
        data: {
          assessmentId,
          summary: conflict.summary,
          description: conflict.description,
          impact: conflict.impact.toUpperCase() as any,
          mitigations: conflict.mitigations,
        },
      })

      // Link affected requirements
      for (const affectedReq of conflict.affected_requirements) {
        const requirement = await db.requirement.findFirst({
          where: {
            ref: affectedReq.requirement_ref,
            framework: {
              code: affectedReq.framework,
            },
          },
        })

        if (requirement) {
          await db.conflictRequirement.create({
            data: {
              conflictId: createdConflict.id,
              requirementId: requirement.id,
            },
          })
        }
      }
    }

    return conflictAnalysis
  }

  /**
   * Generate actionable tasks from findings and conflicts
   */
  async generateTasks(assessmentId: string) {
    const [findings, conflicts, complianceMap] = await Promise.all([
      db.finding.findMany({
        where: { assessmentId },
        include: { requirement: { include: { framework: true } } },
      }),
      db.conflict.findMany({
        where: { assessmentId },
        include: { requirements: { include: { requirement: true } } },
      }),
      db.complianceMap.findUnique({
        where: { assessmentId },
      }),
    ])

    const tasks = []

    // Create tasks for missing/partial findings
    for (const finding of findings) {
      if (finding.status === 'MISSING' || finding.status === 'PARTIAL') {
        const priority = this.calculateTaskPriority(finding, complianceMap)
        
        const task = await db.task.create({
          data: {
            assessmentId,
            requirementId: finding.requirementId,
            title: `Implement ${finding.requirement.framework.code} ${finding.requirement.ref}`,
            description: `Address compliance gap: ${finding.requirement.text}`,
            ownerRole: this.determineOwnerRole(finding.requirement),
            priority,
            status: 'OPEN',
            dueAt: this.calculateDueDate(priority),
          },
        })

        tasks.push(task)
      }
    }

    // Create tasks for conflict resolution
    for (const conflict of conflicts) {
      const task = await db.task.create({
        data: {
          assessmentId,
          title: `Resolve Framework Conflict: ${conflict.summary}`,
          description: `${conflict.description}\n\nSuggested mitigations:\n${JSON.stringify(conflict.mitigations, null, 2)}`,
          ownerRole: 'COMPLIANCE_LEAD',
          priority: conflict.impact === 'CRITICAL' ? 'URGENT' : 'HIGH',
          status: 'OPEN',
          dueAt: this.calculateDueDate('HIGH'),
        },
      })

      tasks.push(task)
    }

    return tasks
  }

  /**
   * Calculate task priority based on finding and compliance context
   */
  private calculateTaskPriority(
    finding: any,
    complianceMap: any
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    // High confidence missing requirements get high priority
    if (finding.status === 'MISSING' && finding.confidence > 0.8) {
      return 'HIGH'
    }

    // Requirements in critical risk areas get urgent priority
    if (finding.requirement.tags.includes('security') || 
        finding.requirement.tags.includes('breach_notification')) {
      return 'URGENT'
    }

    // Partial implementations get medium priority
    if (finding.status === 'PARTIAL') {
      return 'MEDIUM'
    }

    return 'LOW'
  }

  /**
   * Determine appropriate owner role for a requirement
   */
  private determineOwnerRole(requirement: any): 'ADMIN' | 'COMPLIANCE_LEAD' | 'CONTROL_OWNER' | 'VIEWER' {
    if (requirement.tags.includes('policy') || requirement.tags.includes('governance')) {
      return 'COMPLIANCE_LEAD'
    }

    if (requirement.tags.includes('security') || requirement.tags.includes('technical_measures')) {
      return 'CONTROL_OWNER'
    }

    return 'COMPLIANCE_LEAD' // Default
  }

  /**
   * Calculate due date based on priority
   */
  private calculateDueDate(priority: string): Date {
    const now = new Date()
    
    switch (priority) {
      case 'URGENT':
        now.setDate(now.getDate() + 7) // 1 week
        break
      case 'HIGH':
        now.setDate(now.getDate() + 30) // 1 month
        break
      case 'MEDIUM':
        now.setDate(now.getDate() + 60) // 2 months
        break
      default:
        now.setDate(now.getDate() + 90) // 3 months
    }

    return now
  }
}
