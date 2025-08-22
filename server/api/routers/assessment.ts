import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
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
  create: protectedProcedure
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
    set: protectedProcedure
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
})
