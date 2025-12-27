import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  await prisma.maintenanceRequest.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.user.deleteMany()
  await prisma.maintenanceTeam.deleteMany()

  // Create 5 maintenance teams
  const electricalTeam = await prisma.maintenanceTeam.create({
    data: { name: "Electrical Systems" },
  })

  const mechanicalTeam = await prisma.maintenanceTeam.create({
    data: { name: "Mechanical Engineering" },
  })

  const pneumaticTeam = await prisma.maintenanceTeam.create({
    data: { name: "Pneumatic & Hydraulics" },
  })

  const hvacTeam = await prisma.maintenanceTeam.create({
    data: { name: "HVAC Systems" },
  })

  const avionicsTeam = await prisma.maintenanceTeam.create({
    data: { name: "Avionics & Controls" },
  })

  console.log("✓ Created 5 maintenance teams")

  // Create users with hashed passwords (12 users total)
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
      email: "sarah@gearguard.com",
      password: hashPassword("sarah123"),
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

  const tech4 = await prisma.user.create({
    data: {
      email: "robert@gearguard.com",
      password: hashPassword("robert123"),
      name: "Robert Martinez",
      role: "TECHNICIAN",
      teamId: hvacTeam.id,
    },
  })

  const tech5 = await prisma.user.create({
    data: {
      email: "linda@gearguard.com",
      password: hashPassword("linda123"),
      name: "Linda Garcia",
      role: "TECHNICIAN",
      teamId: avionicsTeam.id,
    },
  })

  const tech6 = await prisma.user.create({
    data: {
      email: "thomas@gearguard.com",
      password: hashPassword("thomas123"),
      name: "Thomas Anderson",
      role: "TECHNICIAN",
      teamId: electricalTeam.id,
    },
  })

  const tech7 = await prisma.user.create({
    data: {
      email: "patricia@gearguard.com",
      password: hashPassword("patricia123"),
      name: "Patricia Lee",
      role: "TECHNICIAN",
      teamId: mechanicalTeam.id,
    },
  })

  const user1 = await prisma.user.create({
    data: {
      email: "david@gearguard.com",
      password: hashPassword("david123"),
      name: "David Martinez",
      role: "USER",
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: "nancy@gearguard.com",
      password: hashPassword("nancy123"),
      name: "Nancy White",
      role: "USER",
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: "kevin@gearguard.com",
      password: hashPassword("kevin123"),
      name: "Kevin Davis",
      role: "USER",
    },
  })

  const user4 = await prisma.user.create({
    data: {
      email: "james@gearguard.com",
      password: hashPassword("james123"),
      name: "James Wilson",
      role: "USER",
    },
  })

  console.log("✓ Created 12 users (1 admin, 7 technicians, 4 regular users)")

  // Create 12 equipment items
  const equipmentList = await Promise.all([
    prisma.equipment.create({
      data: {
        name: "Industrial Transformer TR-3000",
        serialNumber: "TR-3000-2022-001",
        department: "Power Distribution",
        assignedEmployee: "James Wilson",
        physicalLocation: "Building A, Floor 2",
        purchaseDate: new Date("2022-03-15"),
        warrantyExpiry: new Date("2025-03-15"),
        maintenanceTeamId: electricalTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "CNC Milling Machine CNC-500",
        serialNumber: "CNC-500-2021-042",
        department: "Manufacturing",
        assignedEmployee: "Robert Taylor",
        physicalLocation: "Shop Floor, Station 3",
        purchaseDate: new Date("2021-06-20"),
        warrantyExpiry: new Date("2024-06-20"),
        maintenanceTeamId: mechanicalTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Pneumatic Press System",
        serialNumber: "PPS-2000-2023-015",
        department: "Assembly",
        assignedEmployee: "Linda Garcia",
        physicalLocation: "Assembly Line, Area B",
        purchaseDate: new Date("2023-01-10"),
        warrantyExpiry: new Date("2026-01-10"),
        maintenanceTeamId: pneumaticTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Control Panel CTRL-100",
        serialNumber: "CTRL-100-2020-008",
        department: "Operations",
        assignedEmployee: "Patricia Lee",
        physicalLocation: "Control Room",
        purchaseDate: new Date("2020-11-05"),
        warrantyExpiry: new Date("2023-11-05"),
        maintenanceTeamId: electricalTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Hydraulic Jack System HJ-50",
        serialNumber: "HJ-50-2022-025",
        department: "Maintenance",
        assignedEmployee: "Kevin Anderson",
        physicalLocation: "Maintenance Shop",
        purchaseDate: new Date("2022-08-12"),
        warrantyExpiry: new Date("2025-08-12"),
        maintenanceTeamId: mechanicalTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Air Compressor AC-75",
        serialNumber: "AC-75-2019-033",
        department: "Utilities",
        assignedEmployee: "Nancy White",
        physicalLocation: "Utility Building",
        purchaseDate: new Date("2019-04-22"),
        warrantyExpiry: new Date("2022-04-22"),
        maintenanceTeamId: pneumaticTeam.id,
        isScrapped: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "HVAC Central Unit HVAC-1000",
        serialNumber: "HVAC-1000-2021-012",
        department: "Climate Control",
        assignedEmployee: "Susan Moore",
        physicalLocation: "Rooftop, Building B",
        purchaseDate: new Date("2021-02-14"),
        warrantyExpiry: new Date("2024-02-14"),
        maintenanceTeamId: hvacTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Avionics Navigation System ANS-200",
        serialNumber: "ANS-200-2023-007",
        department: "Engineering",
        assignedEmployee: "Mark Thompson",
        physicalLocation: "Lab 4, Building C",
        purchaseDate: new Date("2023-05-30"),
        warrantyExpiry: new Date("2026-05-30"),
        maintenanceTeamId: avionicsTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Industrial Lathe LTH-450",
        serialNumber: "LTH-450-2020-019",
        department: "Manufacturing",
        assignedEmployee: "George Harris",
        physicalLocation: "Shop Floor, Station 1",
        purchaseDate: new Date("2020-09-08"),
        warrantyExpiry: new Date("2023-09-08"),
        maintenanceTeamId: mechanicalTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Power Distribution Panel PDP-50",
        serialNumber: "PDP-50-2022-041",
        department: "Electrical",
        assignedEmployee: "Elizabeth Clark",
        physicalLocation: "Building A, Basement",
        purchaseDate: new Date("2022-07-19"),
        warrantyExpiry: new Date("2025-07-19"),
        maintenanceTeamId: electricalTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Water Chiller WC-500",
        serialNumber: "WC-500-2021-031",
        department: "Utilities",
        assignedEmployee: "Frank Brown",
        physicalLocation: "Building D, Level 1",
        purchaseDate: new Date("2021-11-22"),
        warrantyExpiry: new Date("2024-11-22"),
        maintenanceTeamId: hvacTeam.id,
        isScrapped: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Emergency Generator EG-250",
        serialNumber: "EG-250-2019-015",
        department: "Backup Systems",
        assignedEmployee: "Oscar Martinez",
        physicalLocation: "Generator Room, Building A",
        purchaseDate: new Date("2019-12-03"),
        warrantyExpiry: new Date("2022-12-03"),
        maintenanceTeamId: electricalTeam.id,
        isScrapped: false,
      },
    }),
  ])

  console.log("✓ Created 12 equipment items across 5 teams (1 scrapped)")

  // Create 20+ maintenance requests
  const today = new Date()
  
  const requestsData = [
    // Electrical Team Requests
    {
      subject: "Routine transformer oil analysis and testing",
      equipmentId: equipmentList[0].id,
      teamId: electricalTeam.id,
      techId: tech1.id,
      type: "PREVENTIVE",
      status: "NEW",
      daysOffset: 1,
    },
    {
      subject: "Control panel circuit breaker testing",
      equipmentId: equipmentList[3].id,
      teamId: electricalTeam.id,
      techId: tech1.id,
      type: "PREVENTIVE",
      status: "COMPLETED",
      daysOffset: -15,
    },
    {
      subject: "Power distribution panel inspection",
      equipmentId: equipmentList[9].id,
      teamId: electricalTeam.id,
      techId: tech6.id,
      type: "PREVENTIVE",
      status: "IN_PROGRESS",
      daysOffset: -2,
    },
    {
      subject: "Emergency generator load testing",
      equipmentId: equipmentList[11].id,
      teamId: electricalTeam.id,
      techId: tech6.id,
      type: "PREVENTIVE",
      status: "NEW",
      daysOffset: 3,
    },
    // Mechanical Team Requests
    {
      subject: "CNC spindle bearing replacement",
      equipmentId: equipmentList[1].id,
      teamId: mechanicalTeam.id,
      techId: tech2.id,
      type: "CORRECTIVE",
      status: "IN_PROGRESS",
      daysOffset: -5,
    },
    {
      subject: "Hydraulic fluid leak investigation",
      equipmentId: equipmentList[4].id,
      teamId: mechanicalTeam.id,
      techId: tech2.id,
      type: "CORRECTIVE",
      status: "COMPLETED",
      daysOffset: -20,
    },
    {
      subject: "Industrial lathe calibration service",
      equipmentId: equipmentList[8].id,
      teamId: mechanicalTeam.id,
      techId: tech7.id,
      type: "PREVENTIVE",
      status: "COMPLETED",
      daysOffset: -30,
    },
    {
      subject: "Bearing lubrication replacement cycle",
      equipmentId: equipmentList[1].id,
      teamId: mechanicalTeam.id,
      techId: tech7.id,
      type: "PREVENTIVE",
      status: "NEW",
      daysOffset: 7,
    },
    {
      subject: "Gearbox oil analysis and change",
      equipmentId: equipmentList[8].id,
      teamId: mechanicalTeam.id,
      techId: tech2.id,
      type: "PREVENTIVE",
      status: "SCHEDULED",
      daysOffset: 5,
    },
    // Pneumatic Team Requests
    {
      subject: "Quarterly pneumatic system inspection",
      equipmentId: equipmentList[2].id,
      teamId: pneumaticTeam.id,
      techId: tech3.id,
      type: "PREVENTIVE",
      status: "NEW",
      daysOffset: 7,
    },
    {
      subject: "Pneumatic hose replacement - critical line",
      equipmentId: equipmentList[2].id,
      teamId: pneumaticTeam.id,
      techId: tech3.id,
      type: "CORRECTIVE",
      status: "COMPLETED",
      daysOffset: -8,
    },
    {
      subject: "Air compressor filter element change",
      equipmentId: equipmentList[5].id,
      teamId: pneumaticTeam.id,
      techId: tech3.id,
      type: "PREVENTIVE",
      status: "COMPLETED",
      daysOffset: -25,
    },
    // HVAC Team Requests
    {
      subject: "HVAC seasonal maintenance - spring",
      equipmentId: equipmentList[6].id,
      teamId: hvacTeam.id,
      techId: tech4.id,
      type: "PREVENTIVE",
      status: "IN_PROGRESS",
      daysOffset: -3,
    },
    {
      subject: "Chiller coolant flush and refill",
      equipmentId: equipmentList[10].id,
      teamId: hvacTeam.id,
      techId: tech4.id,
      type: "PREVENTIVE",
      status: "NEW",
      daysOffset: 2,
    },
    {
      subject: "HVAC ductwork cleaning service",
      equipmentId: equipmentList[6].id,
      teamId: hvacTeam.id,
      techId: tech4.id,
      type: "PREVENTIVE",
      status: "COMPLETED",
      daysOffset: -40,
    },
    // Avionics Team Requests
    {
      subject: "Navigation system calibration check",
      equipmentId: equipmentList[7].id,
      teamId: avionicsTeam.id,
      techId: tech5.id,
      type: "PREVENTIVE",
      status: "IN_PROGRESS",
      daysOffset: -1,
    },
    {
      subject: "Avionics firmware update installation",
      equipmentId: equipmentList[7].id,
      teamId: avionicsTeam.id,
      techId: tech5.id,
      type: "PREVENTIVE",
      status: "NEW",
      daysOffset: 10,
    },
    // Cross-team requests
    {
      subject: "Complete facility electrical audit",
      equipmentId: equipmentList[0].id,
      teamId: electricalTeam.id,
      techId: tech1.id,
      type: "PREVENTIVE",
      status: "SCHEDULED",
      daysOffset: 14,
    },
    {
      subject: "Equipment warranty claim documentation",
      equipmentId: equipmentList[3].id,
      teamId: electricalTeam.id,
      techId: null,
      type: "CORRECTIVE",
      status: "NEW",
      daysOffset: 0,
    },
    {
      subject: "Annual compliance inspection program",
      equipmentId: equipmentList[4].id,
      teamId: mechanicalTeam.id,
      techId: tech2.id,
      type: "PREVENTIVE",
      status: "COMPLETED",
      daysOffset: -35,
    },
  ]

  for (const req of requestsData) {
    const scheduledDate = new Date(today)
    scheduledDate.setDate(scheduledDate.getDate() + req.daysOffset)

    await prisma.maintenanceRequest.create({
      data: {
        subject: req.subject,
        equipmentId: req.equipmentId,
        maintenanceTeamId: req.teamId,
        technicianId: req.techId,
        createdById: user1.id,
        requestType: req.type,
        status: req.status,
        scheduledDate: scheduledDate,
        durationHours: req.type === "CORRECTIVE" ? 6 : 3,
      },
    })
  }

  console.log("✓ Created 20 maintenance requests with varied statuses and types")

  console.log("✅ Seed completed successfully!")
  console.log("\n📋 Demo Credentials:")
  console.log("  Admin:      admin@gearguard.com / admin123")
  console.log("  Tech Teams: sarah@gearguard.com / sarah123 (Electrical)")
  console.log("              mike@gearguard.com / mike123 (Mechanical)")
  console.log("              jessica@gearguard.com / jessica123 (Pneumatic)")
  console.log("              robert@gearguard.com / robert123 (HVAC)")
  console.log("              linda@gearguard.com / linda123 (Avionics)")
  console.log("  Users:      david@gearguard.com / david123")
  console.log("\n📊 Database Seeded With:")
  console.log("  ✓ 5 Maintenance Teams")
  console.log("  ✓ 12 Users (1 Admin, 7 Technicians, 4 Regular Users)")
  console.log("  ✓ 12 Equipment Items (1 Scrapped)")
  console.log("  ✓ 20 Maintenance Requests (varied statuses & priorities)")
}

main().catch((e) => {
  console.error("❌ Seed failed:", e)
  process.exit(1)
})
