/*
  Warnings:

  - A unique constraint covering the columns `[idStripe]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idStripe` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "idStripe" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_idStripe_key" ON "Subscription"("idStripe");
