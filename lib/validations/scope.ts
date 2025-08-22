import { z } from 'zod'

export const scopeFormSchema = z.object({
  // Company basics
  companySize: z.enum(['startup', 'sme', 'large', 'enterprise'], {
    required_error: 'Please select your company size',
  }),
  
  // Business context
  sector: z.array(z.string()).min(1, 'Please select at least one sector'),
  
  // Data handling
  dataTypes: z.array(z.string()).min(1, 'Please select the types of data you handle'),
  
  // Geographic scope
  systemLocations: z.array(z.string()).min(1, 'Please select where your systems are located'),
  
  // Additional context
  hasDataProcessors: z.boolean().default(false),
  isPublicSector: z.boolean().default(false),
  handlesSpecialCategories: z.boolean().default(false),
  
  // Optional details
  employeeCount: z.number().min(1).optional(),
  annualRevenue: z.enum(['under_1m', '1m_10m', '10m_50m', '50m_plus']).optional(),
  dataSubjectCount: z.enum(['under_1k', '1k_10k', '10k_100k', '100k_plus']).optional(),
})

export type ScopeFormData = z.infer<typeof scopeFormSchema>

// Options for form dropdowns/selects
export const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'sme', label: 'Small/Medium Enterprise (11-249 employees)' },
  { value: 'large', label: 'Large Enterprise (250-999 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
] as const

export const SECTORS = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'financial', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare & Life Sciences' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'transport', label: 'Transport & Logistics' },
  { value: 'banking', label: 'Banking & Investment' },
  { value: 'payment_services', label: 'Payment Services' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'consulting', label: 'Consulting & Professional Services' },
  { value: 'other', label: 'Other' },
] as const

export const DATA_TYPES = [
  { value: 'personal_data', label: 'Personal Data (names, emails, IDs)' },
  { value: 'customer_data', label: 'Customer Information' },
  { value: 'employee_data', label: 'Employee Records' },
  { value: 'financial_data', label: 'Financial Information' },
  { value: 'health_data', label: 'Health & Medical Data' },
  { value: 'biometric_data', label: 'Biometric Data' },
  { value: 'location_data', label: 'Location & Tracking Data' },
  { value: 'sensitive_data', label: 'Other Sensitive Data' },
  { value: 'public_data', label: 'Public Information Only' },
  { value: 'internal_data', label: 'Internal Business Data' },
  { value: 'third_party_data', label: 'Third-party Data' },
] as const

export const JURISDICTIONS = [
  { value: 'UK', label: 'United Kingdom' },
  { value: 'EU', label: 'European Union' },
  { value: 'US', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Global', label: 'Multiple Regions' },
] as const
