import { prisma } from "@/lib/db"

export async function getEquipmentWithRequests(equipmentId: string) {
  return prisma.equipment.findUnique({
    where: { id: equipmentId },
    include: {
      maintenanceTeam: true,
      requests: {
        include: {
          technician: true,
          createdBy: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getTeamEquipment(teamId: string) {
  return prisma.equipment.findMany({
    where: { maintenanceTeamId: teamId },
    include: {
      maintenanceTeam: true,
      _count: {
        select: { requests: true },
      },
    },
  })
}
