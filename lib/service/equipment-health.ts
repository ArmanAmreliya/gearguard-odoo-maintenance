/**
 * Equipment Health & Risk Evaluation Service
 * Rule-based logic for assessing equipment condition and predicting maintenance needs
 * Pure functions - no database calls
 */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"

interface MaintenanceRequest {
  requestType: "CORRECTIVE" | "PREVENTIVE"
  status: string
  createdAt: Date | string
  scheduledDate?: Date | string | null
}

interface EquipmentHealthEvaluation {
  riskLevel: RiskLevel
  suggestedNextMaintenanceDate: Date | null
  reasoning: string
  metrics: {
    correctiveRequestsLast30Days: number
    totalCorrectiveRequests: number
    totalPreventiveRequests: number
    averagePreventiveInterval: number | null
    daysSinceLastMaintenance: number | null
  }
}

/**
 * Evaluate equipment health and risk level based on maintenance history
 * 
 * @param requests - Array of maintenance requests for the equipment
 * @returns Health evaluation with risk level, predictions, and reasoning
 */
export function evaluateEquipmentHealth(requests: MaintenanceRequest[]): EquipmentHealthEvaluation {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Filter requests by type
  const correctiveRequests = requests.filter((r) => r.requestType === "CORRECTIVE")
  const preventiveRequests = requests.filter((r) => r.requestType === "PREVENTIVE")

  // Count recent corrective requests (last 30 days)
  const recentCorrectiveRequests = correctiveRequests.filter((r) => {
    const requestDate = new Date(r.createdAt)
    return requestDate >= thirtyDaysAgo
  })

  // Calculate risk level based on recent corrective activity
  const correctiveCount = recentCorrectiveRequests.length
  let riskLevel: RiskLevel
  let reasoning: string

  if (correctiveCount >= 3) {
    riskLevel = "HIGH"
    reasoning = `HIGH RISK: ${correctiveCount} corrective maintenance requests in the last 30 days indicates frequent failures. Immediate preventive action recommended.`
  } else if (correctiveCount >= 1) {
    riskLevel = "MEDIUM"
    reasoning = `MEDIUM RISK: ${correctiveCount} corrective maintenance request(s) in the last 30 days. Monitor closely and consider scheduled maintenance.`
  } else {
    riskLevel = "LOW"
    reasoning = "LOW RISK: No corrective maintenance requests in the last 30 days. Equipment is operating within normal parameters."
  }

  // Calculate average interval between preventive maintenance
  const averagePreventiveInterval = calculateAveragePreventiveInterval(preventiveRequests)

  // Calculate days since last maintenance
  const daysSinceLastMaintenance = calculateDaysSinceLastMaintenance(requests)

  // Predict next preventive maintenance date
  const suggestedNextMaintenanceDate = predictNextMaintenanceDate(
    preventiveRequests,
    averagePreventiveInterval,
    riskLevel
  )

  // Enhance reasoning with preventive maintenance insights
  if (suggestedNextMaintenanceDate) {
    const daysUntilNext = Math.ceil(
      (suggestedNextMaintenanceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    reasoning += ` Next preventive maintenance suggested in ${daysUntilNext} days based on historical patterns.`
  } else if (preventiveRequests.length === 0) {
    reasoning += " No preventive maintenance history available. Establish a baseline maintenance schedule."
  }

  return {
    riskLevel,
    suggestedNextMaintenanceDate,
    reasoning,
    metrics: {
      correctiveRequestsLast30Days: correctiveCount,
      totalCorrectiveRequests: correctiveRequests.length,
      totalPreventiveRequests: preventiveRequests.length,
      averagePreventiveInterval,
      daysSinceLastMaintenance,
    },
  }
}

/**
 * Calculate average interval (in days) between preventive maintenance requests
 * 
 * @param preventiveRequests - Array of preventive maintenance requests
 * @returns Average interval in days, or null if insufficient data
 */
function calculateAveragePreventiveInterval(preventiveRequests: MaintenanceRequest[]): number | null {
  if (preventiveRequests.length < 2) return null

  // Sort by date (newest first)
  const sorted = [...preventiveRequests].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Calculate intervals between consecutive requests
  const intervals: number[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i].createdAt)
    const next = new Date(sorted[i + 1].createdAt)
    const intervalDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    intervals.push(intervalDays)
  }

  // Return average interval
  const sum = intervals.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / intervals.length)
}

/**
 * Calculate days since last maintenance request (any type)
 * 
 * @param requests - Array of maintenance requests
 * @returns Days since last maintenance, or null if no history
 */
function calculateDaysSinceLastMaintenance(requests: MaintenanceRequest[]): number | null {
  if (requests.length === 0) return null

  // Find most recent request
  const mostRecent = requests.reduce((latest, current) => {
    const latestDate = new Date(latest.createdAt)
    const currentDate = new Date(current.createdAt)
    return currentDate > latestDate ? current : latest
  })

  const now = new Date()
  const lastMaintenanceDate = new Date(mostRecent.createdAt)
  const daysSince = Math.floor((now.getTime() - lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24))

  return daysSince
}

/**
 * Predict next preventive maintenance date based on historical patterns and risk level
 * 
 * @param preventiveRequests - Array of preventive maintenance requests
 * @param averageInterval - Average interval between preventive maintenance (in days)
 * @param riskLevel - Current equipment risk level
 * @returns Predicted next maintenance date, or null if unable to predict
 */
function predictNextMaintenanceDate(
  preventiveRequests: MaintenanceRequest[],
  averageInterval: number | null,
  riskLevel: RiskLevel
): Date | null {
  if (preventiveRequests.length === 0 || !averageInterval) return null

  // Find most recent preventive maintenance
  const mostRecent = preventiveRequests.reduce((latest, current) => {
    const latestDate = new Date(latest.createdAt)
    const currentDate = new Date(current.createdAt)
    return currentDate > latestDate ? current : latest
  })

  const lastMaintenanceDate = new Date(mostRecent.createdAt)

  // Adjust interval based on risk level
  let adjustedInterval = averageInterval
  if (riskLevel === "HIGH") {
    // High risk: reduce interval by 30% for more frequent maintenance
    adjustedInterval = Math.round(averageInterval * 0.7)
  } else if (riskLevel === "MEDIUM") {
    // Medium risk: reduce interval by 15%
    adjustedInterval = Math.round(averageInterval * 0.85)
  }

  // Calculate next maintenance date
  const nextMaintenanceDate = new Date(lastMaintenanceDate.getTime() + adjustedInterval * 24 * 60 * 60 * 1000)

  return nextMaintenanceDate
}

/**
 * Get human-readable summary of equipment health status
 * 
 * @param evaluation - Equipment health evaluation result
 * @returns Formatted summary string
 */
export function getHealthSummary(evaluation: EquipmentHealthEvaluation): string {
  const { riskLevel, metrics, suggestedNextMaintenanceDate } = evaluation

  let summary = `Risk Level: ${riskLevel}\n`
  summary += `Corrective requests (30 days): ${metrics.correctiveRequestsLast30Days}\n`
  summary += `Total corrective: ${metrics.totalCorrectiveRequests} | Total preventive: ${metrics.totalPreventiveRequests}\n`

  if (metrics.daysSinceLastMaintenance !== null) {
    summary += `Days since last maintenance: ${metrics.daysSinceLastMaintenance}\n`
  }

  if (suggestedNextMaintenanceDate) {
    summary += `Next maintenance: ${suggestedNextMaintenanceDate.toLocaleDateString()}\n`
  }

  return summary
}
