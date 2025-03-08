-- CreateTable
CREATE TABLE "RecoverPassword" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecoverPassword_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecoverPassword" ADD CONSTRAINT "RecoverPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
