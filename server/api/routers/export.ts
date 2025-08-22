import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { ExportService } from '@/server/services/export-service'

export const exportRouter = createTRPCRouter({
  tasks: createTRPCRouter({
    csv: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
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

        const csvContent = await ExportService.exportTasksToCSV(input.assessmentId)
        
        // Audit log
        await ctx.db.auditLog.create({
          data: {
            assessmentId: input.assessmentId,
            actorId: ctx.session.user.id,
            action: 'export.tasks.csv',
            entityType: 'Task',
            data: { format: 'csv' },
          },
        })

        return {
          content: csvContent,
          filename: `${assessment.name}-tasks-${new Date().toISOString().split('T')[0]}.csv`,
          mimeType: 'text/csv',
        }
      }),
  }),

  findings: createTRPCRouter({
    csv: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .mutation(async ({ ctx, input }) => {
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

        const csvContent = await ExportService.exportFindingsToCSV(input.assessmentId)
        
        await ctx.db.auditLog.create({
          data: {
            assessmentId: input.assessmentId,
            actorId: ctx.session.user.id,
            action: 'export.findings.csv',
            entityType: 'Finding',
            data: { format: 'csv' },
          },
        })

        return {
          content: csvContent,
          filename: `${assessment.name}-findings-${new Date().toISOString().split('T')[0]}.csv`,
          mimeType: 'text/csv',
        }
      }),
  }),

  summary: createTRPCRouter({
    pdf: protectedProcedure
      .input(z.object({ assessmentId: z.string().cuid() }))
      .mutation(async ({ ctx, input }) => {
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

        const pdfBuffer = await ExportService.generatePDFSummary(input.assessmentId)
        
        await ctx.db.auditLog.create({
          data: {
            assessmentId: input.assessmentId,
            actorId: ctx.session.user.id,
            action: 'export.summary.pdf',
            entityType: 'Assessment',
            data: { format: 'pdf' },
          },
        })

        return {
          content: pdfBuffer.toString('base64'),
          filename: `${assessment.name}-summary-${new Date().toISOString().split('T')[0]}.pdf`,
          mimeType: 'application/pdf',
        }
      }),
  }),

  metadata: protectedProcedure
    .input(z.object({ assessmentId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
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

      return ExportService.getExportMetadata(input.assessmentId)
    }),
})
