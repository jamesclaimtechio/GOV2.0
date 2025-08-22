import { beforeAll, afterAll, beforeEach } from 'vitest'
import { db } from '@/server/db'

// Test database setup
beforeAll(async () => {
  // Set test database URL
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/gov2_test'
  }
})

// Clean up after tests
afterAll(async () => {
  await db.$disconnect()
})

// Reset database state between tests
beforeEach(async () => {
  // Clean up test data
  await db.auditLog.deleteMany()
  await db.task.deleteMany()
  await db.conflictRequirement.deleteMany()
  await db.conflict.deleteMany()
  await db.finding.deleteMany()
  await db.complianceMap.deleteMany()
  await db.document.deleteMany()
  await db.scopeResponse.deleteMany()
  await db.assessment.deleteMany()
  await db.user.deleteMany()
  await db.organization.deleteMany()
})
