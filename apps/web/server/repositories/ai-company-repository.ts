import { Prisma } from "@prisma/client";

import {
  AI_COMPANY_CATEGORIES,
  type AiCompanyCategory,
  type AiCompanyCountryCode,
  type AiCompanyDetailData,
  type AiCompanyDirectoryEntry,
  type AiCompanyQuery,
  type AiCompanyStatus,
} from "@/server/ai-companies";
import { getPrismaClient } from "@/lib/db";
import {
  getDemoAiCompanyCategories,
  getDemoAiCompanyDetail,
  getDemoAiCompanyDirectory,
} from "@/server/repositories/ai-company-demo-repository";

type DirectoryCompany = Prisma.CompanyGetPayload<{
  include: {
    categories: { include: { category: true } };
    _count: { select: { products: true } };
  };
}>;

type DetailCompany = Prisma.CompanyGetPayload<{
  include: {
    categories: { include: { category: true } };
    products: true;
    _count: { select: { products: true } };
  };
}>;

function toDirectoryEntry(company: DirectoryCompany): AiCompanyDirectoryEntry {
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    description:
      company.description ??
      "An AI company building products and infrastructure.",
    logoUrl: company.logoUrl,
    city: company.city ?? "—",
    country: (company.country ?? "US") as AiCompanyCountryCode,
    foundedYear: company.foundedYear ?? 0,
    status: (company.status ?? "GROWTH") as AiCompanyStatus,
    categories: company.categories.map(({ category }) => ({
      name: category.name,
      slug: category.slug,
    })),
    capabilities: company.capabilities,
    productCount: company._count.products,
    featured: company.featured,
  };
}

function getWhere(query: AiCompanyQuery): Prisma.CompanyWhereInput {
  const normalizedSearch = query.search?.trim();

  return {
    isAiCompany: true,
    ...(normalizedSearch
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" } },
            { slug: { contains: normalizedSearch, mode: "insensitive" } },
            {
              description: { contains: normalizedSearch, mode: "insensitive" },
            },
            { city: { contains: normalizedSearch, mode: "insensitive" } },
            { country: { contains: normalizedSearch, mode: "insensitive" } },
            {
              products: {
                some: {
                  name: { contains: normalizedSearch, mode: "insensitive" },
                },
              },
            },
            {
              products: {
                some: {
                  description: {
                    contains: normalizedSearch,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {}),
    ...(query.category
      ? { categories: { some: { category: { slug: query.category } } } }
      : {}),
    ...(query.country ? { country: query.country } : {}),
    ...(query.status ? { status: query.status } : {}),
  };
}

function getOrderBy(
  query: AiCompanyQuery,
): Prisma.CompanyOrderByWithRelationInput[] {
  switch (query.sort) {
    case "newest":
      return [{ foundedYear: "desc" }, { name: "asc" }];
    case "name":
      return [{ name: "asc" }, { slug: "asc" }];
    case "products":
      return [{ products: { _count: "desc" } }, { name: "asc" }];
    case "popular":
    default:
      return [
        { popularityScore: "desc" },
        { featured: "desc" },
        { name: "asc" },
      ];
  }
}

function getCategoryOverlap(
  company: DirectoryCompany,
  categoryIds: Set<number>,
) {
  return company.categories.reduce(
    (overlap, relation) =>
      overlap + (categoryIds.has(relation.categoryId) ? 1 : 0),
    0,
  );
}

export async function getAiCompanyDirectory(query: AiCompanyQuery) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getDemoAiCompanyDirectory(query);
  }

  const where = getWhere(query);
  const [total, companies] = await Promise.all([
    prisma.company.count({ where }),
    prisma.company.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        _count: { select: { products: true } },
      },
      orderBy: getOrderBy(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return {
    data: companies.map(toDirectoryEntry),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

export async function getAiCompanyCategories(): Promise<AiCompanyCategory[]> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getDemoAiCompanyCategories();
  }

  const categories = await prisma.category.findMany({
    where: { companies: { some: { company: { isAiCompany: true } } } },
    include: {
      companies: {
        where: { company: { isAiCompany: true } },
        select: { companyId: true },
      },
    },
  });
  const bySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );

  return AI_COMPANY_CATEGORIES.map((category) => ({
    ...category,
    count: bySlug.get(category.slug)?.companies.length ?? 0,
  }));
}

export async function getAiCompanyDetail(
  slug: string,
): Promise<AiCompanyDetailData | null> {
  const prisma = getPrismaClient();
  if (!prisma) {
    return getDemoAiCompanyDetail(slug);
  }

  const company = await prisma.company.findFirst({
    where: { slug, isAiCompany: true },
    include: {
      categories: { include: { category: true } },
      products: true,
      _count: { select: { products: true } },
    },
  });
  if (!company) {
    return null;
  }

  const categoryIds = new Set(
    company.categories.map((relation) => relation.categoryId),
  );
  const candidates = await prisma.company.findMany({
    where: {
      isAiCompany: true,
      id: { not: company.id },
      categories: { some: { categoryId: { in: [...categoryIds] } } },
    },
    include: {
      categories: { include: { category: true } },
      _count: { select: { products: true } },
    },
  });
  const related = candidates
    .sort((left, right) => {
      const overlap =
        getCategoryOverlap(right, categoryIds) -
        getCategoryOverlap(left, categoryIds);
      return (
        overlap ||
        right.popularityScore - left.popularityScore ||
        left.name.localeCompare(right.name)
      );
    })
    .slice(0, 4);

  const directory = toDirectoryEntry(company as DetailCompany);
  return {
    ...directory,
    website: company.website ?? "",
    products: company.products.map((product) => ({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category ?? "AI Product",
      url: product.url ?? undefined,
    })),
    relatedCompanies: related.map(toDirectoryEntry),
  };
}
