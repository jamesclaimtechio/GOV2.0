import { NextResponse } from 'next/server'
import { db } from '@/server/db'

/**
 * Health check endpoint for monitoring
 * Verifies database connectivity and core services
 */
export async function GET() {
  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`
    
    // Check environment variables
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      openai: !!process.env.OPENAI_API_KEY,
      auth: !!process.env.NEXTAUTH_SECRET,
    }

    const allHealthy = Object.values(envCheck).every(Boolean)

    return NextResponse.json({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      checks: {
        database: 'connected',
        environment: envCheck,
      },
    }, {
      status: allHealthy ? 200 : 503,
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    }, {
      status: 503,
    })
  }
}
