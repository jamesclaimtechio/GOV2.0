import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, demoProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { RulesEngineService } from '@/server/services/rules-engine'
import { scopeFormSchema } from '@/lib/validations/scope'

const createAssessmentSchema = z.object({
  name: z.string().min(1).max(255),
})

const setScopeSchema = z.object({
  assessmentId: z.string().cuid(),
  answers: scopeFormSchema,
})

export const assessmentRouter = createTRPCRouter({
  create: demoProcedure
    .input(createAssessmentSchema)
    .mutation(async ({ ctx, input }) => {
      // Ensure user has orgId in session
      if (!ctx.session.user.orgId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User must belong to an organization',
        })
      }

      const assessment = await ctx.db.assessment.create({
        data: {
          name: input.name,
          orgId: ctx.session.user.orgId,
          status: 'DRAFT',
        },
      })

      // Audit log
      await ctx.db.auditLog.create({
        data: {
          assessmentId: assessment.id,
          actorId: ctx.session.user.id,
          action: 'assessment.create',
          entityType: 'Assessment',
          entityId: assessment.id,
          data: { name: input.name },
        },
      })

      return assessment
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User must belong to an organization',
      })
    }

    return ctx.db.assessment.findMany({
      where: {
        orgId: ctx.session.user.orgId,
      },
      orderBy: {
        createdAt: 'desc',
      },
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
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const assessment = await ctx.db.assessment.findFirst({
        where: {
          id: input.id,
          orgId: ctx.session.user.orgId,
        },
        include: {
          scopeResponse: true,
          documents: true,
          complianceMap: true,
          findings: {
            include: {
              requirement: {
                include: {
                  framework: true,
                },
              },
            },
          },
          conflicts: {
            include: {
              requirements: {
                include: {
                  requirement: {
                    include: {
                      framework: true,
                    },
                  },
                },
              },
            },
          },
          tasks: {
            include: {
              requirement: {
                include: {
                  framework: true,
                },
              },
            },
          },
        },
      })

      if (!assessment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Assessment not found',
        })
      }

      return assessment
    }),

  scope: createTRPCRouter({
    set: demoProcedure
      .input(setScopeSchema)
      .mutation(async ({ ctx, input }) => {
        // Verify assessment belongs to user's org
        const assessment = await ctx.db.assessment.findFirst({
          where: {
            id: input.assessmentId,
            orgId: ctx.session.user.orgId,
          },
        })

        if (!assessment) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Assessment not found',
          })
        }

        // Use rules engine to derive applicable requirements
        const rulesEngine = new RulesEngineService()
        const analysisResult = rulesEngine.analyzeScope(input.answers)
        
        const derivation = {
          jurisdictions: analysisResult.jurisdictions,
          regulators: analysisResult.regulators,
          frameworks: analysisResult.frameworks,
          rationale: analysisResult.rationale,
        }

        const scopeResponse = await ctx.db.scopeResponse.upsert({
          where: {
            assessmentId: input.assessmentId,
          },
          update: {
            answers: input.answers,
            ...derivation,
          },
          create: {
            assessmentId: input.assessmentId,
            answers: input.answers,
            ...derivation,
          },
        })

        // Audit log
        await ctx.db.auditLog.create({
          data: {
            assessmentId: input.assessmentId,
            actorId: ctx.session.user.id,
            action: 'scope.set',
            entityType: 'ScopeResponse',
            entityId: scopeResponse.id,
            data: input.answers,
          },
        })

        return scopeResponse
      }),

    get: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .query(async ({ ctx, input }) => {
        const scopeResponse = await ctx.db.scopeResponse.findFirst({
          where: {
            assessmentId: input.assessmentId,
            assessment: {
              orgId: ctx.session.user.orgId,
            },
          },
        })

        return scopeResponse
      }),
  }),

  // File upload endpoints
  upload: createTRPCRouter({
    add: protectedProcedure
      .input(z.object({ 
        assessmentId: z.string().cuid(),
        fileName: z.string(),
        fileType: z.enum(['POLICY', 'PROCEDURE', 'EVIDENCE', 'REPORT', 'OTHER']),
        checksum: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify assessment belongs to user's org
        const assessment = await ctx.db.assessment.findFirst({
          where: {
            id: input.assessmentId,
            orgId: ctx.session.user.orgId,
          },
        })

        if (!assessment) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Assessment not found',
          })
        }

        // TODO: Implement actual file upload logic
        const document = await ctx.db.document.create({
          data: {
            assessmentId: input.assessmentId,
            type: input.fileType,
            originalName: input.fileName,
            storageUrl: `/uploads/${input.fileName}`, // Placeholder
            checksum: input.checksum,
            sizeBytes: 0, // Will be set by upload service
          },
        })

        return document
      }),
  }),

  // Compliance map building
  map: createTRPCRouter({
    build: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .mutation(async ({ ctx, input }) => {
        const { ComplianceAnalysisService } = await import('@/server/services/compliance-analysis')
        const analysisService = new ComplianceAnalysisService()
        
        const complianceMap = await analysisService.buildComplianceMap(input.assessmentId)
        return complianceMap
      }),

    get: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .query(async ({ ctx, input }) => {
        const complianceMap = await ctx.db.complianceMap.findFirst({
          where: {
            assessmentId: input.assessmentId,
            assessment: {
              orgId: ctx.session.user.orgId,
            },
          },
        })

        return complianceMap
      }),
  }),

  // Framework comparison
  compare: createTRPCRouter({
    run: protectedProcedure
      .input(z.object({
        assessmentId: z.string().cuid(),
        frameworkCodes: z.array(z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { ComplianceAnalysisService } = await import('@/server/services/compliance-analysis')
        const analysisService = new ComplianceAnalysisService()
        
        const findings = await analysisService.generateFindings(
          input.assessmentId,
          input.frameworkCodes
        )

        // Audit log
        await ctx.db.auditLog.create({
          data: {
            assessmentId: input.assessmentId,
            actorId: ctx.session.user.id,
            action: 'comparison.run',
            entityType: 'Finding',
            data: { frameworkCodes: input.frameworkCodes },
          },
        })

        return findings
      }),
  }),

  // Conflict detection
  conflict: createTRPCRouter({
    run: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .mutation(async ({ ctx, input }) => {
        const { ComplianceAnalysisService } = await import('@/server/services/compliance-analysis')
        const analysisService = new ComplianceAnalysisService()
        
        const conflicts = await analysisService.detectConflicts(input.assessmentId)
        return conflicts
      }),

    list: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.conflict.findMany({
          where: {
            assessmentId: input.assessmentId,
            assessment: {
              orgId: ctx.session.user.orgId,
            },
          },
          include: {
            requirements: {
              include: {
                requirement: {
                  include: {
                    framework: true,
                  },
                },
              },
            },
          },
        })
      }),
  }),

  // Task management
  tasks: createTRPCRouter({
    generate: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .mutation(async ({ ctx, input }) => {
        const { ComplianceAnalysisService } = await import('@/server/services/compliance-analysis')
        const analysisService = new ComplianceAnalysisService()
        
        const tasks = await analysisService.generateTasks(input.assessmentId)
        return tasks
      }),

    list: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.task.findMany({
          where: {
            assessmentId: input.assessmentId,
            assessment: {
              orgId: ctx.session.user.orgId,
            },
          },
          include: {
            requirement: {
              include: {
                framework: true,
              },
            },
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'asc' },
          ],
        })
      }),

    update: protectedProcedure
      .input(z.object({
        taskId: z.string().cuid(),
        status: z.enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']),
      }))
      .mutation(async ({ ctx, input }) => {
        const task = await ctx.db.task.findFirst({
          where: {
            id: input.taskId,
            assessment: {
              orgId: ctx.session.user.orgId,
            },
          },
        })

        if (!task) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found',
          })
        }

        const updatedTask = await ctx.db.task.update({
          where: { id: input.taskId },
          data: { status: input.status },
        })

        // Audit log
        await ctx.db.auditLog.create({
          data: {
            assessmentId: task.assessmentId,
            actorId: ctx.session.user.id,
            action: 'task.update',
            entityType: 'Task',
            entityId: task.id,
            data: { status: input.status },
          },
        })

        return updatedTask
      }),
  }),

  // Findings management
  findings: createTRPCRouter({
    list: protectedProcedure
      .input(z.object({ 
        assessmentId: z.string().cuid(),
        frameworkCode: z.string().optional(),
        status: z.enum(['MEETS', 'PARTIAL', 'MISSING', 'UNCLEAR']).optional(),
      }))
      .query(async ({ ctx, input }) => {
        const whereClause: any = {
          assessmentId: input.assessmentId,
          assessment: {
            orgId: ctx.session.user.orgId,
          },
        }

        if (input.status) {
          whereClause.status = input.status
        }

        if (input.frameworkCode) {
          whereClause.requirement = {
            framework: {
              code: input.frameworkCode,
            },
          }
        }

        return ctx.db.finding.findMany({
          where: whereClause,
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
      }),
  }),

  // Control validation
  validate: createTRPCRouter({
    control: protectedProcedure
      .input(z.object({
        assessmentId: z.string().cuid(),
        proposal: z.string(),
        requirementId: z.string().cuid().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement AI-powered control validation
        // For now, return mock validation result
        return {
          pass: true,
          gaps: [],
          docs_required: [],
          confidence: 0.85,
          feedback: 'Proposed control appears to address the requirement adequately.',
        }
      }),
  }),
})
