// Re-export Prisma types for easier imports  
import type {
  User,
  Organization,
  Assessment,
  ScopeResponse,
  Document,
  ComplianceMap,
  Framework,
  Requirement,
  Finding,
  Conflict,
  Task,
  AuditLog,
  UserRole,
  AssessmentStatus,
  DocumentType,
  FindingStatus,
  ConflictImpact,
  TaskStatus,
  TaskPriority,
} from '@prisma/client'

export type {
  User,
  Organization,
  Assessment,
  ScopeResponse,
  Document,
  ComplianceMap,
  Framework,
  Requirement,
  Finding,
  Conflict,
  Task,
  AuditLog,
  UserRole,
  AssessmentStatus,
  DocumentType,
  FindingStatus,
  ConflictImpact,
  TaskStatus,
  TaskPriority,
}

// Extended types for API responses
export interface AssessmentWithDetails extends Assessment {
  scopeResponse?: ScopeResponse | null
  documents: Document[]
  complianceMap?: ComplianceMap | null
  findings: FindingWithRequirement[]
  conflicts: ConflictWithRequirements[]
  tasks: TaskWithRequirement[]
  _count: {
    documents: number
    tasks: number
    findings: number
  }
}

export interface FindingWithRequirement extends Finding {
  requirement: RequirementWithFramework
}

export interface RequirementWithFramework extends Requirement {
  framework: Framework
}

export interface ConflictWithRequirements extends Conflict {
  requirements: {
    requirement: RequirementWithFramework
  }[]
}

export interface TaskWithRequirement extends Task {
  requirement?: RequirementWithFramework | null
}

// Scoping form types
export interface ScopeFormData {
  companySize: 'startup' | 'sme' | 'large' | 'enterprise'
  sector: string[]
  dataTypes: string[]
  systemLocations: string[]
  hasDataProcessors: boolean
  isPublicSector: boolean
  handlesSpecialCategories: boolean
}

// Rules engine types
export interface RegulatorRule {
  id: string
  name: string
  triggers: {
    sectors?: string[]
    jurisdictions?: string[]
    dataTypes?: string[]
    companySize?: string[]
    conditions?: Record<string, any>
  }
  results: {
    jurisdictions: string[]
    regulators: string[]
    frameworks: string[]
  }
  rationale: string
}
