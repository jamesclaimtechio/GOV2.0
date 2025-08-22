import { createTRPCRouter } from '@/server/api/trpc'
import { assessmentRouter } from './routers/assessment'
import { exportRouter } from './routers/export'

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assessment: assessmentRouter,
  export: exportRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
