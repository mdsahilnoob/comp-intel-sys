CREATE TYPE "CompanyStatus" AS ENUM ('STARTUP', 'GROWTH', 'PUBLIC', 'ACQUIRED');

ALTER TABLE "Company"
ADD COLUMN "description" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "country" TEXT,
ADD COLUMN "foundedYear" INTEGER,
ADD COLUMN "status" "CompanyStatus",
ADD COLUMN "popularityScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "capabilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "isAiCompany" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompanyCategory" (
    "companyId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CompanyCategory_pkey" PRIMARY KEY ("companyId", "categoryId")
);

CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_name_idx" ON "Category"("name");
CREATE INDEX "Company_isAiCompany_idx" ON "Company"("isAiCompany");
CREATE INDEX "Company_country_idx" ON "Company"("country");
CREATE INDEX "Company_status_idx" ON "Company"("status");
CREATE INDEX "Company_popularityScore_idx" ON "Company"("popularityScore");
CREATE INDEX "CompanyCategory_categoryId_idx" ON "CompanyCategory"("categoryId");
CREATE UNIQUE INDEX "Product_companyId_slug_key" ON "Product"("companyId", "slug");
CREATE INDEX "Product_companyId_idx" ON "Product"("companyId");

ALTER TABLE "CompanyCategory"
ADD CONSTRAINT "CompanyCategory_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompanyCategory"
ADD CONSTRAINT "CompanyCategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
