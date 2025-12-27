"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Database,
  Settings,
  AlertTriangle,
} from "lucide-react"

export function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Predictive Maintenance",
      description: "AI-powered alerts to prevent equipment failures before they happen",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Performance Analytics",
      description: "Real-time insights into equipment health and maintenance trends",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Team Collaboration",
      description: "Seamless coordination between maintenance teams and departments",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Schedule Optimization",
      description: "Smart scheduling to minimize downtime and maximize efficiency",
    },
    {
      icon: <Database className="w-6 h-6 text-purple-500" />,
      title: "Asset Management",
      description: "Complete equipment lifecycle tracking and documentation",
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with role-based access control",
    },
  ]

  const stats = [
    { value: "99.8%", label: "System Uptime" },
    { value: "50+", label: "Integrations" },
    { value: "10K+", label: "Active Users" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MaintenX</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="#stats" className="text-gray-300 hover:text-white transition">
              Stats
            </a>
            <a href="#cta" className="text-gray-300 hover:text-white transition">
              Contact
            </a>
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-full border border-teal-500/30 mb-6">
                <span className="text-sm font-semibold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                  ✨ Intelligent Maintenance Management
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Predictive Maintenance, <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">Simplified</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Reduce equipment downtime by 60%, cut maintenance costs, and empower your teams with real-time analytics and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-2 text-gray-400 mt-8">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>30-day free trial • No credit card required</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-3xl blur-3xl"></div>
              <Card className="relative border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Equipment Status</CardTitle>
                      <CardDescription>Real-time monitoring</CardDescription>
                    </div>
                    <BarChart3 className="w-5 h-5 text-teal-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Operational</span>
                      <span className="text-green-400 font-semibold">98%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-green-500" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Maintenance Due</span>
                      <span className="text-orange-400 font-semibold">12%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">Smart Maintenance</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to optimize maintenance operations and extend equipment life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-slate-700/50 bg-slate-800/40 backdrop-blur hover:border-teal-500/50 transition">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-teal-500/50 bg-gradient-to-r from-teal-500/10 to-green-500/10 backdrop-blur">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl text-white mb-4">
                Ready to Optimize Your Maintenance?
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Join thousands of organizations reducing downtime and saving millions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white"
              >
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-teal-500/50 text-white hover:bg-teal-500/10">
                Schedule Demo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 MaintenX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
