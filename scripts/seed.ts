import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: {
      id: 'demo-org',
      name: 'Demo Corporation Ltd',
    },
  })

  // Create demo admin user
  const hashedPassword = await bcrypt.hash('demo123!', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.gov20.com' },
    update: {},
    create: {
      email: 'admin@demo.gov20.com',
      passwordHash: hashedPassword,
      name: 'Demo Admin',
      role: 'ADMIN',
      orgId: org.id,
    },
  })

  // Create compliance lead user
  const complianceUser = await prisma.user.upsert({
    where: { email: 'compliance@demo.gov20.com' },
    update: {},
    create: {
      email: 'compliance@demo.gov20.com',
      passwordHash: hashedPassword,
      name: 'Sarah Johnson',
      role: 'COMPLIANCE_LEAD',
      orgId: org.id,
    },
  })

  // Seed frameworks
  const gdprFramework = await prisma.framework.upsert({
    where: { code: 'GDPR' },
    update: {},
    create: {
      code: 'GDPR',
      name: 'General Data Protection Regulation',
      version: '2016/679',
      description: 'EU regulation on data protection and privacy',
    },
  })

  const iso27001Framework = await prisma.framework.upsert({
    where: { code: 'ISO27001' },
    update: {},
    create: {
      code: 'ISO27001',
      name: 'ISO/IEC 27001:2022',
      version: '2022',
      description: 'Information security management systems standard',
    },
  })

  const nis2Framework = await prisma.framework.upsert({
    where: { code: 'NIS2' },
    update: {},
    create: {
      code: 'NIS2',
      name: 'Network and Information Systems Directive 2',
      version: '2022/2555',
      description: 'EU directive on cybersecurity measures',
    },
  })

  // Seed sample GDPR requirements
  const gdprRequirements = [
    {
      ref: 'Art. 30',
      text: 'Records of processing activities - Controllers and processors must maintain records of data processing activities under their responsibility',
      tags: ['documentation', 'accountability'],
      category: 'Documentation'
    },
    {
      ref: 'Art. 32',
      text: 'Security of processing - Implement appropriate technical and organisational measures to ensure security appropriate to the risk',
      tags: ['security', 'technical_measures'],
      category: 'Security'
    },
    {
      ref: 'Art. 33',
      text: 'Notification of data breach to supervisory authority - Notify within 72 hours unless unlikely to result in risk',
      tags: ['breach_notification', 'incident_response'],
      category: 'Incident Management'
    },
    {
      ref: 'Art. 34',
      text: 'Communication of data breach to data subject - Notify individuals when breach likely to result in high risk',
      tags: ['breach_notification', 'data_subject_rights'],
      category: 'Incident Management'
    },
    {
      ref: 'Art. 35',
      text: 'Data protection impact assessment - Conduct DPIA for high-risk processing activities',
      tags: ['risk_assessment', 'privacy_by_design'],
      category: 'Risk Management'
    }
  ]

  for (const req of gdprRequirements) {
    await prisma.requirement.upsert({
      where: {
        frameworkId_ref: {
          frameworkId: gdprFramework.id,
          ref: req.ref,
        },
      },
      update: {},
      create: {
        frameworkId: gdprFramework.id,
        ...req,
      },
    })
  }

  // Seed sample ISO 27001 requirements
  const iso27001Requirements = [
    {
      ref: 'A.5.1.1',
      text: 'Information security policy - A set of policies for information security shall be defined, approved by management, published and communicated',
      tags: ['policy', 'governance'],
      category: 'Information Security Policies'
    },
    {
      ref: 'A.8.1.1',
      text: 'Inventory of assets - Assets associated with information and information processing facilities shall be identified',
      tags: ['asset_management', 'inventory'],
      category: 'Asset Management'
    },
    {
      ref: 'A.12.6.1',
      text: 'Management of technical vulnerabilities - Information about technical vulnerabilities shall be obtained in a timely fashion',
      tags: ['vulnerability_management', 'security'],
      category: 'Operations Security'
    }
  ]

  for (const req of iso27001Requirements) {
    await prisma.requirement.upsert({
      where: {
        frameworkId_ref: {
          frameworkId: iso27001Framework.id,
          ref: req.ref,
        },
      },
      update: {},
      create: {
        frameworkId: iso27001Framework.id,
        ...req,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Demo admin: admin@demo.gov20.com / demo123!`)
  console.log(`👤 Demo compliance lead: compliance@demo.gov20.com / demo123!`)
  console.log(`🏢 Organization: ${org.name}`)
  console.log(`📋 Frameworks: ${gdprFramework.name}, ${iso27001Framework.name}, ${nis2Framework.name}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
