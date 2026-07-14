/*
  Warnings:

  - You are about to drop the column `price` on the `Fueling` table. All the data in the column will be lost.
  - Added the required column `pricePerLiter` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicianId` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Fueling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usageType` to the `Fueling` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fueling" DROP COLUMN "price",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "pricePerLiter" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "technicianId" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usageType" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Fueling" ADD CONSTRAINT "Fueling_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
