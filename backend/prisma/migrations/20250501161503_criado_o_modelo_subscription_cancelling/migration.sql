-- CreateTable
CREATE TABLE "subscriptionCancelling" (
    "id" TEXT NOT NULL,
    "idSubscription" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "subscriptionCancelling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscriptionCancelling" ADD CONSTRAINT "subscriptionCancelling_idSubscription_fkey" FOREIGN KEY ("idSubscription") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
