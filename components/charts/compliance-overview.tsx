'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, Clock, XCircle } from 'lucide-react'

interface ComplianceMetrics {
  framework: string
  totalRequirements: number
  meets: number
  partial: number
  missing: number
  unclear: number
  overallScore: number
}

interface ComplianceOverviewProps {
  metrics: ComplianceMetrics[]
  className?: string
}

export function ComplianceOverview({ metrics, className }: ComplianceOverviewProps) {
  const getFrameworkGradient = (framework: string) => {
    const gradients = {
      'GDPR': 'from-blue-500 to-blue-700',
      'ISO27001': 'from-green-500 to-green-700', 
      'NIS2': 'from-purple-500 to-purple-700',
      'SOC2': 'from-orange-500 to-orange-700',
    }
    return gradients[framework as keyof typeof gradients] || 'from-slate-500 to-slate-600'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'meets':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'unclear':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'meets':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'partial':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'missing':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      case 'unclear':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400'
    }
  }

  return (
    <div className={className}>
      <div className="grid gap-6">
        {metrics.map((metric) => (
          <Card key={metric.framework} className="bg-slate-800/50 border border-slate-700 rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getFrameworkGradient(metric.framework)} text-white`}>
                    {metric.framework}
                  </span>
                  <CardTitle className="text-white">{metric.framework} Compliance</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{metric.overallScore}%</div>
                  <div className="text-xs text-slate-400">Overall Score</div>
                </div>
              </div>
              <CardDescription className="text-slate-400">
                {metric.totalRequirements} total requirements analyzed
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Compliance Progress</span>
                  <span>{metric.overallScore}%</span>
                </div>
                <Progress value={metric.overallScore} className="h-3" />
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 rounded-lg border ${getStatusColor('meets')}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon('meets')}
                    <span className="text-sm font-medium">Meets</span>
                  </div>
                  <div className="text-xl font-bold">{metric.meets}</div>
                </div>

                <div className={`p-3 rounded-lg border ${getStatusColor('partial')}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon('partial')}
                    <span className="text-sm font-medium">Partial</span>
                  </div>
                  <div className="text-xl font-bold">{metric.partial}</div>
                </div>

                <div className={`p-3 rounded-lg border ${getStatusColor('missing')}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon('missing')}
                    <span className="text-sm font-medium">Missing</span>
                  </div>
                  <div className="text-xl font-bold">{metric.missing}</div>
                </div>

                <div className={`p-3 rounded-lg border ${getStatusColor('unclear')}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon('unclear')}
                    <span className="text-sm font-medium">Unclear</span>
                  </div>
                  <div className="text-xl font-bold">{metric.unclear}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
