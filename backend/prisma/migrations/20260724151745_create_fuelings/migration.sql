/*
  Warnings:

  - You are about to drop the column `pricePerLiter` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `technicianId` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Fueling` table. All the data in the column will be lost.
  - You are about to drop the column `usageType` on the `Fueling` table. All the data in the column will be lost.
  - You are about to alter the column `odometer` on the `Fueling` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `date` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValue` to the `Fueling` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fueling" DROP CONSTRAINT "Fueling_technicianId_fkey";

-- DropIndex
DROP INDEX "Fueling_technicianId_createdAt_idx";

-- DropIndex
DROP INDEX "Fueling_vehicleId_createdAt_idx";

-- AlterTable
ALTER TABLE "Fueling" DROP COLUMN "pricePerLiter",
DROP COLUMN "technicianId",
DROP COLUMN "totalPrice",
DROP COLUMN "updatedAt",
DROP COLUMN "usageType",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fuelType" "FuelType" NOT NULL,
ADD COLUMN     "gasStation" TEXT,
ADD COLUMN     "responsible" TEXT,
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "odometer" SET DATA TYPE INTEGER;
