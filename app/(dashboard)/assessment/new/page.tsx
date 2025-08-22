'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScopingWizard } from '@/components/forms/scoping-wizard'
import { trpc } from '@/components/providers'
import { type ScopeFormData } from '@/lib/validations/scope'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, FileText, Users, Globe } from 'lucide-react'

export default function NewAssessmentPage() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)
  const [results, setResults] = useState<any>(null)

  const createAssessment = trpc.assessment.create.useMutation()
  const setScopeData = trpc.assessment.scope.set.useMutation()

  const handleStartAssessment = () => {
    setShowWizard(true)
  }

  const handleWizardComplete = async (scopeData: ScopeFormData) => {
    try {
      // Create new assessment
      const assessment = await createAssessment.mutateAsync({
        name: `Compliance Assessment - ${new Date().toLocaleDateString()}`,
      })

      // Set scope data and get analysis
      const scopeResponse = await setScopeData.mutateAsync({
        assessmentId: assessment.id,
        answers: scopeData,
      })

      setResults({
        assessment,
        scope: scopeResponse,
      })
      setShowWizard(false)
    } catch (error) {
      console.error('Failed to create assessment:', error)
    }
  }

  const handleCancel = () => {
    setShowWizard(false)
    router.push('/')
  }

  if (showWizard) {
    return (
      <ScopingWizard 
        onComplete={handleWizardComplete}
        onCancel={handleCancel}
      />
    )
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Analysis Complete!
            </h1>
            <p className="text-slate-300 text-lg">
              Based on your responses, here are the applicable compliance requirements:
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            {/* Jurisdictions */}
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Applicable Jurisdictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.scope.jurisdictions.map((jurisdiction: string) => (
                    <span key={jurisdiction} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                      {jurisdiction}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regulators */}
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Regulatory Bodies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.scope.regulators.map((regulator: string) => (
                    <span key={regulator} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                      {regulator}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Frameworks */}
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span>Required Frameworks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.scope.frameworks.map((framework: string) => (
                    <span key={framework} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                      {framework}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue to Detailed Analysis
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              New Assessment
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Our intelligent scoping wizard will analyze your organization and 
            determine the compliance frameworks that apply to you.
          </p>
        </div>

        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-4">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Answer Questions</h3>
                <p className="text-slate-400 text-sm">
                  4-step wizard about your business, data, and geography
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                <p className="text-slate-400 text-sm">
                  Rules engine determines applicable regulations
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Get Results</h3>
                <p className="text-slate-400 text-sm">
                  Detailed compliance roadmap with actionable tasks
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleStartAssessment}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Start Scoping Assessment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
