import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository"

export async function getCatalog() {
  return getCatalogOptionsFromRepository()
}
