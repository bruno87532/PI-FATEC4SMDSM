-- CreateEnum
CREATE TYPE "typeRecover" AS ENUM ('EMAIL', 'PASSWORD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(11),
    "password" TEXT,
    "randomCode" VARCHAR(6),
    "randomCodeExpiration" TIMESTAMP(3) NOT NULL,
    "isActivate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recover_randomCode_key" ON "Recover"("randomCode");

-- CreateIndex
CREATE UNIQUE INDEX "Recover_userId_key" ON "Recover"("userId");

-- AddForeignKey
ALTER TABLE "Recover" ADD CONSTRAINT "Recover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
