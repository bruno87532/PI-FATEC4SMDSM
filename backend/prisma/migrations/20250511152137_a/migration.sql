/*
  Warnings:

  - Added the required column `idAdvertiser` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_idUser_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "idAdvertiser" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_idAdvertiser_fkey" FOREIGN KEY ("idAdvertiser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
