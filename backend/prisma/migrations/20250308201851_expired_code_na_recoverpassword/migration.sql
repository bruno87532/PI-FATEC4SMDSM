/*
  Warnings:

  - Added the required column `expiredCode` to the `RecoverPassword` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecoverPassword" ADD COLUMN     "expiredCode" TIMESTAMP(3) NOT NULL;
