import { describe, it, expect } from 'vitest'

/**
 * Environment and setup validation tests
 * Verifies all required configuration is present
 */

describe('Environment Configuration Tests', () => {
  describe('Required Environment Variables', () => {
    it('should have DATABASE_URL configured', () => {
      const dbUrl = process.env.DATABASE_URL
      expect(dbUrl).toBeDefined()
      expect(dbUrl).not.toBe('')
      
      if (dbUrl) {
        expect(dbUrl).toMatch(/^postgresql:\/\//)
        console.log('✅ DATABASE_URL configured')
      }
    })

    it('should have OPENAI_API_KEY configured', () => {
      const apiKey = process.env.OPENAI_API_KEY
      expect(apiKey).toBeDefined()
      expect(apiKey).not.toBe('')
      
      if (apiKey) {
        expect(apiKey).toMatch(/^sk-/)
        console.log('✅ OPENAI_API_KEY configured')
      }
    })

    it('should have NEXTAUTH_SECRET configured', () => {
      const secret = process.env.NEXTAUTH_SECRET
      expect(secret).toBeDefined()
      expect(secret).not.toBe('')
      
      if (secret) {
        expect(secret.length).toBeGreaterThanOrEqual(32)
        console.log('✅ NEXTAUTH_SECRET configured')
      }
    })

    it('should have APP_URL configured', () => {
      const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL
      expect(appUrl).toBeDefined()
      expect(appUrl).not.toBe('')
      console.log('✅ APP_URL configured')
    })
  })

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const { db } = await import('@/server/db')
      
      try {
        await db.$queryRaw`SELECT 1 as test`
        console.log('✅ Database connection successful')
        expect(true).toBe(true)
      } catch (error) {
        console.error('❌ Database connection failed:', error)
        expect.fail('Database connection failed - check your DATABASE_URL')
      }
    })

    it('should have required tables created', async () => {
      const { db } = await import('@/server/db')
      
      try {
        // Check if core tables exist
        const orgCount = await db.organization.count()
        const frameworkCount = await db.framework.count()
        
        expect(orgCount).toBeGreaterThanOrEqual(0)
        expect(frameworkCount).toBeGreaterThanOrEqual(0)
        console.log('✅ Database schema validated')
        
      } catch (error) {
        console.error('❌ Database schema issue:', error)
        expect.fail('Database schema not found - run npm run db:push')
      }
    })
  })

  describe('OpenAI Integration', () => {
    it('should have valid OpenAI configuration', async () => {
      const { openai, DEFAULT_CONFIG } = await import('@/server/ai/openai')
      
      expect(DEFAULT_CONFIG.model).toBeDefined()
      expect(DEFAULT_CONFIG.temperature).toBeLessThanOrEqual(0.2)
      expect(openai).toBeDefined()
      console.log('✅ OpenAI client configured')
    })

    it('should be able to make OpenAI API calls', async () => {
      const { openai } = await import('@/server/ai/openai')
      
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Test connection - respond with just "OK"' }],
          max_tokens: 5,
          temperature: 0,
        })
        
        expect(response.choices[0]?.message?.content).toBeDefined()
        console.log('✅ OpenAI API connection successful')
        
      } catch (error) {
        console.error('❌ OpenAI API test failed:', error)
        expect.fail('OpenAI API connection failed - check your API key and quota')
      }
    })
  })
})
