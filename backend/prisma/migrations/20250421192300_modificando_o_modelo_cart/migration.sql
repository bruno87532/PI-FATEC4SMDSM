/*
  Warnings:

  - You are about to drop the column `price` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the `_CartProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CartProducts" DROP CONSTRAINT "_CartProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartProducts" DROP CONSTRAINT "_CartProducts_B_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "price",
ADD COLUMN     "totalPrice" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_CartProducts";

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "idCart" TEXT NOT NULL,
    "idProduct" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_idCart_fkey" FOREIGN KEY ("idCart") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
