'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, Clock, XCircle, AlertTriangle, Calendar, 
  User, ExternalLink, ChevronRight, Target, Shield, FileText 
} from 'lucide-react'
import { 
  ALL_MOCK_PRINCIPLES, 
  FRAMEWORK_META, 
  type CompliancePrinciple 
} from '@/lib/mock-data/compliance-principles'
import { getFrameworkColors, getStatusColors, getPriorityColors } from '@/lib/design-tokens'

interface ComplianceTilesProps {
  className?: string
  selectedFrameworks?: string[]
}

export function ComplianceTiles({ className, selectedFrameworks }: ComplianceTilesProps) {
  // Filter principles based on selected frameworks
  const principles = selectedFrameworks 
    ? ALL_MOCK_PRINCIPLES.filter(p => selectedFrameworks.includes(p.framework))
    : ALL_MOCK_PRINCIPLES

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MEETS':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'PARTIAL':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'MISSING':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'UNCLEAR':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'MEETS':
        return 'success'
      case 'PARTIAL':
        return 'warning'
      case 'MISSING':
        return 'error'
      case 'UNCLEAR':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'error'
      case 'HIGH':
        return 'warning'
      case 'MEDIUM':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Quick':
        return 'text-green-400'
      case 'Medium':
        return 'text-yellow-400'
      case 'Complex':
        return 'text-orange-400'
      case 'Expert':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  // Group by framework for better organization
  const principlesByFramework = principles.reduce((acc, principle) => {
    if (!acc[principle.framework]) {
      acc[principle.framework] = []
    }
    acc[principle.framework].push(principle)
    return acc
  }, {} as Record<string, CompliancePrinciple[]>)

  return (
    <div className={className}>
      <div className="space-y-8">
        {Object.entries(principlesByFramework).map(([framework, frameworkPrinciples]) => {
          const frameworkInfo = FRAMEWORK_META[framework as keyof typeof FRAMEWORK_META]
          const frameworkColors = getFrameworkColors(framework)
          
          return (
            <div key={framework} className="space-y-4">
              {/* Framework Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${frameworkColors.gradient} flex items-center justify-center`}>
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{frameworkInfo?.name || framework}</h2>
                    <p className="text-sm text-slate-400">{frameworkInfo?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${frameworkColors.gradient} text-white`}>
                    {framework}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{frameworkPrinciples.length} principles</p>
                </div>
              </div>

              {/* Principles Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {frameworkPrinciples.map((principle) => (
                  <Card 
                    key={principle.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-200 hover:transform hover:scale-[1.02]"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(principle.status)}
                            <span className="text-xs text-slate-400 font-mono">
                              {principle.ref}
                            </span>
                          </div>
                          <CardTitle className="text-white text-base leading-tight">
                            {principle.title}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant={getStatusBadgeVariant(principle.status) as any}
                          className="text-xs"
                        >
                          {principle.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <CardDescription className="text-slate-300 text-sm leading-relaxed">
                        {principle.description}
                      </CardDescription>

                      {/* Progress Bar (if partial) */}
                      {principle.progress !== undefined && principle.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Progress</span>
                            <span>{principle.progress}%</span>
                          </div>
                          <Progress value={principle.progress} className="h-2" />
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityBadgeVariant(principle.priority) as any} className="text-xs">
                            {principle.priority}
                          </Badge>
                          <span className={`${getEffortColor(principle.effort)}`}>
                            {principle.effort}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <User className="w-3 h-3" />
                          <span>{principle.owner.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {/* Due Date */}
                      {principle.dueDate && (
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>Due {principle.dueDate}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                          <FileText className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                          <Target className="w-3 h-3 mr-1" />
                          Create Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-slate-900/50 border border-slate-600 rounded-xl p-6 mt-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg">Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {principles.filter(p => p.status === 'MEETS').length}
              </div>
              <div className="text-xs text-slate-400">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {principles.filter(p => p.status === 'PARTIAL').length}
              </div>
              <div className="text-xs text-slate-400">Partial</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {principles.filter(p => p.status === 'MISSING').length}
              </div>
              <div className="text-xs text-slate-400">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {principles.filter(p => p.status === 'UNCLEAR').length}
              </div>
              <div className="text-xs text-slate-400">Unclear</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
