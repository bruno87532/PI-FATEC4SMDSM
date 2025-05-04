-- CreateTable
CREATE TABLE "RecoverEmail" (
    "id" TEXT NOT NULL,
    "randomCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiredCode" TIMESTAMP(3) NOT NULL,
    "isActivate" TIMESTAMP(3),

    CONSTRAINT "RecoverEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecoverEmail_randomCode_key" ON "RecoverEmail"("randomCode");

-- CreateIndex
CREATE UNIQUE INDEX "RecoverEmail_userId_key" ON "RecoverEmail"("userId");

-- AddForeignKey
ALTER TABLE "RecoverEmail" ADD CONSTRAINT "RecoverEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
