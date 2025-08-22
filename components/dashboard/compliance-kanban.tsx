'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, Clock, XCircle, AlertTriangle, Calendar, 
  User, Target, ExternalLink, MoreHorizontal, Shield
} from 'lucide-react'
import { 
  ALL_MOCK_PRINCIPLES, 
  type CompliancePrinciple 
} from '@/lib/mock-data/compliance-principles'
import { getFrameworkColors, getPriorityColors, getRoleColors } from '@/lib/design-tokens'

interface ComplianceKanbanProps {
  className?: string
  selectedFrameworks?: string[]
  onStatusChange?: (principleId: string, newStatus: string) => void
}

const STATUS_COLUMNS = [
  { 
    status: 'MEETS', 
    title: 'Compliant', 
    description: 'Requirements fully met',
    icon: CheckCircle2, 
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  { 
    status: 'PARTIAL', 
    title: 'In Progress', 
    description: 'Partially implemented',
    icon: Clock, 
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  { 
    status: 'MISSING', 
    title: 'Action Needed', 
    description: 'Not implemented',
    icon: XCircle, 
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  { 
    status: 'UNCLEAR', 
    title: 'Under Review', 
    description: 'Needs clarification',
    icon: AlertTriangle, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
]

export function ComplianceKanban({ className, selectedFrameworks, onStatusChange }: ComplianceKanbanProps) {
  const [draggedPrinciple, setDraggedPrinciple] = useState<string | null>(null)

  // Filter principles based on selected frameworks
  const principles = selectedFrameworks 
    ? ALL_MOCK_PRINCIPLES.filter(p => selectedFrameworks.includes(p.framework))
    : ALL_MOCK_PRINCIPLES

  const getPriorityColor = (priority: string) => {
    const colors = getPriorityColors(priority)
    return colors.text
  }

  const getOwnerColor = (role: string) => {
    const colors = getRoleColors(role)
    return `${colors.background} ${colors.border} ${colors.text}`
  }

  const getFrameworkGradient = (framework: string) => {
    const colors = getFrameworkColors(framework)
    return colors.gradient
  }

  const handleDragStart = (principleId: string) => {
    setDraggedPrinciple(principleId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedPrinciple && onStatusChange) {
      onStatusChange(draggedPrinciple, newStatus)
      setDraggedPrinciple(null)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString))
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {STATUS_COLUMNS.map((column) => {
          const columnPrinciples = principles.filter(principle => principle.status === column.status)
          const Icon = column.icon

          return (
            <div
              key={column.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
              className="space-y-4"
            >
              {/* Column Header */}
              <Card className={`${column.bgColor} ${column.borderColor} border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${column.color}`} />
                      <div>
                        <CardTitle className="text-white text-lg">{column.title}</CardTitle>
                        <p className="text-xs text-slate-400">{column.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm font-semibold">
                      {columnPrinciples.length}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Compliance Principle Cards */}
              <div className="space-y-3 min-h-[600px]">
                {columnPrinciples.map((principle) => (
                  <Card
                    key={principle.id}
                    draggable
                    onDragStart={() => handleDragStart(principle.id)}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg cursor-move hover:border-slate-600 transition-all duration-200 hover:transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getFrameworkGradient(principle.framework)} text-white`}>
                              {principle.framework}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {principle.ref}
                            </span>
                          </div>
                          <CardTitle className="text-sm text-white leading-tight mb-2">
                            {principle.title}
                          </CardTitle>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {principle.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="w-6 h-6 opacity-60 hover:opacity-100">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Progress Bar (for PARTIAL status) */}
                      {principle.progress !== undefined && principle.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Implementation Progress</span>
                            <span>{principle.progress}%</span>
                          </div>
                          <Progress value={principle.progress} className="h-2" />
                        </div>
                      )}

                      {/* Priority & Category */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={`text-xs ${getPriorityColor(principle.priority)}`}
                          variant={principle.priority === 'URGENT' ? 'destructive' : 'secondary'}
                        >
                          {principle.priority}
                        </Badge>
                        <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                          {principle.category}
                        </span>
                      </div>

                      {/* Owner & Effort */}
                      <div className="flex items-center justify-between text-xs">
                        <div className={`px-2 py-1 rounded border ${getOwnerColor(principle.owner)}`}>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{principle.owner.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <span className="text-slate-400">
                          {principle.effort} effort
                        </span>
                      </div>

                      {/* Due Date */}
                      {principle.dueDate && (
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>Due {formatDate(principle.dueDate)}</span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-slate-400 hover:text-white">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-slate-400 hover:text-white">
                          <Target className="w-3 h-3 mr-1" />
                          Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Empty State */}
                {columnPrinciples.length === 0 && (
                  <Card className="bg-slate-900/30 border border-slate-600 border-dashed rounded-lg">
                    <CardContent className="py-12 text-center">
                      <Icon className={`w-12 h-12 ${column.color} mx-auto mb-3 opacity-40`} />
                      <p className="text-slate-500 text-sm">No {column.title.toLowerCase()} requirements</p>
                      <p className="text-slate-600 text-xs mt-1">Drag items here to update status</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Kanban Legend */}
      <Card className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 mt-6">
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">Drag tiles between columns to update compliance status</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Click "Task" to create action items</span>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">View details for implementation guidance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
