import { prisma } from "@/lib/auth"

export interface Equipment {
  id: string
  name: string
  location: string
  installDate: Date | null
  lastMaintenanceDate: Date | null
  nextMaintenanceDate: Date | null
  maintenanceInterval: number | null
  isScrapped: boolean
  createdAt: Date
  updatedAt: Date
  maintenanceTeam: {
    id: string
    name: string
  } | null
  maintenanceTeamId: string | null
  requestCount: number
}

export async function getAllEquipment(): Promise<Equipment[]> {
  const equipment = await prisma.equipment.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      installDate: true,
      lastMaintenanceDate: true,
      nextMaintenanceDate: true,
      maintenanceInterval: true,
      isScrapped: true,
      createdAt: true,
      updatedAt: true,
      maintenanceTeamId: true,
      maintenanceTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      maintenanceRequests: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return equipment.map((eq) => ({
    id: eq.id,
    name: eq.name,
    location: eq.location,
    installDate: eq.installDate,
    lastMaintenanceDate: eq.lastMaintenanceDate,
    nextMaintenanceDate: eq.nextMaintenanceDate,
    maintenanceInterval: eq.maintenanceInterval,
    isScrapped: eq.isScrapped,
    createdAt: eq.createdAt,
    updatedAt: eq.updatedAt,
    maintenanceTeam: eq.maintenanceTeam,
    maintenanceTeamId: eq.maintenanceTeamId,
    requestCount: eq.maintenanceRequests.length,
  }))
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      location: true,
      installDate: true,
      lastMaintenanceDate: true,
      nextMaintenanceDate: true,
      maintenanceInterval: true,
      isScrapped: true,
      createdAt: true,
      updatedAt: true,
      maintenanceTeamId: true,
      maintenanceTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      maintenanceRequests: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!equipment) return null

  return {
    id: equipment.id,
    name: equipment.name,
    location: equipment.location,
    installDate: equipment.installDate,
    lastMaintenanceDate: equipment.lastMaintenanceDate,
    nextMaintenanceDate: equipment.nextMaintenanceDate,
    maintenanceInterval: equipment.maintenanceInterval,
    isScrapped: equipment.isScrapped,
    createdAt: equipment.createdAt,
    updatedAt: equipment.updatedAt,
    maintenanceTeam: equipment.maintenanceTeam,
    maintenanceTeamId: equipment.maintenanceTeamId,
    requestCount: equipment.maintenanceRequests.length,
  }
}

export async function getActiveEquipment(): Promise<Equipment[]> {
  const equipment = await prisma.equipment.findMany({
    where: {
      isScrapped: false,
    },
    select: {
      id: true,
      name: true,
      location: true,
      installDate: true,
      lastMaintenanceDate: true,
      nextMaintenanceDate: true,
      maintenanceInterval: true,
      isScrapped: true,
      createdAt: true,
      updatedAt: true,
      maintenanceTeamId: true,
      maintenanceTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      maintenanceRequests: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return equipment.map((eq) => ({
    id: eq.id,
    name: eq.name,
    location: eq.location,
    installDate: eq.installDate,
    lastMaintenanceDate: eq.lastMaintenanceDate,
    nextMaintenanceDate: eq.nextMaintenanceDate,
    maintenanceInterval: eq.maintenanceInterval,
    isScrapped: eq.isScrapped,
    createdAt: eq.createdAt,
    updatedAt: eq.updatedAt,
    maintenanceTeam: eq.maintenanceTeam,
    maintenanceTeamId: eq.maintenanceTeamId,
    requestCount: eq.maintenanceRequests.length,
  }))
}

export async function getHighRiskEquipment(): Promise<Equipment[]> {
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const equipment = await prisma.equipment.findMany({
    where: {
      AND: [
        { isScrapped: false },
        {
          OR: [
            {
              nextMaintenanceDate: {
                lte: sevenDaysFromNow,
                gte: now,
              },
            },
            {
              nextMaintenanceDate: {
                lt: now,
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      location: true,
      installDate: true,
      lastMaintenanceDate: true,
      nextMaintenanceDate: true,
      maintenanceInterval: true,
      isScrapped: true,
      createdAt: true,
      updatedAt: true,
      maintenanceTeamId: true,
      maintenanceTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      maintenanceRequests: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      nextMaintenanceDate: "asc",
    },
  })

  return equipment.map((eq) => ({
    id: eq.id,
    name: eq.name,
    location: eq.location,
    installDate: eq.installDate,
    lastMaintenanceDate: eq.lastMaintenanceDate,
    nextMaintenanceDate: eq.nextMaintenanceDate,
    maintenanceInterval: eq.maintenanceInterval,
    isScrapped: eq.isScrapped,
    createdAt: eq.createdAt,
    updatedAt: eq.updatedAt,
    maintenanceTeam: eq.maintenanceTeam,
    maintenanceTeamId: eq.maintenanceTeamId,
    requestCount: eq.maintenanceRequests.length,
  }))
}

export async function createEquipment(data: {
  name: string
  location: string
  maintenanceTeamId: string
  installDate?: Date
  maintenanceInterval?: number
}) {
  const equipment = await prisma.equipment.create({
    data: {
      name: data.name,
      location: data.location,
      maintenanceTeamId: data.maintenanceTeamId,
      installDate: data.installDate || new Date(),
      maintenanceInterval: data.maintenanceInterval || 30,
      isScrapped: false,
    },
    select: {
      id: true,
      name: true,
      location: true,
      installDate: true,
      lastMaintenanceDate: true,
      nextMaintenanceDate: true,
      maintenanceInterval: true,
      isScrapped: true,
      createdAt: true,
      updatedAt: true,
      maintenanceTeamId: true,
      maintenanceTeam: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return {
    ...equipment,
    requestCount: 0,
  }
}

export async function updateEquipment(
  id: string,
  data: {
    name?: string
    location?: string
    maintenanceTeamId?: string
    installDate?: Date
    maintenanceInterval?: number
    isScrapped?: boolean
  }
) {
  const equipment = await prisma.equipment.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      location: true,
      installDate: true,
      lastMaintenanceDate: true,
      nextMaintenanceDate: true,
      maintenanceInterval: true,
      isScrapped: true,
      createdAt: true,
      updatedAt: true,
      maintenanceTeamId: true,
      maintenanceTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      maintenanceRequests: {
        select: {
          id: true,
        },
      },
    },
  })

  return {
    id: equipment.id,
    name: equipment.name,
    location: equipment.location,
    installDate: equipment.installDate,
    lastMaintenanceDate: equipment.lastMaintenanceDate,
    nextMaintenanceDate: equipment.nextMaintenanceDate,
    maintenanceInterval: equipment.maintenanceInterval,
    isScrapped: equipment.isScrapped,
    createdAt: equipment.createdAt,
    updatedAt: equipment.updatedAt,
    maintenanceTeam: equipment.maintenanceTeam,
    maintenanceTeamId: equipment.maintenanceTeamId,
    requestCount: equipment.maintenanceRequests.length,
  }
}

export async function deleteEquipment(id: string) {
  await prisma.equipment.delete({
    where: { id },
  })
}
