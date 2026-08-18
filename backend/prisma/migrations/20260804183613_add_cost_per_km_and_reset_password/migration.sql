-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "costPerKm" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3);
