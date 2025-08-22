import { test, expect } from '@playwright/test'

/**
 * End-to-end test for core scoping flow as required by setup.mdc:
 * Scoping → Regulators → Upload → Compare → Tasks
 */

test.describe('Scoping Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/')
  })

  test('complete scoping wizard flow', async ({ page }) => {
    // 1. Start from landing page
    await expect(page.getByRole('heading', { name: /AI-Powered Compliance/ })).toBeVisible()
    
    // Click start assessment
    await page.getByRole('link', { name: /Start Free Assessment/ }).click()
    
    // 2. Scoping wizard - Step 1: Company Profile
    await expect(page.getByRole('heading', { name: /Company Profile/ })).toBeVisible()
    
    // Select company size
    await page.getByRole('radio', { name: /Small\/Medium Enterprise/ }).click()
    
    // Set public sector and data processor flags
    await page.getByRole('checkbox', { name: /Public sector organization/ }).uncheck()
    await page.getByRole('checkbox', { name: /Uses third-party data processors/ }).check()
    
    await page.getByRole('button', { name: /Continue/ }).click()

    // 3. Step 2: Business Context
    await expect(page.getByRole('heading', { name: /Business Context/ })).toBeVisible()
    
    // Select sectors
    await page.getByRole('checkbox', { name: /Technology & Software/ }).check()
    await page.getByRole('checkbox', { name: /Financial Services/ }).check()
    
    await page.getByRole('button', { name: /Continue/ }).click()

    // 4. Step 3: Data Handling  
    await expect(page.getByRole('heading', { name: /Data Handling/ })).toBeVisible()
    
    // Select data types
    await page.getByRole('checkbox', { name: /Personal Data/ }).check()
    await page.getByRole('checkbox', { name: /Financial Information/ }).check()
    
    // Special categories
    await page.getByRole('checkbox', { name: /Special category data/ }).check()
    
    await page.getByRole('button', { name: /Continue/ }).click()

    // 5. Step 4: Geographic Scope
    await expect(page.getByRole('heading', { name: /Geographic Scope/ })).toBeVisible()
    
    // Select jurisdictions
    await page.getByRole('checkbox', { name: /European Union/ }).check()
    await page.getByRole('checkbox', { name: /United Kingdom/ }).check()
    
    // Submit assessment
    await page.getByRole('button', { name: /Analyze Compliance Requirements/ }).click()

    // 6. Results page should show analysis
    await expect(page.getByRole('heading', { name: /Analysis Complete/ })).toBeVisible()
    
    // Should show derived jurisdictions
    await expect(page.getByText('European Union')).toBeVisible()
    await expect(page.getByText('United Kingdom')).toBeVisible()
    
    // Should show applicable frameworks
    await expect(page.getByText('GDPR')).toBeVisible()
    
    // Should have continue button
    await expect(page.getByRole('button', { name: /Continue to Detailed Analysis/ })).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Start scoping wizard
    await page.goto('/assessment/new')
    await page.getByRole('button', { name: /Start Scoping Assessment/ }).click()
    
    // Try to continue without selecting company size
    await page.getByRole('button', { name: /Continue/ }).click()
    
    // Should show validation error
    await expect(page.getByText(/Please select your company size/)).toBeVisible()
    
    // Select company size and continue
    await page.getByRole('radio', { name: /Startup/ }).click()
    await page.getByRole('button', { name: /Continue/ }).click()
    
    // Step 2: Try to continue without selecting sectors
    await page.getByRole('button', { name: /Continue/ }).click()
    
    // Should show validation error
    await expect(page.getByText(/Please select at least one sector/)).toBeVisible()
  })

  test('should handle navigation between steps', async ({ page }) => {
    await page.goto('/assessment/new')
    await page.getByRole('button', { name: /Start Scoping Assessment/ }).click()
    
    // Fill step 1
    await page.getByRole('radio', { name: /Large Enterprise/ }).click()
    await page.getByRole('button', { name: /Continue/ }).click()
    
    // Fill step 2  
    await page.getByRole('checkbox', { name: /Healthcare/ }).check()
    await page.getByRole('button', { name: /Continue/ }).click()
    
    // Go back to step 2
    await page.getByRole('button', { name: /Previous/ }).click()
    await expect(page.getByRole('heading', { name: /Business Context/ })).toBeVisible()
    
    // Healthcare should still be selected
    await expect(page.getByRole('checkbox', { name: /Healthcare/ })).toBeChecked()
    
    // Go back to step 1
    await page.getByRole('button', { name: /Previous/ }).click()
    await expect(page.getByRole('heading', { name: /Company Profile/ })).toBeVisible()
    
    // Large Enterprise should still be selected
    await expect(page.getByRole('radio', { name: /Large Enterprise/ })).toBeChecked()
  })

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/assessment/new')
    await page.getByRole('button', { name: /Start Scoping Assessment/ }).click()
    
    // Check initial progress
    await expect(page.getByText('Step 1 of 4')).toBeVisible()
    await expect(page.getByText('25% Complete')).toBeVisible()
    
    // Fill and continue
    await page.getByRole('radio', { name: /Startup/ }).click()
    await page.getByRole('button', { name: /Continue/ }).click()
    
    // Check updated progress
    await expect(page.getByText('Step 2 of 4')).toBeVisible()
    await expect(page.getByText('50% Complete')).toBeVisible()
  })
})
