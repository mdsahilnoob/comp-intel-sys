-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompanyAlias" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "alias" TEXT NOT NULL,
    "normalizedAlias" TEXT NOT NULL,
    CONSTRAINT "CompanyAlias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoleAlias" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "alias" TEXT NOT NULL,
    "normalizedAlias" TEXT NOT NULL,
    CONSTRAINT "RoleAlias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CareerLevel" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    CONSTRAINT "CareerLevel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompanyLevel" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "careerLevelId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT,
    "rank" INTEGER NOT NULL,
    "minYearsExperience" INTEGER,
    "maxYearsExperience" INTEGER,
    CONSTRAINT "CompanyLevel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompensationSubmission" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "companyLevelId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "baseSalary" INTEGER NOT NULL,
    "stockAnnual" INTEGER NOT NULL DEFAULT 0,
    "bonusAnnual" INTEGER NOT NULL DEFAULT 0,
    "totalCompensation" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "yearsExperience" INTEGER NOT NULL,
    "compensationYear" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'synthetic-demo',
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CompensationSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
CREATE INDEX "Company_name_idx" ON "Company"("name");
CREATE UNIQUE INDEX "CompanyAlias_normalizedAlias_key" ON "CompanyAlias"("normalizedAlias");
CREATE INDEX "CompanyAlias_companyId_idx" ON "CompanyAlias"("companyId");
CREATE UNIQUE INDEX "Role_slug_key" ON "Role"("slug");
CREATE INDEX "Role_name_idx" ON "Role"("name");
CREATE UNIQUE INDEX "RoleAlias_normalizedAlias_key" ON "RoleAlias"("normalizedAlias");
CREATE INDEX "RoleAlias_roleId_idx" ON "RoleAlias"("roleId");
CREATE UNIQUE INDEX "CareerLevel_code_key" ON "CareerLevel"("code");
CREATE UNIQUE INDEX "CareerLevel_rank_key" ON "CareerLevel"("rank");
CREATE INDEX "CareerLevel_rank_idx" ON "CareerLevel"("rank");
CREATE UNIQUE INDEX "CompanyLevel_companyId_code_key" ON "CompanyLevel"("companyId", "code");
CREATE INDEX "CompanyLevel_companyId_idx" ON "CompanyLevel"("companyId");
CREATE INDEX "CompanyLevel_careerLevelId_idx" ON "CompanyLevel"("careerLevelId");
CREATE INDEX "CompanyLevel_companyId_careerLevelId_idx" ON "CompanyLevel"("companyId", "careerLevelId");
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");
CREATE UNIQUE INDEX "Location_city_country_key" ON "Location"("city", "country");
CREATE INDEX "Location_country_city_idx" ON "Location"("country", "city");
CREATE UNIQUE INDEX "CompensationSubmission_fingerprint_key" ON "CompensationSubmission"("fingerprint");
CREATE INDEX "CompensationSubmission_companyId_idx" ON "CompensationSubmission"("companyId");
CREATE INDEX "CompensationSubmission_roleId_idx" ON "CompensationSubmission"("roleId");
CREATE INDEX "CompensationSubmission_companyLevelId_idx" ON "CompensationSubmission"("companyLevelId");
CREATE INDEX "CompensationSubmission_locationId_idx" ON "CompensationSubmission"("locationId");
CREATE INDEX "CompensationSubmission_totalCompensation_idx" ON "CompensationSubmission"("totalCompensation");
CREATE INDEX "CompensationSubmission_createdAt_idx" ON "CompensationSubmission"("createdAt");
CREATE INDEX "CompensationSubmission_companyId_roleId_locationId_idx" ON "CompensationSubmission"("companyId", "roleId", "locationId");
CREATE INDEX "CompensationSubmission_roleId_locationId_totalCompensation_idx" ON "CompensationSubmission"("roleId", "locationId", "totalCompensation");

ALTER TABLE "CompanyAlias" ADD CONSTRAINT "CompanyAlias_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleAlias" ADD CONSTRAINT "RoleAlias_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompanyLevel" ADD CONSTRAINT "CompanyLevel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompanyLevel" ADD CONSTRAINT "CompanyLevel_careerLevelId_fkey" FOREIGN KEY ("careerLevelId") REFERENCES "CareerLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompensationSubmission" ADD CONSTRAINT "CompensationSubmission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompensationSubmission" ADD CONSTRAINT "CompensationSubmission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompensationSubmission" ADD CONSTRAINT "CompensationSubmission_companyLevelId_fkey" FOREIGN KEY ("companyLevelId") REFERENCES "CompanyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompensationSubmission" ADD CONSTRAINT "CompensationSubmission_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
