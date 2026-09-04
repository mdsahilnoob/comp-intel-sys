import type { ExplorerFilters } from "@/server/domain"
import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository"
import { listCompensations } from "@/server/repositories/compensation-repository"

export async function getExplorerData(filters: ExplorerFilters) {
  return listCompensations(filters)
}

export async function getExplorerPageData(filters: ExplorerFilters) {
  const [result, catalog] = await Promise.all([
    getExplorerData(filters),
    getCatalogOptionsFromRepository(),
  ])

  return { result, catalog }
}
