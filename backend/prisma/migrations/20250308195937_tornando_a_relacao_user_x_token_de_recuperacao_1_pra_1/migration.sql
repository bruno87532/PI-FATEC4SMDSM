/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `RecoverPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecoverPassword_userId_key" ON "RecoverPassword"("userId");
