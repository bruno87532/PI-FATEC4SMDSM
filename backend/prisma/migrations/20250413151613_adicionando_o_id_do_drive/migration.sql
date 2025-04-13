/*
  Warnings:

  - A unique constraint covering the columns `[idDrive]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idDrive` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "idDrive" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_idDrive_key" ON "Product"("idDrive");
