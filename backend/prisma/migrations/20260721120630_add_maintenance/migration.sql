/*
  Warnings:

  - The `role` column on the `Technician` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[plate,companyId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `usageType` on the `Fueling` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Technician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `fuelType` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('GASOLINE', 'ETHANOL', 'DIESEL', 'FLEX', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('WORK', 'PERSONAL');

-- CreateEnum
CREATE TYPE "TechnicianRole" AS ENUM ('DRIVER', 'TECHNICIAN', 'SUPERVISOR', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('OIL_CHANGE', 'OIL_FILTER', 'AIR_FILTER', 'FUEL_FILTER', 'BRAKE_PADS', 'BRAKE_DISC', 'TIRES', 'BATTERY', 'BELT', 'INSPECTION', 'INSURANCE', 'LICENSING', 'OTHER');

-- DropIndex
DROP INDEX "Vehicle_plate_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Fueling" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "usageType",
ADD COLUMN     "usageType" "UsageType" NOT NULL;

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "TechnicianRole";

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "fuelType",
ADD COLUMN     "fuelType" "FuelType" NOT NULL;

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" SERIAL NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "currentKm" DOUBLE PRECISION NOT NULL,
    "nextKm" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "technicianId" INTEGER,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Maintenance_vehicleId_idx" ON "Maintenance"("vehicleId");

-- CreateIndex
CREATE INDEX "Fueling_vehicleId_createdAt_idx" ON "Fueling"("vehicleId", "createdAt");

-- CreateIndex
CREATE INDEX "Fueling_technicianId_createdAt_idx" ON "Fueling"("technicianId", "createdAt");

-- CreateIndex
CREATE INDEX "Technician_companyId_idx" ON "Technician"("companyId");

-- CreateIndex
CREATE INDEX "Trip_vehicleId_createdAt_idx" ON "Trip"("vehicleId", "createdAt");

-- CreateIndex
CREATE INDEX "Trip_technicianId_createdAt_idx" ON "Trip"("technicianId", "createdAt");

-- CreateIndex
CREATE INDEX "Vehicle_companyId_idx" ON "Vehicle"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_companyId_key" ON "Vehicle"("plate", "companyId");

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;
