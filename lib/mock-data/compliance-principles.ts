/**
 * Mock compliance principles and requirements for each regulatory framework
 * Represents the core tiles users will see in their compliance dashboard
 */

export interface CompliancePrinciple {
  id: string
  framework: string
  title: string
  description: string
  status: 'MEETS' | 'PARTIAL' | 'MISSING' | 'UNCLEAR'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  ref: string
  dueDate?: string
  effort: 'Quick' | 'Medium' | 'Complex' | 'Expert'
  owner: 'COMPLIANCE_LEAD' | 'CONTROL_OWNER' | 'ADMIN'
  progress?: number
}

export const GDPR_PRINCIPLES: CompliancePrinciple[] = [
  {
    id: 'gdpr-art-30',
    framework: 'GDPR',
    title: 'Records of Processing Activities',
    description: 'Maintain comprehensive records of all data processing activities under your responsibility',
    status: 'MISSING',
    priority: 'HIGH',
    category: 'Documentation',
    ref: 'Art. 30',
    dueDate: '2024-10-15',
    effort: 'Medium',
    owner: 'COMPLIANCE_LEAD',
    progress: 0,
  },
  {
    id: 'gdpr-art-32',
    framework: 'GDPR',
    title: 'Security of Processing',
    description: 'Implement appropriate technical and organisational measures to ensure security',
    status: 'PARTIAL',
    priority: 'URGENT',
    category: 'Security',
    ref: 'Art. 32',
    dueDate: '2024-09-30',
    effort: 'Complex',
    owner: 'CONTROL_OWNER',
    progress: 45,
  },
  {
    id: 'gdpr-art-33',
    framework: 'GDPR',
    title: 'Breach Notification to Authority',
    description: 'Notify supervisory authority within 72 hours of becoming aware of a breach',
    status: 'MEETS',
    priority: 'HIGH',
    category: 'Incident Response',
    ref: 'Art. 33',
    effort: 'Quick',
    owner: 'COMPLIANCE_LEAD',
    progress: 100,
  },
  {
    id: 'gdpr-art-35',
    framework: 'GDPR',
    title: 'Data Protection Impact Assessment',
    description: 'Conduct DPIA for high-risk processing activities before processing begins',
    status: 'UNCLEAR',
    priority: 'MEDIUM',
    category: 'Risk Assessment',
    ref: 'Art. 35',
    dueDate: '2024-11-01',
    effort: 'Expert',
    owner: 'COMPLIANCE_LEAD',
    progress: 20,
  },
  {
    id: 'gdpr-privacy-policy',
    framework: 'GDPR',
    title: 'Privacy Policy & Transparency',
    description: 'Provide clear, accessible information about data processing to individuals',
    status: 'PARTIAL',
    priority: 'MEDIUM',
    category: 'Transparency',
    ref: 'Art. 12-14',
    dueDate: '2024-10-01',
    effort: 'Medium',
    owner: 'COMPLIANCE_LEAD',
    progress: 60,
  },
]

export const ISO27001_PRINCIPLES: CompliancePrinciple[] = [
  {
    id: 'iso-5-1-1',
    framework: 'ISO27001',
    title: 'Information Security Policy',
    description: 'Define, approve, publish and communicate comprehensive information security policies',
    status: 'PARTIAL',
    priority: 'HIGH',
    category: 'Governance',
    ref: 'A.5.1.1',
    dueDate: '2024-09-25',
    effort: 'Medium',
    owner: 'ADMIN',
    progress: 30,
  },
  {
    id: 'iso-8-1-1',
    framework: 'ISO27001',
    title: 'Asset Inventory',
    description: 'Identify and maintain inventory of all information and information processing assets',
    status: 'MISSING',
    priority: 'HIGH',
    category: 'Asset Management',
    ref: 'A.8.1.1',
    dueDate: '2024-10-10',
    effort: 'Complex',
    owner: 'CONTROL_OWNER',
    progress: 0,
  },
  {
    id: 'iso-12-6-1',
    framework: 'ISO27001',
    title: 'Vulnerability Management',
    description: 'Obtain timely information about technical vulnerabilities and take appropriate action',
    status: 'MEETS',
    priority: 'MEDIUM',
    category: 'Operations Security',
    ref: 'A.12.6.1',
    effort: 'Quick',
    owner: 'CONTROL_OWNER',
    progress: 100,
  },
  {
    id: 'iso-access-control',
    framework: 'ISO27001',
    title: 'Access Control Management',
    description: 'Limit access to information and information processing facilities',
    status: 'PARTIAL',
    priority: 'HIGH',
    category: 'Access Control',
    ref: 'A.9.1.1',
    dueDate: '2024-09-20',
    effort: 'Complex',
    owner: 'CONTROL_OWNER',
    progress: 70,
  },
]

