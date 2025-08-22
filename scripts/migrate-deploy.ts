#!/usr/bin/env tsx

/**
 * Production deployment migration script
 * Runs database migrations and seeding for production deployments
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function deployMigrations() {
  try {
    console.log('🔄 Running production migrations...')
    
    // Generate Prisma client
    console.log('📦 Generating Prisma client...')
    await execAsync('npx prisma generate')
    
    // Deploy migrations
    console.log('🗄️ Deploying database migrations...')
    await execAsync('npx prisma migrate deploy')
    
    // Seed initial data (frameworks, requirements)
    console.log('🌱 Seeding initial data...')
    await execAsync('npx tsx scripts/seed.ts')
    
    console.log('✅ Production deployment complete!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  deployMigrations()
}
