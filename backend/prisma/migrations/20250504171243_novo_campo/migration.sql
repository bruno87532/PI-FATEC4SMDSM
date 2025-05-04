/*
  Warnings:

  - A unique constraint covering the columns `[newEmail]` on the table `RecoverEmail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newEmail` to the `RecoverEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecoverEmail" ADD COLUMN     "newEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecoverEmail_newEmail_key" ON "RecoverEmail"("newEmail");
