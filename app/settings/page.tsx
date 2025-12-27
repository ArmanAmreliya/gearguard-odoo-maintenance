"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Database,
  Mail,
  Shield,
  Clock,
  Palette,
  AlertTriangle,
  Check,
  Copy,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-teal-400" />
            <h1 className="text-4xl font-bold text-white">System Settings</h1>
          </div>
          <p className="text-slate-400">Manage system configuration and integrations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border-b border-slate-700 rounded-none p-0 h-auto w-full justify-start">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:bg-transparent px-4"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:bg-transparent px-4"
            >
              Email Integration
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:bg-transparent px-4"
            >
              Integrations
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:bg-transparent px-4"
            >
              Data Management
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-400 data-[state=active]:bg-transparent px-4"
            >
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Basic Configuration
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      System Name
                    </label>
                    <Input
                      defaultValue="GearGuard Maintenance System"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      System URL
                    </label>
                    <Input
                      defaultValue="https://gearguard.example.com"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Organization
                      </label>
                      <Input
                        defaultValue="Your Company Name"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Industry
                      </label>
                      <Input
                        defaultValue="Manufacturing"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Timezone & Date Format
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Timezone
                    </label>
                    <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2">
                      <option>UTC</option>
                      <option>EST (UTC-5)</option>
                      <option>CST (UTC-6)</option>
                      <option>MST (UTC-7)</option>
                      <option>PST (UTC-8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date Format
                    </label>
                    <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Email Integration */}
          <TabsContent value="email" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  Email Configuration
                </h3>

                <div className="space-y-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">Email notifications are enabled</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SMTP Host
                    </label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue="smtp.gmail.com"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard("smtp.gmail.com", "smtp")}
                        className="border-slate-700"
                      >
                        {copied === "smtp" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        SMTP Port
                      </label>
                      <Input
                        defaultValue="587"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        From Email
                      </label>
                      <Input
                        defaultValue="noreply@gearguard.com"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SMTP Username
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SMTP Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Test Email Configuration
                  </Button>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Save Email Settings
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Third-Party Integrations
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      name: "Slack",
                      description: "Send maintenance alerts to Slack channels",
                      status: "not-configured",
                      icon: "💬",
                    },
                    {
                      name: "Microsoft Teams",
                      description: "Integrate with Microsoft Teams for notifications",
                      status: "not-configured",
                      icon: "🔵",
                    },
                    {
                      name: "Jira",
                      description: "Sync maintenance requests with Jira tickets",
                      status: "not-configured",
                      icon: "🔧",
                    },
                    {
                      name: "Google Drive",
                      description: "Backup reports to Google Drive",
                      status: "not-configured",
                      icon: "☁️",
                    },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">
                            {integration.name}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-slate-600">
                        {integration.status === "not-configured"
                          ? "Not Configured"
                          : "Connected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Database Management
                </h3>

                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg border border-blue-700/30">
                    <div className="text-sm text-slate-300 mb-2">
                      <strong>Database Size:</strong> 2.4 MB
                    </div>
                    <div className="text-sm text-slate-300 mb-2">
                      <strong>Last Backup:</strong> 2 hours ago
                    </div>
                    <div className="text-sm text-slate-300">
                      <strong>Records:</strong> 1,243 maintenance requests, 856 equipment items
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Backup Options</h4>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Backup Now
                    </Button>
                    <Button variant="outline" className="w-full border-slate-700">
                      Download Backup
                    </Button>
                    <Button variant="outline" className="w-full border-slate-700">
                      Restore from Backup
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="font-medium text-white mb-2">Data Retention</h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-slate-300">
                          Keep completed requests for 1 year
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded"
                        />
                        <span className="text-slate-300">
                          Auto-delete archived data
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Save Data Preferences
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Security Settings
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Authentication</h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-slate-300">
                        Enable two-factor authentication (2FA)
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded"
                      />
                      <span className="text-slate-300">
                        Require password change every 90 days
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-700 space-y-2">
                    <h4 className="font-medium text-white">Session Management</h4>
                    <div className="text-sm text-slate-400">
                      <div className="mb-2">
                        <strong>Session Timeout:</strong>
                      </div>
                      <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2">
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700 space-y-2">
                    <h4 className="font-medium text-white">Audit Logging</h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-slate-300">
                        Log all user activities
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      <span className="text-slate-300">
                        Log data modifications
                      </span>
                    </label>
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-slate-700"
                    >
                      View Audit Logs
                    </Button>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-red-950/30 border-red-900/50">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>

                <div className="space-y-3">
                  <p className="text-sm text-red-200">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                  >
                    Reset All Settings to Default
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                  >
                    Delete All Data (Irreversible)
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