export const NIS2_PRINCIPLES: CompliancePrinciple[] = [
  {
    id: 'nis2-cyber-risk-mgmt',
    framework: 'NIS2',
    title: 'Cybersecurity Risk Management',
    description: 'Establish comprehensive cybersecurity risk management framework',
    status: 'MISSING',
    priority: 'URGENT',
    category: 'Risk Management',
    ref: 'Art. 21',
    dueDate: '2024-09-15',
    effort: 'Expert',
    owner: 'CONTROL_OWNER',
    progress: 0,
  },
  {
    id: 'nis2-incident-handling',
    framework: 'NIS2',
    title: 'Incident Handling & Response',
    description: 'Implement procedures for handling and responding to cybersecurity incidents',
    status: 'PARTIAL',
    priority: 'HIGH',
    category: 'Incident Response',
    ref: 'Art. 23',
    dueDate: '2024-10-05',
    effort: 'Complex',
    owner: 'CONTROL_OWNER',
    progress: 40,
  },
  {
    id: 'nis2-supply-chain',
    framework: 'NIS2',
    title: 'Supply Chain Security',
    description: 'Assess and manage cybersecurity risks in supplier relationships',
    status: 'UNCLEAR',
    priority: 'MEDIUM',
    category: 'Supply Chain',
    ref: 'Art. 21(2)(f)',
    dueDate: '2024-11-15',
    effort: 'Complex',
    owner: 'COMPLIANCE_LEAD',
    progress: 15,
  },
  {
    id: 'nis2-reporting',
    framework: 'NIS2',
    title: 'Incident Reporting to Authorities',
    description: 'Report significant cybersecurity incidents to national CSIRT within 24 hours',
    status: 'MISSING',
    priority: 'URGENT',
    category: 'Reporting',
    ref: 'Art. 23',
    dueDate: '2024-09-10',
    effort: 'Medium',
    owner: 'COMPLIANCE_LEAD',
    progress: 0,
  },
]

export const SOC2_PRINCIPLES: CompliancePrinciple[] = [
  {
    id: 'soc2-security',
    framework: 'SOC2',
    title: 'Security Controls',
    description: 'Implement logical and physical access controls to protect system resources',
    status: 'PARTIAL',
    priority: 'HIGH',
    category: 'Security',
    ref: 'CC6.1',
    dueDate: '2024-10-20',
    effort: 'Complex',
    owner: 'CONTROL_OWNER',
    progress: 55,
  },
  {
    id: 'soc2-availability',
    framework: 'SOC2',
    title: 'System Availability',
    description: 'Ensure system availability for operation and use as committed or agreed',
    status: 'MEETS',
    priority: 'MEDIUM',
    category: 'Availability',
    ref: 'A1.1',
    effort: 'Medium',
    owner: 'CONTROL_OWNER',
    progress: 100,
  },
  {
    id: 'soc2-confidentiality',
    framework: 'SOC2',
    title: 'Information Confidentiality',
    description: 'Protect confidential information during collection, use, retention, and disposal',
    status: 'MISSING',
    priority: 'HIGH',
    category: 'Confidentiality',
    ref: 'C1.1',
    dueDate: '2024-10-30',
    effort: 'Complex',
    owner: 'COMPLIANCE_LEAD',
    progress: 0,
  },
]

// Combine all principles
export const ALL_MOCK_PRINCIPLES = [
  ...GDPR_PRINCIPLES,
  ...ISO27001_PRINCIPLES,
  ...NIS2_PRINCIPLES,
  ...SOC2_PRINCIPLES,
]

// Framework metadata
export const FRAMEWORK_META = {
  GDPR: {
    name: 'General Data Protection Regulation',
    description: 'EU data protection and privacy regulation',
    jurisdiction: 'European Union',
    regulator: 'EDPB & National DPAs',
    color: 'from-blue-500 to-blue-700',
  },
  ISO27001: {
    name: 'ISO/IEC 27001:2022',
    description: 'Information security management systems',
    jurisdiction: 'Global',
    regulator: 'Certification Bodies',
    color: 'from-green-500 to-green-700',
  },
  NIS2: {
    name: 'Network and Information Systems Directive 2',
    description: 'EU cybersecurity measures for critical infrastructure',
    jurisdiction: 'European Union',
    regulator: 'ENISA & National CSIRTs',
    color: 'from-purple-500 to-purple-700',
  },
  SOC2: {
    name: 'SOC 2 Type II',
    description: 'Service organization controls for security and availability',
    jurisdiction: 'United States',
    regulator: 'AICPA',
    color: 'from-orange-500 to-orange-700',
  },
} as const
