-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "promotionalPrice" DROP NOT NULL,
ALTER COLUMN "promotionExpiration" DROP NOT NULL;
