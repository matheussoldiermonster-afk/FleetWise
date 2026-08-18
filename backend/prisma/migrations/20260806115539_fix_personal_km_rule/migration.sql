/*
  Warnings:

  - You are about to drop the column `breakEndKm` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `breakEndTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `breakStartKm` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `breakStartTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `finalTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `initialTime` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "breakEndKm",
DROP COLUMN "breakEndTime",
DROP COLUMN "breakStartKm",
DROP COLUMN "breakStartTime",
DROP COLUMN "finalTime",
DROP COLUMN "initialTime";
