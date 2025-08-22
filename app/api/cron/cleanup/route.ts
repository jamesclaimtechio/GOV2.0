import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'

/**
 * Cleanup cron job for Vercel
 * Runs daily at 2 AM UTC to clean up expired data
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Clean up old audit logs (keep last 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const deletedLogs = await db.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: ninetyDaysAgo,
        },
      },
    })

    // Clean up draft assessments older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const deletedDrafts = await db.assessment.deleteMany({
      where: {
        status: 'DRAFT',
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    console.log(`Cleanup completed: ${deletedLogs.count} audit logs, ${deletedDrafts.count} draft assessments deleted`)
    
    return NextResponse.json({
      success: true,
      deletedAuditLogs: deletedLogs.count,
      deletedDraftAssessments: deletedDrafts.count,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Cleanup job failed:', error)
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
