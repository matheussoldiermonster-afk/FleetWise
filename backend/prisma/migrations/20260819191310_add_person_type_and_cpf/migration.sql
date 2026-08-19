/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "personType" "PersonType" NOT NULL DEFAULT 'COMPANY';

-- CreateIndex
CREATE UNIQUE INDEX "Company_cpf_key" ON "Company"("cpf");
