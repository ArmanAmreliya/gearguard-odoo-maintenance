import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  await prisma.maintenanceRequest.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.user.deleteMany()
  await prisma.maintenanceTeam.deleteMany()

  // Create maintenance teams
  const electricalTeam = await prisma.maintenanceTeam.create({
    data: { name: "Electrical Maintenance" },
  })

  const mechanicalTeam = await prisma.maintenanceTeam.create({
    data: { name: "Mechanical Maintenance" },
  })

  const pneumaticTeam = await prisma.maintenanceTeam.create({
    data: { name: "Pneumatic Systems" },
  })

  console.log("✓ Created 3 maintenance teams")

  // Create users with hashed passwords
  const hashPassword = (pwd: string) => bcrypt.hashSync(pwd, 10)

  const admin = await prisma.user.create({
    data: {
      email: "admin@gearguard.com",
      password: hashPassword("admin123"),
      name: "Alex Johnson",
      role: "ADMIN",
    },
  })

  const tech1 = await prisma.user.create({
    data: {
      email: "tech@gearguard.com",
      password: hashPassword("tech123"),
      name: "Sarah Williams",
      role: "TECHNICIAN",
      teamId: electricalTeam.id,
    },
  })

  const tech2 = await prisma.user.create({
    data: {
      email: "mike@gearguard.com",
      password: hashPassword("mike123"),
      name: "Mike Chen",
      role: "TECHNICIAN",
      teamId: mechanicalTeam.id,
    },
  })

  const tech3 = await prisma.user.create({
    data: {
      email: "jessica@gearguard.com",
      password: hashPassword("jessica123"),
      name: "Jessica Brown",
      role: "TECHNICIAN",
      teamId: pneumaticTeam.id,
    },
  })

  const user = await prisma.user.create({
    data: {
      email: "user@gearguard.com",
      password: hashPassword("user123"),
      name: "David Martinez",
      role: "USER",
    },
  })

  console.log("✓ Created 5 users (1 admin, 3 technicians, 1 regular user)")

  // Create equipment
  const eq1 = await prisma.equipment.create({
    data: {
      name: "Industrial Transformer TR-3000",
      serialNumber: "TR-3000-2022-001",
      department: "Power Distribution",
      assignedEmployee: "James Wilson",
      physicalLocation: "Building A, Floor 2",
      purchaseDate: new Date("2022-03-15"),
      warrantyExpiry: new Date("2025-03-15"),
      maintenanceTeamId: electricalTeam.id,
    },
  })

  const eq2 = await prisma.equipment.create({
    data: {
      name: "CNC Milling Machine CNC-500",
      serialNumber: "CNC-500-2021-042",
      department: "Manufacturing",
      assignedEmployee: "Robert Taylor",
      physicalLocation: "Shop Floor, Station 3",
      purchaseDate: new Date("2021-06-20"),
      warrantyExpiry: new Date("2024-06-20"),
      maintenanceTeamId: mechanicalTeam.id,
    },
  })

  const eq3 = await prisma.equipment.create({
    data: {
      name: "Pneumatic Press System",
      serialNumber: "PPS-2000-2023-015",
      department: "Assembly",
      assignedEmployee: "Linda Garcia",
      physicalLocation: "Assembly Line, Area B",
      purchaseDate: new Date("2023-01-10"),
      warrantyExpiry: new Date("2026-01-10"),
      maintenanceTeamId: pneumaticTeam.id,
    },
  })

  const eq4 = await prisma.equipment.create({
    data: {
      name: "Control Panel CTRL-100",
      serialNumber: "CTRL-100-2020-008",
      department: "Operations",
      assignedEmployee: "Patricia Lee",
      physicalLocation: "Control Room",
      purchaseDate: new Date("2020-11-05"),
      warrantyExpiry: new Date("2023-11-05"),
      maintenanceTeamId: electricalTeam.id,
    },
  })

  const eq5 = await prisma.equipment.create({
    data: {
      name: "Hydraulic Jack System HJ-50",
      serialNumber: "HJ-50-2022-025",
      department: "Maintenance",
      assignedEmployee: "Kevin Anderson",
      physicalLocation: "Maintenance Shop",
      purchaseDate: new Date("2022-08-12"),
      warrantyExpiry: new Date("2025-08-12"),
      maintenanceTeamId: mechanicalTeam.id,
    },
  })

  const eq6 = await prisma.equipment.create({
    data: {
      name: "Air Compressor AC-75",
      serialNumber: "AC-75-2019-033",
      department: "Utilities",
      assignedEmployee: "Nancy White",
      physicalLocation: "Utility Building",
      purchaseDate: new Date("2019-04-22"),
      warrantyExpiry: new Date("2022-04-22"),
      maintenanceTeamId: pneumaticTeam.id,
    },
  })

  console.log("✓ Created 6 equipment items across 3 teams")

  // Create maintenance requests with mix of statuses
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const pastDate = new Date()
  pastDate.setDate(pastDate.getDate() - 5)

  await prisma.maintenanceRequest.create({
    data: {
      subject: "Routine transformer oil analysis and testing",
      equipmentId: eq1.id,
      maintenanceTeamId: electricalTeam.id,
      technicianId: tech1.id,
      createdById: user.id,
      requestType: "PREVENTIVE",
      scheduledDate: tomorrow,
      durationHours: 4,
      status: "NEW",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      subject: "CNC spindle bearing replacement",
      equipmentId: eq2.id,
      maintenanceTeamId: mechanicalTeam.id,
      technicianId: tech2.id,
      createdById: user.id,
      requestType: "CORRECTIVE",
      durationHours: 6,
      status: "IN_PROGRESS",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      subject: "Quarterly pneumatic system inspection",
      equipmentId: eq3.id,
      maintenanceTeamId: pneumaticTeam.id,
      createdById: user.id,
      requestType: "PREVENTIVE",
      scheduledDate: nextWeek,
      durationHours: 3,
      status: "NEW",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      subject: "Control panel circuit breaker testing",
      equipmentId: eq4.id,
      maintenanceTeamId: electricalTeam.id,
      createdById: user.id,
      requestType: "PREVENTIVE",
      scheduledDate: pastDate,
      durationHours: 2,
      status: "REPAIRED",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      subject: "Hydraulic fluid leak investigation",
      equipmentId: eq5.id,
      maintenanceTeamId: mechanicalTeam.id,
      createdById: user.id,
      requestType: "CORRECTIVE",
      durationHours: 3,
      status: "REPAIRED",
    },
  })

  await prisma.maintenanceRequest.create({
    data: {
      subject: "Compressor filter replacement overdue",
      equipmentId: eq6.id,
      maintenanceTeamId: pneumaticTeam.id,
      createdById: user.id,
      requestType: "PREVENTIVE",
      scheduledDate: pastDate,
      durationHours: 1,
      status: "IN_PROGRESS",
    },
  })

  console.log("✓ Created 6 maintenance requests with varied statuses")

  console.log("✅ Seed completed successfully!")
  console.log("\n📋 Demo Credentials:")
  console.log("  Admin: admin@gearguard.com / admin123")
  console.log("  Tech:  tech@gearguard.com / tech123")
  console.log("  User:  user@gearguard.com / user123")
}

main().catch((e) => {
  console.error("❌ Seed failed:", e)
  process.exit(1)
})
