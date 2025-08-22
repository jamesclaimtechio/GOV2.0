'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle2, Clock, XCircle, AlertTriangle, 
  Search, Filter, ExternalLink, FileText
} from 'lucide-react'
import { type FindingWithRequirement } from '@/lib/types'

interface FindingsTableProps {
  findings: FindingWithRequirement[]
  className?: string
}

export function FindingsTable({ findings, className }: FindingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all')

  // Get unique frameworks for filter
  const frameworks = Array.from(new Set(findings.map(f => f.requirement.framework.code)))

  // Apply filters
  const filteredFindings = findings.filter(finding => {
    const matchesSearch = !searchTerm || 
      finding.requirement.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.requirement.ref.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || finding.status === statusFilter
    const matchesFramework = frameworkFilter === 'all' || finding.requirement.framework.code === frameworkFilter

    return matchesSearch && matchesStatus && matchesFramework
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MEETS':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'PARTIAL':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'MISSING':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'UNCLEAR':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
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

  const getFrameworkColor = (framework: string) => {
    const colors = {
      'GDPR': 'bg-gradient-to-r from-blue-500 to-blue-700',
      'ISO27001': 'bg-gradient-to-r from-green-500 to-green-700',
      'NIS2': 'bg-gradient-to-r from-purple-500 to-purple-700',
      'SOC2': 'bg-gradient-to-r from-orange-500 to-orange-700',
    }
    return colors[framework as keyof typeof colors] || 'bg-slate-500'
  }

  return (
    <div className={className}>
      <Card className="bg-slate-800/50 border border-slate-700 rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-white">Compliance Findings</CardTitle>
              <CardDescription className="text-slate-400">
                {filteredFindings.length} of {findings.length} requirements
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="MEETS">Meets</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                  <SelectItem value="MISSING">Missing</SelectItem>
                  <SelectItem value="UNCLEAR">Unclear</SelectItem>
                </SelectContent>
              </Select>

              <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {frameworks.map(framework => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredFindings.map((finding) => (
              <Card 
                key={finding.id} 
                className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(finding.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getFrameworkColor(finding.requirement.framework.code)} text-white`}>
                        {finding.requirement.framework.code}
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        {finding.requirement.ref}
                      </span>
                      <Badge variant={getStatusColor(finding.status) as any} className="text-xs">
                        {finding.status}
                      </Badge>
                    </div>

                    {/* Requirement Text */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {finding.requirement.text}
                    </p>

                    {/* Rationale */}
                    <p className="text-xs text-slate-400 italic">
                      {finding.rationale}
                    </p>

                    {/* Tags */}
                    {finding.requirement.tags && finding.requirement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {finding.requirement.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end space-y-2">
                    {finding.confidence && (
                      <div className="text-xs text-slate-400">
                        {Math.round(finding.confidence * 100)}% confidence
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Empty State */}
            {filteredFindings.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">
                  No findings match your filters
                </h3>
                <p className="text-slate-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
