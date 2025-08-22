'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, ChevronLeft, Building2, Shield, Globe, Database, Loader2 } from 'lucide-react'
import { 
  scopeFormSchema, 
  type ScopeFormData,
  COMPANY_SIZES,
  SECTORS,
  DATA_TYPES,
  JURISDICTIONS
} from '@/lib/validations/scope'

interface ScopingWizardProps {
  onComplete: (data: ScopeFormData) => void
  onCancel?: () => void
}

const STEPS = [
  { 
    id: 'company', 
    title: 'Company Profile', 
    description: 'Tell us about your organization',
    icon: Building2 
  },
  { 
    id: 'business', 
    title: 'Business Context', 
    description: 'What sector and services do you operate in?',
    icon: Shield 
  },
  { 
    id: 'data', 
    title: 'Data Handling', 
    description: 'What types of data do you process?',
    icon: Database 
  },
  { 
    id: 'geography', 
    title: 'Geographic Scope', 
    description: 'Where are your systems and users located?',
    icon: Globe 
  },
]

export function ScopingWizard({ onComplete, onCancel }: ScopingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ScopeFormData>({
    resolver: zodResolver(scopeFormSchema),
    defaultValues: {
      companySize: undefined,
      sector: [],
      dataTypes: [],
      systemLocations: [],
      hasDataProcessors: false,
      isPublicSector: false,
      handlesSpecialCategories: false,
    },
  })

  const { watch, setValue, handleSubmit, formState: { errors } } = form
  const watchedValues = watch()

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: ScopeFormData) => {
    setIsSubmitting(true)
    try {
      console.log('🔄 Submitting scoping data:', data)
      await onComplete(data)
    } catch (error) {
      console.error('❌ Scoping submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckboxChange = (field: keyof ScopeFormData, value: string, checked: boolean) => {
    const currentArray = watchedValues[field] as string[]
    if (checked) {
      setValue(field, [...currentArray, value] as any)
    } else {
      setValue(field, currentArray.filter(item => item !== value) as any)
    }
  }

  const currentStepData = STEPS[currentStep]
  const CurrentIcon = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Compliance Scoping Assessment
          </h1>
          <p className="text-slate-300 text-lg">
            Help us understand your organization to determine applicable regulations
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Form */}
        <Card className="bg-slate-800/50 border border-slate-700 rounded-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <CurrentIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">{currentStepData.title}</CardTitle>
            <CardDescription className="text-slate-300">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Company Profile */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white text-lg font-semibold mb-4 block">
                      Company Size
                    </Label>
                    <RadioGroup
                      value={watchedValues.companySize}
                      onValueChange={(value: string) => setValue('companySize', value as ScopeFormData['companySize'])}
                    >
                      {COMPANY_SIZES.map((size) => (
                        <div key={size.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30">
                          <RadioGroupItem value={size.value} id={size.value} />
                          <Label htmlFor={size.value} className="text-slate-200 cursor-pointer flex-1">
                            {size.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.companySize && (
                      <p className="text-red-400 text-sm mt-2">{errors.companySize.message}</p>
                    )}
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30">
                      <Checkbox
                        id="isPublicSector"
                        checked={watchedValues.isPublicSector}
                        onCheckedChange={(checked) => setValue('isPublicSector', checked as boolean)}
                      />
                      <Label htmlFor="isPublicSector" className="text-slate-200">
                        Public sector organization
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30">
                      <Checkbox
                        id="hasDataProcessors"
                        checked={watchedValues.hasDataProcessors}
                        onCheckedChange={(checked) => setValue('hasDataProcessors', checked as boolean)}
                      />
                      <Label htmlFor="hasDataProcessors" className="text-slate-200">
                        Uses third-party data processors
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Context */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white text-lg font-semibold mb-4 block">
                      Business Sectors <span className="text-slate-400">(select all that apply)</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SECTORS.map((sector) => (
                        <div key={sector.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30">
                          <Checkbox
                            id={sector.value}
                            checked={watchedValues.sector.includes(sector.value)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('sector', sector.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={sector.value} className="text-slate-200 cursor-pointer">
                            {sector.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.sector && (
                      <p className="text-red-400 text-sm mt-2">{errors.sector.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Data Handling */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white text-lg font-semibold mb-4 block">
                      Data Types <span className="text-slate-400">(select all that apply)</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {DATA_TYPES.map((dataType) => (
                        <div key={dataType.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30">
                          <Checkbox
                            id={dataType.value}
                            checked={watchedValues.dataTypes.includes(dataType.value)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('dataTypes', dataType.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={dataType.value} className="text-slate-200 cursor-pointer">
                            {dataType.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.dataTypes && (
                      <p className="text-red-400 text-sm mt-2">{errors.dataTypes.message}</p>
                    )}
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-700/30">
                    <Checkbox
                      id="handlesSpecialCategories"
                      checked={watchedValues.handlesSpecialCategories}
                      onCheckedChange={(checked) => setValue('handlesSpecialCategories', checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="handlesSpecialCategories" className="text-slate-200 font-medium">
                        Special category data
                      </Label>
                      <p className="text-slate-400 text-sm">
                        Health, biometric, ethnic origin, political opinions, etc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Geographic Scope */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white text-lg font-semibold mb-4 block">
                      System Locations <span className="text-slate-400">(select all that apply)</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {JURISDICTIONS.map((jurisdiction) => (
                        <div key={jurisdiction.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30">
                          <Checkbox
                            id={jurisdiction.value}
                            checked={watchedValues.systemLocations.includes(jurisdiction.value)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('systemLocations', jurisdiction.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={jurisdiction.value} className="text-slate-200 cursor-pointer">
                            {jurisdiction.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.systemLocations && (
                      <p className="text-red-400 text-sm mt-2">{errors.systemLocations.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-600">
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 0 ? onCancel : prevStep}
                  className="flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentStep === 0 ? 'Cancel' : 'Previous'}</span>
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center space-x-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Compliance Requirements</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Step indicators */}
        <div className="flex justify-center mt-8 space-x-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500' 
                    : 'border-slate-600 bg-slate-800'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    index <= currentStep ? 'text-white' : 'text-slate-400'
                  }`} />
                </div>
                <span className={`text-xs mt-2 ${
                  index <= currentStep ? 'text-white' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Debug Info:</h3>
            <pre className="text-slate-300 text-xs overflow-auto">
              {JSON.stringify({ 
                currentStep, 
                isSubmitting,
                formData: watchedValues,
                errors: Object.keys(errors),
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}