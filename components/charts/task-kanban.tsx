'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Circle, Clock, AlertTriangle, CheckCircle2, 
  User, Calendar, ExternalLink, MoreHorizontal 
} from 'lucide-react'
import { type TaskWithRequirement } from '@/lib/types'

interface TaskKanbanProps {
  tasks: TaskWithRequirement[]
  onTaskUpdate: (taskId: string, status: string) => void
  className?: string
}

const TASK_COLUMNS = [
  { status: 'OPEN', title: 'Open', icon: Circle, color: 'text-slate-400' },
  { status: 'IN_PROGRESS', title: 'In Progress', icon: Clock, color: 'text-blue-400' },
  { status: 'BLOCKED', title: 'Blocked', icon: AlertTriangle, color: 'text-orange-400' },
  { status: 'DONE', title: 'Complete', icon: CheckCircle2, color: 'text-green-400' },
]

export function TaskKanban({ tasks, onTaskUpdate, className }: TaskKanbanProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
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

  const getOwnerRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
      case 'COMPLIANCE_LEAD':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
      case 'CONTROL_OWNER':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400'
    }
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask) {
      onTaskUpdate(draggedTask, newStatus)
      setDraggedTask(null)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TASK_COLUMNS.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.status)
          const Icon = column.icon

          return (
            <div
              key={column.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
              className="space-y-4"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${column.color}`} />
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg cursor-move hover:border-slate-600 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm text-white leading-tight mb-2">
                            {task.title}
                          </CardTitle>
                          {task.requirement && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getFrameworkGradient(task.requirement.framework.code)} text-white`}>
                                {task.requirement.framework.code}
                              </span>
                              <span className="text-xs text-slate-400">
                                {task.requirement.ref}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Priority & Owner */}
                      <div className="flex items-center justify-between">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                        <div className={`px-2 py-1 rounded text-xs font-medium border ${getOwnerRoleColor(task.ownerRole)}`}>
                          {task.ownerRole.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Due Date */}
                      {task.dueAt && (
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>Due {formatDate(task.dueAt)}</span>
                        </div>
                      )}

                      {/* Framework Link */}
                      {task.requirement && (
                        <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-xs text-slate-400 hover:text-white">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Requirement
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Empty State */}
                {columnTasks.length === 0 && (
                  <Card className="bg-slate-900/50 border border-slate-600 border-dashed rounded-lg">
                    <CardContent className="py-8 text-center">
                      <Icon className={`w-8 h-8 ${column.color} mx-auto mb-2 opacity-50`} />
                      <p className="text-slate-500 text-sm">No {column.title.toLowerCase()} tasks</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper function for framework colors (matches design.mdc)
function getFrameworkGradient(framework: string) {
  const gradients = {
    'GDPR': 'from-blue-500 to-blue-700',
    'ISO27001': 'from-green-500 to-green-700',
    'NIS2': 'from-purple-500 to-purple-700', 
    'SOC2': 'from-orange-500 to-orange-700',
  }
  return gradients[framework as keyof typeof gradients] || 'from-slate-500 to-slate-600'
}
