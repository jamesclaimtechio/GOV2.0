import { TRPCError, initTRPC } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { type Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { authOptions } from '@/server/auth'
import { db } from '@/server/db'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  session: Session | null
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  }
}

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  // For App Router, we don't have access to req/res in the same way
  // Session will be handled at the procedure level
  return createInnerTRPCContext({
    session: null, // Will be set by auth middleware
  })
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE HELPERS
 *
 * These are helper functions to create tRPC routers and procedures
 */

export const createTRPCRouter = t.router

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Reusable middleware that enforces users are logged in before running the procedure.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Demo middleware that allows unauthenticated users for assessment creation
 * Creates a demo user session automatically
 */
const demoUserMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    // Create/find demo organization and user for unauthenticated access
    let demoOrg = await ctx.db.organization.findFirst({
      where: { name: 'Demo Corporation Ltd' },
    })
    
    if (!demoOrg) {
      demoOrg = await ctx.db.organization.create({
        data: { name: 'Demo Corporation Ltd' },
      })
    }

    let demoUser = await ctx.db.user.findFirst({
      where: { email: 'demo@gov20.com' },
    })

    if (!demoUser) {
      demoUser = await ctx.db.user.create({
        data: {
          email: 'demo@gov20.com',
          name: 'Demo User',
          role: 'COMPLIANCE_LEAD',
          orgId: demoOrg.id,
        },
      })
    }

    // Create demo session
    const demoSession = {
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        orgId: demoUser.orgId,
      },
    }

    return next({
      ctx: {
        session: demoSession,
        db: ctx.db,
      },
    })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

/**
 * Demo procedure that allows unauthenticated access
 * Automatically creates demo user for testing
 **/
export const demoProcedure = t.procedure.use(demoUserMiddleware)

/**
 * Role-based procedures
 */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  // TODO: Implement role checking logic
  return next({ ctx })
})

export const complianceLeadProcedure = protectedProcedure.use(({ ctx, next }) => {
  // TODO: Implement role checking logic
  return next({ ctx })
})
