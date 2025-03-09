/*
  Warnings:

  - You are about to drop the `RecoverPassword` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "typeRecover" AS ENUM ('email', 'password');

-- DropForeignKey
ALTER TABLE "RecoverPassword" DROP CONSTRAINT "RecoverPassword_userId_fkey";

-- DropTable
DROP TABLE "RecoverPassword";

-- CreateTable
CREATE TABLE "Recover" (
    "id" TEXT NOT NULL,
    "randomCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiredCode" TIMESTAMP(3) NOT NULL,
    "type" "typeRecover" NOT NULL,
    "isActivate" TIMESTAMP(3),

    CONSTRAINT "Recover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recover_randomCode_key" ON "Recover"("randomCode");

-- CreateIndex
CREATE UNIQUE INDEX "Recover_userId_key" ON "Recover"("userId");

-- AddForeignKey
ALTER TABLE "Recover" ADD CONSTRAINT "Recover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
