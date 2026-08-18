-- AlterTable
ALTER TABLE "Fueling" ADD COLUMN     "consumptionRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "breakEndKm" DOUBLE PRECISION,
ADD COLUMN     "breakEndTime" TEXT,
ADD COLUMN     "breakStartKm" DOUBLE PRECISION,
ADD COLUMN     "breakStartTime" TEXT,
ADD COLUMN     "finalTime" TEXT,
ADD COLUMN     "initialTime" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "reimbursable" BOOLEAN NOT NULL DEFAULT false;
