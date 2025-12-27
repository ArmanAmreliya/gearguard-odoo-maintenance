// In-memory database for preview
const mockDb = {
  users: [
    {
      id: "1",
      email: "admin@test.com",
      password: "$2b$10$YQvVP1zXjT1xYfTvFmKBDud5kN5S8X5VqYX5zZ5V5V5", // password: admin123
      name: "Admin User",
      role: "ADMIN" as const,
      teamId: null,
      createdAt: new Date(),
    },
    {
      id: "2",
      email: "tech@test.com",
      password: "$2b$10$YQvVP1zXjT1xYfTvFmKBDud5kN5S8X5VqYX5zZ5V5V5", // password: admin123
      name: "John Technician",
      role: "TECHNICIAN" as const,
      teamId: "t1",
      createdAt: new Date(),
    },
    {
      id: "3",
      email: "user@test.com",
      password: "$2b$10$YQvVP1zXjT1xYfTvFmKBDud5kN5S8X5VqYX5zZ5V5V5", // password: admin123
      name: "Jane User",
      role: "USER" as const,
      teamId: null,
      createdAt: new Date(),
    },
  ] as any[],
  teams: [
    {
      id: "t1",
      name: "Mechanical Team",
      description: "Handles mechanical equipment repairs",
      createdAt: new Date(),
    },
    {
      id: "t2",
      name: "Electrical Team",
      description: "Handles electrical equipment repairs",
      createdAt: new Date(),
    },
  ] as any[],
  equipment: [
    {
      id: "e1",
      name: "CNC Machine A",
      type: "CNC",
      maintenanceTeamId: "t1",
      lastMaintenanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      maintenanceIntervalDays: 90,
      status: "ACTIVE" as const,
      createdAt: new Date(),
    },
    {
      id: "e2",
      name: "Hydraulic Press B",
      type: "Press",
      maintenanceTeamId: "t1",
      lastMaintenanceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      maintenanceIntervalDays: 60,
      status: "ACTIVE" as const,
      createdAt: new Date(),
    },
    {
      id: "e3",
      name: "Industrial Conveyor",
      type: "Conveyor",
      maintenanceTeamId: "t2",
      lastMaintenanceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      maintenanceIntervalDays: 120,
      status: "ACTIVE" as const,
      createdAt: new Date(),
    },
  ] as any[],
  requests: [
    {
      id: "r1",
      equipmentId: "e1",
      type: "PREVENTIVE" as const,
      status: "NEW" as const,
      technicianId: "2",
      maintenanceTeamId: "t1",
      description: "Regular maintenance",
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ] as any[],
}

export const prisma = {
  user: {
    findUnique: async ({ where }: any) => {
      if (where.email) {
        return mockDb.users.find((u) => u.email === where.email) || null
      }
      return mockDb.users.find((u) => u.id === where.id) || null
    },
    findMany: async () => mockDb.users,
    create: async ({ data }: any) => {
      const user = { id: String(mockDb.users.length + 1), ...data, createdAt: new Date() }
      mockDb.users.push(user)
      return user
    },
  },
  equipment: {
    findMany: async () => mockDb.equipment,
    findUnique: async ({ where }: any) => mockDb.equipment.find((e) => e.id === where.id) || null,
    create: async ({ data }: any) => {
      const equipment = { id: `e${mockDb.equipment.length + 1}`, ...data, createdAt: new Date() }
      mockDb.equipment.push(equipment)
      return equipment
    },
    update: async ({ where, data }: any) => {
      const idx = mockDb.equipment.findIndex((e) => e.id === where.id)
      if (idx >= 0) {
        mockDb.equipment[idx] = { ...mockDb.equipment[idx], ...data }
        return mockDb.equipment[idx]
      }
      return null
    },
  },
  maintenanceTeam: {
    findMany: async () => mockDb.teams,
    findUnique: async ({ where }: any) => mockDb.teams.find((t) => t.id === where.id) || null,
  },
  maintenanceRequest: {
    findMany: async () => mockDb.requests,
    findUnique: async ({ where }: any) => mockDb.requests.find((r) => r.id === where.id) || null,
    create: async ({ data }: any) => {
      const request = {
        id: `r${mockDb.requests.length + 1}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockDb.requests.push(request)
      return request
    },
    update: async ({ where, data }: any) => {
      const idx = mockDb.requests.findIndex((r) => r.id === where.id)
      if (idx >= 0) {
        mockDb.requests[idx] = { ...mockDb.requests[idx], ...data, updatedAt: new Date() }
        return mockDb.requests[idx]
      }
      return null
    },
  },
} as any
