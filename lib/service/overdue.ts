/**
 * Overdue detection logic - shared between frontend and backend
 * Used for: Kanban UI, Dashboard metrics, AI predictions
 */

interface RequestWithSchedule {
  scheduledDate: string | Date | null
  status: string
}

/**
 * Determines if a maintenance request is overdue
 * 
 * @param request - Maintenance request with scheduledDate and status
 * @returns true if request is overdue, false otherwise
 * 
 * Rules:
 * - Must have a scheduledDate
 * - scheduledDate must be in the past
 * - Status cannot be REPAIRED or SCRAP (completed states)
 */
export function isRequestOverdue(request: RequestWithSchedule): boolean {
  // No scheduled date means not overdue
  if (!request.scheduledDate) return false

  // Completed/scrapped requests are never overdue
  if (["REPAIRED", "SCRAP"].includes(request.status)) return false

  // Check if scheduled date is in the past
  const scheduledDate = new Date(request.scheduledDate)
  const now = new Date()

  return scheduledDate < now
}

/**
 * Calculates how many days overdue a request is
 * 
 * @param request - Maintenance request with scheduledDate
 * @returns number of days overdue (positive), or 0 if not overdue
 */
export function getDaysOverdue(request: RequestWithSchedule): number {
  if (!isRequestOverdue(request)) return 0

  const scheduledDate = new Date(request.scheduledDate!)
  const now = new Date()
  const diffMs = now.getTime() - scheduledDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Filters a list of requests to only overdue ones
 * 
 * @param requests - Array of maintenance requests
 * @returns Array of overdue requests
 */
export function filterOverdueRequests<T extends RequestWithSchedule>(requests: T[]): T[] {
  return requests.filter(isRequestOverdue)
}

/**
 * Counts overdue requests in a list
 * 
 * @param requests - Array of maintenance requests
 * @returns Count of overdue requests
 */
export function countOverdueRequests(requests: RequestWithSchedule[]): number {
  return requests.filter(isRequestOverdue).length
}
