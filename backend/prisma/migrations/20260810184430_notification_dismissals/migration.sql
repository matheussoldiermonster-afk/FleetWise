-- CreateTable
CREATE TABLE "NotificationDismissal" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDismissal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationDismissal_companyId_idx" ON "NotificationDismissal"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationDismissal_companyId_key_key" ON "NotificationDismissal"("companyId", "key");
