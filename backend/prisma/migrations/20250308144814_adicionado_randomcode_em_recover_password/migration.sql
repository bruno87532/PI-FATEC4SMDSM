/*
  Warnings:

  - A unique constraint covering the columns `[randomCode]` on the table `RecoverPassword` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `randomCode` to the `RecoverPassword` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecoverPassword" ADD COLUMN     "randomCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecoverPassword_randomCode_key" ON "RecoverPassword"("randomCode");
