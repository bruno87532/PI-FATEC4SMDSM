/*
  Warnings:

  - The values [email,password] on the enum `typeRecover` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typeRecover_new" AS ENUM ('EMAIL', 'PASSWORD');
ALTER TABLE "Recover" ALTER COLUMN "type" TYPE "typeRecover_new" USING ("type"::text::"typeRecover_new");
ALTER TYPE "typeRecover" RENAME TO "typeRecover_old";
ALTER TYPE "typeRecover_new" RENAME TO "typeRecover";
DROP TYPE "typeRecover_old";
COMMIT;
