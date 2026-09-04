import { apiErrorResponse } from "@/server/errors"
import { getCatalog } from "@/server/services/catalog-service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const catalog = await getCatalog()
    return Response.json({ data: catalog.locations })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
