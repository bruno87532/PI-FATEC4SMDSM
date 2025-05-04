/*
  Warnings:

  - You are about to drop the `Recover` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptionCancelling` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recover" DROP CONSTRAINT "Recover_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptionCancelling" DROP CONSTRAINT "subscriptionCancelling_idSubscription_fkey";

-- DropTable
DROP TABLE "Recover";

-- DropTable
DROP TABLE "subscriptionCancelling";

-- DropEnum
DROP TYPE "typeRecover";

-- CreateTable
CREATE TABLE "RecoverPassword" (
    "id" TEXT NOT NULL,
    "randomCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiredCode" TIMESTAMP(3) NOT NULL,
    "isActivate" TIMESTAMP(3),

    CONSTRAINT "RecoverPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionCancelling" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idSubscription" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "SubscriptionCancelling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecoverPassword_randomCode_key" ON "RecoverPassword"("randomCode");

-- CreateIndex
CREATE UNIQUE INDEX "RecoverPassword_userId_key" ON "RecoverPassword"("userId");

-- AddForeignKey
ALTER TABLE "RecoverPassword" ADD CONSTRAINT "RecoverPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionCancelling" ADD CONSTRAINT "SubscriptionCancelling_idSubscription_fkey" FOREIGN KEY ("idSubscription") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
