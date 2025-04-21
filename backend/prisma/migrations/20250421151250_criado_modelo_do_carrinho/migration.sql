-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CartProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CartProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_idUser_key" ON "Cart"("idUser");

-- CreateIndex
CREATE INDEX "_CartProducts_B_index" ON "_CartProducts"("B");

-- AddForeignKey
ALTER TABLE "_CartProducts" ADD CONSTRAINT "_CartProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartProducts" ADD CONSTRAINT "_CartProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
