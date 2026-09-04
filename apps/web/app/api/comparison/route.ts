import { apiErrorResponse } from "@/server/errors"
import { getComparisonPageData } from "@/server/services/comparison-service"
import { comparisonQuerySchema } from "@/server/validation/schemas"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const query = comparisonQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    )
    return Response.json({ data: await getComparisonPageData(query) })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
