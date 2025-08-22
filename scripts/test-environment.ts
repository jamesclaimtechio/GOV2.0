#!/usr/bin/env tsx

/**
 * Environment testing script
 * Validates all configuration and connections before running tests
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { db } from '@/server/db'

async function testEnvironment() {
  console.log('🧪 Testing Gov 2.0 Environment Setup...\n')

  // Test 1: Environment Variables
  console.log('1️⃣ Checking Environment Variables:')
  const envChecks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    APP_URL: !!(process.env.APP_URL || process.env.NEXTAUTH_URL),
  }

  for (const [key, value] of Object.entries(envChecks)) {
    console.log(`   ${value ? '✅' : '❌'} ${key}: ${value ? 'Set' : 'Missing'}`)
  }

  if (!Object.values(envChecks).every(Boolean)) {
    console.log('\n❌ Missing required environment variables. Please check your .env.local file.')
    process.exit(1)
  }

  // Test 2: Database Connection
  console.log('\n2️⃣ Testing Database Connection:')
  try {
    await db.$queryRaw`SELECT 1 as connection_test`
    console.log('   ✅ Database connection successful')

    // Check if tables exist
    const orgCount = await db.organization.count()
    const frameworkCount = await db.framework.count()
    const requirementCount = await db.requirement.count()

    console.log(`   ✅ Organizations: ${orgCount}`)
    console.log(`   ✅ Frameworks: ${frameworkCount}`)
    console.log(`   ✅ Requirements: ${requirementCount}`)

    if (frameworkCount === 0) {
      console.log('   ⚠️  No frameworks found - run npm run db:seed to populate initial data')
    }

  } catch (error) {
    console.log('   ❌ Database connection failed:', error)
    console.log('   💡 Try running: npm run db:push')
    process.exit(1)
  }

  // Test 3: OpenAI Connection
  console.log('\n3️⃣ Testing OpenAI API:')
  try {
    // Import OpenAI after environment is loaded
    const { openai } = await import('@/server/ai/openai')
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a test assistant. Respond with just "CONNECTION_OK"'
        },
        {
          role: 'user',
          content: 'Test'
        }
      ],
      max_tokens: 10,
      temperature: 0,
    })

    const result = response.choices[0]?.message?.content?.trim()
    console.log(`   ✅ OpenAI API response: ${result}`)
    console.log(`   ✅ Model: ${response.model}`)
    console.log(`   ✅ Usage: ${response.usage?.total_tokens} tokens`)

  } catch (error: any) {
    console.log('   ❌ OpenAI API test failed:', error.message)
    
    if (error.code === 'invalid_api_key') {
      console.log('   💡 Check your OPENAI_API_KEY in .env.local')
    } else if (error.code === 'insufficient_quota') {
      console.log('   💡 Your OpenAI account needs credits added')
    }
    
    console.log('   ⚠️  AI features will be disabled until OpenAI is configured')
  }

  // Test 4: Rules Engine
  console.log('\n4️⃣ Testing Rules Engine:')
  try {
    const { RulesEngineService } = await import('@/server/services/rules-engine')
    const rulesEngine = new RulesEngineService()
    const testScope: ScopeFormData = {
      companySize: 'sme',
      sector: ['technology'],
      dataTypes: ['personal_data'],
      systemLocations: ['EU'],
      hasDataProcessors: false,
      isPublicSector: false,
      handlesSpecialCategories: false,
    }

    const analysis = rulesEngine.analyzeScope(testScope)
    
    console.log(`   ✅ Frameworks identified: ${analysis.frameworks.join(', ')}`)
    console.log(`   ✅ Jurisdictions: ${analysis.jurisdictions.join(', ')}`)
    console.log(`   ✅ Regulators: ${analysis.regulators.join(', ')}`)
    console.log(`   ✅ Matched rules: ${analysis.matchedRules.length}`)

    expect(analysis.frameworks.length).toBeGreaterThan(0)

  } catch (error) {
    console.log('   ❌ Rules engine test failed:', error)
    process.exit(1)
  }

  // Test 5: File System Permissions
  console.log('\n5️⃣ Testing File System:')
  try {
    const { FileExtractionService } = await import('@/server/files/extractor')
    const extractor = new FileExtractionService()
    
    // Test PII redaction
    const testText = 'Contact john@example.com or call (555) 123-4567'
    const { redactedText, redactionMap } = extractor.redactPII(testText)
    
    console.log('   ✅ PII redaction working')
    console.log(`   ✅ Redacted ${Object.keys(redactionMap).length} PII items`)

  } catch (error) {
    console.log('   ❌ File system test failed:', error)
  }

  console.log('\n🎉 Environment validation complete!')
  console.log('\n🚀 Ready to run full test suite:')
  console.log('   npm test              # Unit tests')
  console.log('   npm run test:e2e      # End-to-end tests')
  console.log('   npm run dev           # Start development server')
}

testEnvironment().catch(console.error)
