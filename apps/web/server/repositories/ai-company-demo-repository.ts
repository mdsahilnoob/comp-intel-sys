import {
  AI_COMPANY_CATEGORIES,
  AI_COMPANY_DEFINITIONS,
  getAiCompanyLogoUrl,
  type AiCompanyCategory,
  type AiCompanyDefinition,
  type AiCompanyDetailData,
  type AiCompanyDirectoryEntry,
  type AiCompanyQuery,
} from "@/server/ai-companies";

function getCategories(definition: AiCompanyDefinition) {
  return definition.categories.map((slug) => {
    const category = AI_COMPANY_CATEGORIES.find((item) => item.slug === slug);
    return { name: category?.name ?? slug, slug };
  });
}

function toDirectoryEntry(
  definition: AiCompanyDefinition,
  index: number,
): AiCompanyDirectoryEntry {
  return {
    id: 10_000 + index,
    name: definition.name,
    slug: definition.slug,
    description: definition.description,
    logoUrl: getAiCompanyLogoUrl(definition.website),
    city: definition.city,
    country: definition.country,
    foundedYear: definition.foundedYear,
    status: definition.status,
    categories: getCategories(definition),
    capabilities: definition.capabilities,
    productCount: definition.products.length,
    featured: definition.featured,
  };
}

function matchesSearch(definition: AiCompanyDefinition, search?: string) {
  if (!search?.trim()) {
    return true;
  }

  const query = search.trim().toLocaleLowerCase("en-US");
  return [
    definition.name,
    definition.slug,
    definition.description,
    definition.city,
    definition.country,
    ...definition.capabilities,
    ...definition.products.flatMap((item) => [
      item.name,
      item.description,
      item.category,
    ]),
  ].some((value) => value.toLocaleLowerCase("en-US").includes(query));
}

function getCategoryOverlap(
  left: AiCompanyDefinition,
  right: AiCompanyDefinition,
) {
  const rightCategories = new Set(right.categories);
  return left.categories.reduce(
    (overlap, category) => overlap + (rightCategories.has(category) ? 1 : 0),
    0,
  );
}

function sortDefinitions(
  definitions: AiCompanyDefinition[],
  sort: AiCompanyQuery["sort"],
) {
  return [...definitions].sort((left, right) => {
    const primary = (() => {
      switch (sort) {
        case "newest":
          return right.foundedYear - left.foundedYear;
        case "name":
          return left.name.localeCompare(right.name);
        case "products":
          return right.products.length - left.products.length;
        case "popular":
        default:
          return right.popularityScore - left.popularityScore;
      }
    })();

    return (
      primary ||
      left.name.localeCompare(right.name) ||
      left.slug.localeCompare(right.slug)
    );
  });
}

function findDefinition(slug: string) {
  return AI_COMPANY_DEFINITIONS.find((definition) => definition.slug === slug);
}

export async function getDemoAiCompanyDirectory(query: AiCompanyQuery) {
  const filtered = AI_COMPANY_DEFINITIONS.filter((definition) => {
    if (!matchesSearch(definition, query.search)) return false;
    if (query.category && !definition.categories.includes(query.category))
      return false;
    if (query.country && definition.country !== query.country) return false;
    if (query.status && definition.status !== query.status) return false;
    return true;
  });
  const sorted = sortDefinitions(filtered, query.sort);
  const total = sorted.length;
  const start = (query.page - 1) * query.limit;

  return {
    data: sorted
      .slice(start, start + query.limit)
      .map((definition) =>
        toDirectoryEntry(
          definition,
          AI_COMPANY_DEFINITIONS.indexOf(definition),
        ),
      ),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

export async function getDemoAiCompanyCategories(): Promise<
  AiCompanyCategory[]
> {
  return AI_COMPANY_CATEGORIES.map((category) => ({
    ...category,
    count: AI_COMPANY_DEFINITIONS.filter((definition) =>
      definition.categories.includes(category.slug),
    ).length,
  }));
}

export async function getDemoAiCompanyDetail(
  slug: string,
): Promise<AiCompanyDetailData | null> {
  const definition = findDefinition(slug);
  if (!definition) {
    return null;
  }

  const definitionIndex = AI_COMPANY_DEFINITIONS.indexOf(definition);
  const related = AI_COMPANY_DEFINITIONS.filter(
    (candidate) => candidate.slug !== slug,
  )
    .sort((left, right) => {
      const overlap =
        getCategoryOverlap(definition, right) -
        getCategoryOverlap(definition, left);
      return (
        overlap ||
        right.popularityScore - left.popularityScore ||
        left.name.localeCompare(right.name)
      );
    })
    .slice(0, 4);

  return {
    ...toDirectoryEntry(definition, definitionIndex),
    website: definition.website,
    products: definition.products,
    relatedCompanies: related.map((item) =>
      toDirectoryEntry(item, AI_COMPANY_DEFINITIONS.indexOf(item)),
    ),
  };
}
