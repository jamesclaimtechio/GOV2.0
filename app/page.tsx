import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, FileText, CheckCircle2, AlertTriangle, Brain, Clock, 
  Users, Globe, ArrowRight, Zap, Target, Award, BookOpen,
  ChevronDown, Play, Star, Quote
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Gov 2.0
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#frameworks" className="text-slate-300 hover:text-white transition-colors">Frameworks</a>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI-Powered Compliance
              </span>
              <br />
              <span className="text-white">Made Simple</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Stop guessing at compliance requirements. Our intelligent platform analyzes your business context 
              and automatically maps applicable regulations across <strong className="text-white">GDPR, ISO 27001, NIS2</strong> and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Link href="/assessment/new">
                  <Zap className="w-5 h-5" />
                  <span>Start Free Assessment</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="inline-flex items-center space-x-2 border-slate-600 text-slate-300 hover:text-white px-6 py-4">
                <a href="#demo">
                  <Play className="w-4 h-4" />
                  <span>Watch Demo</span>
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-8 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Results in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              The Compliance Challenge
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Modern businesses face an increasingly complex regulatory landscape. 
              Traditional compliance approaches are manual, error-prone, and can't keep up.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl text-center p-6">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Manual Processes</h3>
              <p className="text-slate-400">
                Weeks spent reading regulations, cross-referencing requirements, and building compliance matrices manually
              </p>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl text-center p-6">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Missed Requirements</h3>
              <p className="text-slate-400">
                Critical gaps in coverage when frameworks overlap or conflict with each other
              </p>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl text-center p-6">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Audit Panic</h3>
              <p className="text-slate-400">
                Scrambling to prepare documentation and evidence when regulators come knocking
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Intelligent Compliance, 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Simplified</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Our AI doesn't just read documents—it understands your business context and 
              maps precise regulatory requirements with explainable reasoning.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left: Smart Scoping */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Smart Scoping First</h3>
              </div>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Instead of uploading random documents and hoping for the best, our guided questionnaire 
                precisely determines which regulations apply to your specific business context.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span className="text-slate-300">Business size, sector, and geography analysis</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span className="text-slate-300">Data type and processing activity mapping</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span className="text-slate-300">Jurisdictional requirements determination</span>
                </li>
              </ul>
            </div>
            
            {/* Right: Visual */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Traditional vs Gov 2.0</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-slate-300">❌ Upload documents blindly</span>
                  <span className="text-red-400 text-sm">6-8 weeks</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-slate-300">✅ Guided scoping questions</span>
                  <span className="text-green-400 text-sm">15 minutes</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl">
              <CardHeader>
                <FileText className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Multi-Framework Analysis</CardTitle>
                <CardDescription className="text-slate-400">
                  Compare against GDPR, ISO 27001, NIS2, and more in a single assessment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl">
              <CardHeader>
                <Brain className="w-8 h-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Explainable AI</CardTitle>
                <CardDescription className="text-slate-400">
                  Every recommendation comes with clear reasoning and regulatory citations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl">
              <CardHeader>
                <AlertTriangle className="w-8 h-8 text-orange-400 mb-2" />
                <CardTitle className="text-white">Conflict Detection</CardTitle>
                <CardDescription className="text-slate-400">
                  Automatically identify when different frameworks contradict each other
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl">
              <CardHeader>
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Actionable Tasks</CardTitle>
                <CardDescription className="text-slate-400">
                  Convert gaps into specific tasks with owners, deadlines, and priorities
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Four simple steps to comprehensive compliance clarity
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Answer Questions</h3>
                  <p className="text-slate-400 leading-relaxed">
                    4-step wizard captures your business context, data types, and geographic scope
                  </p>
                </div>
                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI Analysis</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Rules engine determines applicable jurisdictions, regulators, and frameworks with explanations
                  </p>
                </div>
                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-green-500"></div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Gap Detection</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Compare your current state against requirements and identify gaps with confidence scores
                  </p>
                </div>
                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-orange-500"></div>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Actionable Plan</h3>
                <p className="text-slate-400 leading-relaxed">
                  Get a prioritized task board with owners, deadlines, and audit-ready documentation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Showcase */}
      <section id="frameworks" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Comprehensive Framework Coverage
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Starting with the most critical regulations, expanding to comprehensive coverage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* GDPR */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-white">GDPR</span>
                  <span className="text-green-400 text-sm">✓ Active</span>
                </div>
                <CardTitle className="text-white">EU Data Protection</CardTitle>
                <CardDescription className="text-slate-400">
                  Comprehensive GDPR compliance with Article-level mapping and data subject rights
                </CardDescription>
              </CardHeader>
            </Card>

            {/* ISO 27001 */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-700"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-green-500 to-green-700 text-white">ISO 27001</span>
                  <span className="text-green-400 text-sm">✓ Active</span>
                </div>
                <CardTitle className="text-white">Information Security</CardTitle>
                <CardDescription className="text-slate-400">
                  Complete ISO 27001:2022 control framework with implementation guidance
                </CardDescription>
              </CardHeader>
            </Card>

            {/* NIS2 */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-700"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-700 text-white">NIS2</span>
                  <span className="text-green-400 text-sm">✓ Active</span>
                </div>
                <CardTitle className="text-white">EU Cybersecurity</CardTitle>
                <CardDescription className="text-slate-400">
                  Network and Information Systems directive for critical infrastructure
                </CardDescription>
              </CardHeader>
            </Card>

            {/* SOC 2 */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-700"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-700 text-white">SOC 2</span>
                  <span className="text-yellow-400 text-sm">⏳ Coming Soon</span>
                </div>
                <CardTitle className="text-white">US Security Standards</CardTitle>
                <CardDescription className="text-slate-400">
                  Service organization controls for security, availability, and confidentiality
                </CardDescription>
              </CardHeader>
            </Card>

            {/* UK GDPR */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white">UK GDPR</span>
                  <span className="text-yellow-400 text-sm">⏳ Coming Soon</span>
                </div>
                <CardTitle className="text-white">UK Data Protection</CardTitle>
                <CardDescription className="text-slate-400">
                  Post-Brexit data protection requirements with ICO guidance
                </CardDescription>
              </CardHeader>
            </Card>

            {/* More Coming */}
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-slate-500 to-slate-600"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-500 text-white">More</span>
                  <span className="text-slate-400 text-sm">📋 Roadmap</span>
                </div>
                <CardTitle className="text-white">Expanding Coverage</CardTitle>
                <CardDescription className="text-slate-400">
                  HIPAA, PCI DSS, DORA, and more frameworks based on user demand
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Compliance Teams</h2>
            <p className="text-slate-300">Built for the modern compliance professional</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-300 mb-4">
                "Finally, a compliance tool that understands context. The scoping wizard saved us weeks 
                of manual framework mapping."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SJ</span>
                </div>
                <div>
                  <div className="text-white font-medium">Sarah Johnson</div>
                  <div className="text-slate-400 text-sm">Compliance Director, TechCorp</div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-300 mb-4">
                "The conflict detection feature caught overlapping requirements between GDPR and NIS2 
                that we completely missed."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">MC</span>
                </div>
                <div>
                  <div className="text-white font-medium">Michael Chen</div>
                  <div className="text-slate-400 text-sm">CISO, FinanceFlow</div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-300 mb-4">
                "Reduced our compliance assessment time from 6 weeks to 2 days. 
                The AI recommendations are spot-on."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">ER</span>
                </div>
                <div>
                  <div className="text-white font-medium">Emma Rodriguez</div>
                  <div className="text-slate-400 text-sm">Legal Counsel, HealthTech Pro</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-slate-900/50 border border-slate-600 rounded-xl p-12 max-w-4xl mx-auto text-center">
            <CardContent>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Simplify Your 
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Compliance Journey?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join forward-thinking compliance teams who've moved beyond manual processes. 
                Get your personalized compliance roadmap in minutes, not months.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button asChild className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Link href="/assessment/new">
                    <Shield className="w-5 h-5" />
                    <span>Start Free Assessment</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="inline-flex items-center space-x-2 border-slate-600 text-slate-300 hover:text-white px-6 py-4">
                  <a href="mailto:hello@gov20.com">
                    <Users className="w-4 h-4" />
                    <span>Book a Demo</span>
                  </a>
                </Button>
              </div>

              <div className="flex justify-center items-center space-x-8 text-slate-400 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Free assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>No setup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Instant results</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Gov 2.0
                </span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                AI-powered compliance platform for modern businesses. 
                Simplifying regulatory complexity through intelligent automation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#frameworks" className="hover:text-white transition-colors">Frameworks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="mailto:support@gov20.com" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 Gov 2.0. Built for the future of compliance.
            </p>
            <p className="text-slate-400 text-sm">
              Made with ❤️ for compliance professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
