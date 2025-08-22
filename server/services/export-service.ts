import { db } from '@/server/db'
import { type TaskWithRequirement, type FindingWithRequirement } from '@/lib/types'

/**
 * Export Service for CSV and PDF generation
 * Implements export requirements from setup.mdc
 */

export class ExportService {
  /**
   * Export tasks to CSV format
   */
  static async exportTasksToCSV(assessmentId: string): Promise<string> {
    const tasks = await db.task.findMany({
      where: { assessmentId },
      include: {
        requirement: {
          include: {
            framework: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueAt: 'asc' },
      ],
    })

    // CSV headers
    const headers = [
      'Task ID',
      'Title',
      'Description', 
      'Framework',
      'Requirement Ref',
      'Priority',
      'Status',
      'Owner Role',
      'Due Date',
      'Created Date',
      'Last Updated',
    ]

    // Convert tasks to CSV rows
    const rows = tasks.map(task => [
      task.id,
      `"${task.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${task.description.replace(/"/g, '""')}"`,
      task.requirement?.framework.code || 'N/A',
      task.requirement?.ref || 'N/A',
      task.priority,
      task.status,
      task.ownerRole,
      task.dueAt?.toISOString().split('T')[0] || 'No due date',
      task.createdAt.toISOString().split('T')[0],
      task.updatedAt.toISOString().split('T')[0],
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    return csvContent
  }

  /**
   * Export findings to CSV format
   */
  static async exportFindingsToCSV(assessmentId: string): Promise<string> {
    const findings = await db.finding.findMany({
      where: { assessmentId },
      include: {
        requirement: {
          include: {
            framework: true,
          },
        },
      },
      orderBy: [
        { requirement: { framework: { code: 'asc' } } },
        { requirement: { ref: 'asc' } },
      ],
    })

    const headers = [
      'Finding ID',
      'Framework',
      'Requirement Ref',
      'Requirement Text',
      'Status',
      'Confidence',
      'Rationale',
      'Category',
      'Tags',
      'Created Date',
    ]

    const rows = findings.map(finding => [
      finding.id,
      finding.requirement.framework.code,
      finding.requirement.ref,
      `"${finding.requirement.text.replace(/"/g, '""')}"`,
      finding.status,
      finding.confidence?.toString() || 'N/A',
      `"${finding.rationale.replace(/"/g, '""')}"`,
      finding.requirement.category || 'N/A',
      `"${finding.requirement.tags.join(', ')}"`,
      finding.createdAt.toISOString().split('T')[0],
    ])

    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')
  }

  /**
   * Generate PDF summary report
   * TODO: Implement with PDF generation library
   */
  static async generatePDFSummary(assessmentId: string): Promise<Buffer> {
    const [assessment, findings, conflicts, tasks] = await Promise.all([
      db.assessment.findUnique({
        where: { id: assessmentId },
        include: {
          organization: true,
          scopeResponse: true,
          complianceMap: true,
        },
      }),
      db.finding.findMany({
        where: { assessmentId },
        include: {
          requirement: {
            include: { framework: true },
          },
        },
      }),
      db.conflict.findMany({
        where: { assessmentId },
        include: {
          requirements: {
            include: {
              requirement: {
                include: { framework: true },
              },
            },
          },
        },
      }),
      db.task.findMany({
        where: { assessmentId },
        include: {
          requirement: {
            include: { framework: true },
          },
        },
      }),
    ])

    if (!assessment) {
      throw new Error('Assessment not found')
    }

    // TODO: Implement PDF generation with puppeteer or similar
    // For now, return placeholder
    const pdfContent = `
    Gov 2.0 Compliance Assessment Report
    =====================================
    
    Organization: ${assessment.organization.name}
    Assessment: ${assessment.name}
    Date: ${assessment.createdAt.toISOString().split('T')[0]}
    
    Executive Summary:
    - Total Requirements: ${findings.length}
    - Compliance Gaps: ${findings.filter(f => f.status === 'MISSING').length}
    - Conflicts Detected: ${conflicts.length}
    - Tasks Generated: ${tasks.length}
    
    Framework Analysis:
    ${findings.reduce((acc, finding) => {
      const framework = finding.requirement.framework.code
      if (!acc[framework]) {
        acc[framework] = { total: 0, meets: 0, partial: 0, missing: 0 }
      }
      acc[framework].total++
      acc[framework][finding.status.toLowerCase()]++
      return acc
    }, {} as any)}
    
    This is a placeholder. PDF generation will be implemented in the next iteration.
    `

    return Buffer.from(pdfContent, 'utf-8')
  }

  /**
   * Get export metadata
   */
  static async getExportMetadata(assessmentId: string) {
    const [tasksCount, findingsCount, conflictsCount] = await Promise.all([
      db.task.count({ where: { assessmentId } }),
      db.finding.count({ where: { assessmentId } }),
      db.conflict.count({ where: { assessmentId } }),
    ])

    return {
      assessmentId,
      exportDate: new Date().toISOString(),
      counts: {
        tasks: tasksCount,
        findings: findingsCount,
        conflicts: conflictsCount,
      },
    }
  }
}
