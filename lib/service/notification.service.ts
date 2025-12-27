import { prisma } from "@/lib/db"
import nodemailer from "nodemailer"

// Email configuration (configure with your email service)
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "localhost",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: process.env.EMAIL_USER
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
})

export interface NotificationPayload {
  userId: string
  type: "OVERDUE" | "DUE_SOON" | "COMPLETED" | "ASSIGNED" | "STATUS_CHANGE"
  title: string
  message: string
  relatedRequestId?: string
  relatedEquipmentId?: string
}

/**
 * Create an in-app notification
 */
export async function createNotification(payload: NotificationPayload) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        relatedRequestId: payload.relatedRequestId,
        relatedEquipmentId: payload.relatedEquipmentId,
      },
    })

    // Get user preferences
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId: payload.userId },
    })

    // Send email if enabled
    if (preferences?.emailOverdue || preferences?.emailDueSoon || preferences?.emailCompleted || preferences?.emailAssigned) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (user) {
        await sendEmailNotification(user.email, payload.title, payload.message)
      }
    }

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

/**
 * Send email notification
 */
export async function sendEmailNotification(
  email: string,
  title: string,
  message: string,
  requestId?: string
) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@maintenx.com",
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #10b981 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">MaintenX Alert</h2>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px;">
            <h3 style="color: #1e293b; margin-top: 0;">${title}</h3>
            <p style="color: #475569; line-height: 1.6;">${message}</p>
            ${
              requestId
                ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}/requests/${requestId}" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #10b981 100%); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px;">View Request</a>`
                : ""
            }
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #64748b; font-size: 12px;">This is an automated message from MaintenX Maintenance Management System.</p>
          </div>
        </div>
      `,
    }

    // Only send if email is configured
    if (process.env.EMAIL_USER) {
      await emailTransporter.sendMail(mailOptions)
    }
  } catch (error) {
    console.error("Error sending email:", error)
    // Don't throw - email failure shouldn't break the application
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string, limit = 20) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string) {
  return await prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  })
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
      readAt: new Date(),
    },
  })
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  })
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  return await prisma.notification.delete({
    where: { id: notificationId },
  })
}

/**
 * Get or create notification preferences
 */
export async function getOrCreateNotificationPreferences(userId: string) {
  let preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  })

  if (!preferences) {
    preferences = await prisma.notificationPreference.create({
      data: { userId },
    })
  }

  return preferences
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  updates: Partial<{
    emailOverdue: boolean
    emailDueSoon: boolean
    emailCompleted: boolean
    emailAssigned: boolean
    pushNotifications: boolean
    inAppNotifications: boolean
    notificationFrequency: string
    quietHoursStart: string
    quietHoursEnd: string
  }>
) {
  return await prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId, ...updates },
    update: updates,
  })
}

/**
 * Check if maintenance is overdue and create notification
 */
export async function checkAndNotifyOverdue(requestId: string) {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: {
      createdBy: true,
      technician: true,
    },
  })

  if (!request) return

  const dueDate = request.scheduledDate
  if (!dueDate) return

  const isOverdue = new Date() > dueDate && request.status !== "DONE"

  if (isOverdue) {
    // Notify creator
    await createNotification({
      userId: request.createdById,
      type: "OVERDUE",
      title: "Maintenance Overdue",
      message: `Request #${request.id.slice(0, 8)} is overdue for completion.`,
      relatedRequestId: requestId,
    })

    // Notify assigned technician if any
    if (request.technicianId) {
      await createNotification({
        userId: request.technicianId,
        type: "OVERDUE",
        title: "Maintenance Overdue",
        message: `You have an overdue maintenance request #${request.id.slice(0, 8)} that needs immediate attention.`,
        relatedRequestId: requestId,
      })
    }
  }
}

/**
 * Check and notify for maintenance due soon
 */
export async function checkAndNotifyDueSoon(requestId: string, daysThreshold = 2) {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: {
      createdBy: true,
      technician: true,
    },
  })

  if (!request) return

  const dueDate = request.scheduledDate
  if (!dueDate || request.status === "DONE") return

  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilDue > 0 && daysUntilDue <= daysThreshold) {
    // Notify technician
    if (request.technicianId) {
      await createNotification({
        userId: request.technicianId,
        type: "DUE_SOON",
        title: "Maintenance Due Soon",
        message: `Request #${request.id.slice(0, 8)} is due in ${daysUntilDue} day(s).`,
        relatedRequestId: requestId,
      })
    }

    // Notify creator
    await createNotification({
      userId: request.createdById,
      type: "DUE_SOON",
      title: "Maintenance Due Soon",
      message: `Request #${request.id.slice(0, 8)} is due in ${daysUntilDue} day(s).`,
      relatedRequestId: requestId,
    })
  }
}
