import { getSession } from "@/lib/auth"
import type { AuthSession } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * ============================================================================
 * TYPED RESPONSES
 * ============================================================================
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status: number
}

/**
 * ============================================================================
 * SUCCESS RESPONSES
 * ============================================================================
 */

/**
 * Return successful response with data
 * @param data - Response payload
 * @param status - HTTP status code (default: 200)
 * @param headers - Additional headers
 */
export function successResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      status,
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }
  )
}

/**
 * Return created response (201)
 */
export function createdResponse<T>(
  data: T,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201, headers)
}

/**
 * Return no-content response (204)
 */
export function noContentResponse(
  headers?: Record<string, string>
): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })
}

/**
 * ============================================================================
 * ERROR RESPONSES
 * ============================================================================
 */

/**
 * Return error response with message
 * @param message - Error message
 * @param status - HTTP status code
 * @param code - Optional error code for client-side handling
 */
export function errorResponse(
  message: string,
  status = 400,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      status,
      ...(code && { code }),
    },
    { status }
  )
}

/**
 * Return 400 Bad Request
 */
export function badRequestResponse(message: string): NextResponse<ApiResponse> {
  return errorResponse(message, 400, "BAD_REQUEST")
}

/**
 * Return 401 Unauthorized
 */
export function unauthorizedResponse(
  message = "Unauthorized"
): NextResponse<ApiResponse> {
  return errorResponse(message, 401, "UNAUTHORIZED")
}

/**
 * Return 403 Forbidden
 */
export function forbiddenResponse(
  message = "Forbidden"
): NextResponse<ApiResponse> {
  return errorResponse(message, 403, "FORBIDDEN")
}

/**
 * Return 404 Not Found
 */
export function notFoundResponse(
  message = "Resource not found"
): NextResponse<ApiResponse> {
  return errorResponse(message, 404, "NOT_FOUND")
}

/**
 * Return 409 Conflict
 */
export function conflictResponse(message: string): NextResponse<ApiResponse> {
  return errorResponse(message, 409, "CONFLICT")
}

/**
 * Return 500 Internal Server Error
 */
export function internalErrorResponse(
  message = "Internal server error"
): NextResponse<ApiResponse> {
  console.error("🔴 Internal Server Error:", message)
  return errorResponse(message, 500, "INTERNAL_ERROR")
}

/**
 * ============================================================================
 * AUTHENTICATION & AUTHORIZATION
 * ============================================================================
 */

/**
 * High-order function: Require authentication
 *
 * Usage:
 * export const GET = withAuth(async (session) => {
 *   return successResponse({ user: session })
 * })
 */
export function withAuth(
  handler: (session: AuthSession) => Promise<NextResponse>
) {
  return async (): Promise<NextResponse> => {
    const session = await getSession()
    if (!session) {
      return unauthorizedResponse("Authentication required")
    }
    return handler(session)
  }
}

/**
 * High-order function: Require specific roles
 *
 * Usage:
 * export const GET = withRole(["ADMIN"], async (session) => {
 *   return successResponse({ admin: true })
 * })
 */
export function withRole(
  allowedRoles: string[],
  handler: (session: AuthSession) => Promise<NextResponse>
) {
  return async (): Promise<NextResponse> => {
    const session = await getSession()

    if (!session) {
      return unauthorizedResponse("Authentication required")
    }

    if (!allowedRoles.includes(session.role)) {
      return forbiddenResponse(
        `Only ${allowedRoles.join(", ")} can access this resource`
      )
    }

    return handler(session)
  }
}

/**
 * ============================================================================
 * VALIDATION HELPERS
 * ============================================================================
 */

/**
 * Validate required fields in object
 * @param obj - Object to validate
 * @param requiredFields - Array of required field names
 * @returns Error response if validation fails, null if valid
 */
export function validateRequired(
  obj: Record<string, any>,
  requiredFields: string[]
): NextResponse<ApiResponse> | null {
  const missing = requiredFields.filter((field) => !obj[field])

  if (missing.length > 0) {
    return badRequestResponse(
      `Missing required fields: ${missing.join(", ")}`
    )
  }

  return null
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): NextResponse<ApiResponse> | null {
  if (value.length < minLength || value.length > maxLength) {
    return badRequestResponse(
      `${fieldName} must be between ${minLength} and ${maxLength} characters`
    )
  }
  return null
}

/**
 * Validate email format
 */
export function validateEmail(email: string): NextResponse<ApiResponse> | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return badRequestResponse("Invalid email format")
  }
  return null
}

/**
 * Validate enum value
 */
export function validateEnum(
  value: string,
  allowedValues: string[],
  fieldName: string
): NextResponse<ApiResponse> | null {
  if (!allowedValues.includes(value)) {
    return badRequestResponse(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    )
  }
  return null
}

/**
 * Validate date is not in the past
 */
export function validateFutureDate(
  dateString: string,
  fieldName: string
): NextResponse<ApiResponse> | null {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date < today) {
    return badRequestResponse(`${fieldName} cannot be in the past`)
  }
  return null
}

/**
 * ============================================================================
 * CLIENT-SIDE API HELPERS
 * ============================================================================
 */

/**
 * Safe fetch wrapper for client components
 * - Handles errors consistently
 * - Parses JSON safely
 * - Throws typed errors
 */
export async function fetchApi<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      const error = new Error(
        errorData.error || `API error: ${res.status} ${res.statusText}`
      )
      ;(error as any).status = res.status
      throw error
    }

    return await res.json()
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch from API")
  }
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  url: string,
  data: any
): Promise<T> {
  return fetchApi(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  url: string,
  data: any
): Promise<T> {
  return fetchApi(url, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * PATCH request helper
 */
export async function apiPatch<T = any>(
  url: string,
  data: any
): Promise<T> {
  return fetchApi(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(url: string): Promise<T> {
  return fetchApi(url, {
    method: "DELETE",
  })
}

/**
 * ============================================================================
 * LOGGING & DEBUGGING
 * ============================================================================
 */

/**
 * Log API error with context
 */
export function logApiError(
  context: string,
  error: unknown,
  extra?: Record<string, any>
) {
  console.error(`❌ [${context}]`, {
    error:
      error instanceof Error ? error.message : String(error),
    ...extra,
  })
}

/**
 * Log API success
 */
export function logApiSuccess(context: string, extra?: Record<string, any>) {
  console.log(`✅ [${context}]`, extra)
}
