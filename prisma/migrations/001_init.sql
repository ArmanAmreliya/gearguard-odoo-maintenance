-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TECHNICIAN', 'USER');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('CORRECTIVE', 'PREVENTIVE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "teamId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "MaintenanceTeam" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "department" TEXT,
    "assignedEmployee" TEXT,
    "physicalLocation" TEXT,
    "purchaseDate" DATETIME,
    "warrantyExpiry" DATETIME,
    "maintenanceTeamId" TEXT NOT NULL,
    "isScrapped" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_maintenanceTeamId_fkey" FOREIGN KEY ("maintenanceTeamId") REFERENCES "MaintenanceTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "maintenanceTeamId" TEXT NOT NULL,
    "technicianId" TEXT,
    "createdById" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "scheduledDate" DATETIME,
    "durationHours" INTEGER,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaintenanceRequest_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_maintenanceTeamId_fkey" FOREIGN KEY ("maintenanceTeamId") REFERENCES "MaintenanceTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_teamId_idx" ON "User"("teamId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceTeam_name_key" ON "MaintenanceTeam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "Equipment_maintenanceTeamId_idx" ON "Equipment"("maintenanceTeamId");

-- CreateIndex
CREATE INDEX "Equipment_isScrapped_idx" ON "Equipment"("isScrapped");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_equipmentId_idx" ON "MaintenanceRequest"("equipmentId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_maintenanceTeamId_idx" ON "MaintenanceRequest"("maintenanceTeamId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_technicianId_idx" ON "MaintenanceRequest"("technicianId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_createdById_idx" ON "MaintenanceRequest"("createdById");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_scheduledDate_idx" ON "MaintenanceRequest"("scheduledDate");
