import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, FileText, CheckCircle2, AlertTriangle, Clock, Shield, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { ComplianceTiles } from '@/components/dashboard/compliance-tiles'
import { ALL_MOCK_PRINCIPLES } from '@/lib/mock-data/compliance-principles'

export default function DashboardPage() {
  // Calculate metrics from mock principles
  const totalPrinciples = ALL_MOCK_PRINCIPLES.length
  const compliantCount = ALL_MOCK_PRINCIPLES.filter(p => p.status === 'MEETS').length
  const partialCount = ALL_MOCK_PRINCIPLES.filter(p => p.status === 'PARTIAL').length
  const missingCount = ALL_MOCK_PRINCIPLES.filter(p => p.status === 'MISSING').length
  const urgentCount = ALL_MOCK_PRINCIPLES.filter(p => p.priority === 'URGENT').length
  
  const overallScore = Math.round(((compliantCount * 100) + (partialCount * 50)) / totalPrinciples)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Compliance Dashboard
            </h1>
            <p className="text-slate-300 text-lg">
              Monitor your compliance status across all frameworks
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/assessment/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </Link>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{overallScore}%</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{compliantCount}</div>
              <p className="text-xs text-slate-500">Requirements met</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{partialCount}</div>
              <p className="text-xs text-slate-500">Partial implementation</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Action Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{missingCount}</div>
              <p className="text-xs text-slate-500">Missing controls</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Urgent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{urgentCount}</div>
              <p className="text-xs text-slate-500">Need immediate action</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
              All Frameworks ({totalPrinciples})
            </TabsTrigger>
            <TabsTrigger value="gdpr" className="data-[state=active]:bg-slate-700">
              GDPR ({ALL_MOCK_PRINCIPLES.filter(p => p.framework === 'GDPR').length})
            </TabsTrigger>
            <TabsTrigger value="iso27001" className="data-[state=active]:bg-slate-700">
              ISO 27001 ({ALL_MOCK_PRINCIPLES.filter(p => p.framework === 'ISO27001').length})
            </TabsTrigger>
            <TabsTrigger value="nis2" className="data-[state=active]:bg-slate-700">
              NIS2 ({ALL_MOCK_PRINCIPLES.filter(p => p.framework === 'NIS2').length})
            </TabsTrigger>
            <TabsTrigger value="soc2" className="data-[state=active]:bg-slate-700">
              SOC 2 ({ALL_MOCK_PRINCIPLES.filter(p => p.framework === 'SOC2').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <ComplianceTiles />
          </TabsContent>

          <TabsContent value="gdpr" className="space-y-6">
            <ComplianceTiles selectedFrameworks={['GDPR']} />
          </TabsContent>

          <TabsContent value="iso27001" className="space-y-6">
            <ComplianceTiles selectedFrameworks={['ISO27001']} />
          </TabsContent>

          <TabsContent value="nis2" className="space-y-6">
            <ComplianceTiles selectedFrameworks={['NIS2']} />
          </TabsContent>

          <TabsContent value="soc2" className="space-y-6">
            <ComplianceTiles selectedFrameworks={['SOC2']} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
