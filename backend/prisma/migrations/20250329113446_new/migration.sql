-- CreateEnum
CREATE TYPE "typeUser" AS ENUM ('ADVERTISER', 'COMMON');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "typeUser" "typeUser" NOT NULL DEFAULT 'COMMON';

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "idPlan" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idPrice" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_idPrice_key" ON "Plan"("idPrice");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idPlan_fkey" FOREIGN KEY ("idPlan") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
