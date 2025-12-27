"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

/**
 * User Create Request Form
 * 
 * USER-ONLY: Submit new maintenance requests
 * - Equipment selection only (no technician assignment)
 * - Auto-fill maintenance team from backend
 * - Input validation before submit
 * - Backend error display
 * - Safe form handling
 * - No client-side trust of input
 */

interface Equipment {
  id: string
  name: string
  type: string
  status: string
}

interface FormErrors {
  title?: string
  description?: string
  equipmentId?: string
  dueDate?: string
  priority?: string
  general?: string
}

export default function NewRequestPage() {
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [equipmentId, setEquipmentId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("MEDIUM")

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingEquipment, setIsFetchingEquipment] = useState(true)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch equipment on mount
  useEffect(() => {
    async function fetchEquipment() {
      try {
        const res = await fetch("/api/equipment")
        if (!res.ok) throw new Error("Failed to fetch equipment")

        const data = await res.json()
        setEquipment(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching equipment:", error)
        setErrors({ general: "Failed to load equipment list" })
      } finally {
        setIsFetchingEquipment(false)
      }
    }

    fetchEquipment()
  }, [])

  /**
   * Validate form inputs
   */
  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters"
    } else if (title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    } else if (description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters"
    }

    if (!equipmentId) {
      newErrors.equipmentId = "Equipment selection is required"
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    } else {
      const selectedDate = new Date(dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    if (!priority) {
      newErrors.priority = "Priority is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Client-side validation
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      // Submit to API
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          equipmentId,
          dueDate,
          priority,
          type: "CORRECTIVE", // Users can only create corrective requests
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create request")
      }

      const newRequest = await res.json()

      // Show success message
      setSuccessMessage("Request created successfully!")

      // Redirect after brief delay
      setTimeout(() => {
        router.push(`/requests/${newRequest.id}`)
      }, 1500)
    } catch (error) {
      console.error("Error creating request:", error)
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Failed to create request. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 max-w-2xl mx-auto">
          <Link href="/requests" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Maintenance Request
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Submit a new maintenance request for your equipment
          </p>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Fill in the information about the maintenance needed
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Request Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Urgent AC compressor repair"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className={errors.title ? "border-red-500" : ""}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the maintenance issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                  }`}
                  aria-describedby={errors.description ? "description-error" : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Equipment Field */}
              <div>
                <label
                  htmlFor="equipment"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Equipment <span className="text-red-500">*</span>
                </label>
                {isFetchingEquipment ? (
                  <div className="flex items-center justify-center h-10 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-800">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  </div>
                ) : (
                  <select
                    id="equipment"
                    value={equipmentId}
                    onChange={(e) => setEquipmentId(e.target.value)}
                    disabled={isLoading || equipment.length === 0}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.equipmentId ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                    }`}
                    aria-describedby={errors.equipmentId ? "equipment-error" : undefined}
                  >
                    <option value="">-- Select equipment --</option>
                    {equipment.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.type})
                      </option>
                    ))}
                  </select>
                )}
                {errors.equipmentId && (
                  <p id="equipment-error" className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.equipmentId}
                  </p>
                )}
              </div>

              {/* Due Date Field */}
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Due Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isLoading}
                  min={today}
                  className={errors.dueDate ? "border-red-500" : ""}
                  aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
                />
                {errors.dueDate && (
                  <p id="dueDate-error" className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Priority Field */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.priority ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                  }`}
                  aria-describedby={errors.priority ? "priority-error" : undefined}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && (
                  <p id="priority-error" className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.priority}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || isFetchingEquipment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Creating..." : "Create Request"}
                </Button>
                <Link href="/requests" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>

              {/* Helper Text */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> A maintenance team will be automatically assigned based on your
                  equipment type. You cannot assign technicians directly.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
