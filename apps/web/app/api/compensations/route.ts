import { apiErrorResponse } from "@/server/errors"
import { getExplorerData } from "@/server/services/compensation-service"
import { parseExplorerQuery } from "@/server/validation/schemas"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const filters = parseExplorerQuery(new URL(request.url).searchParams)
    const result = await getExplorerData(filters)
    return Response.json(result)
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
