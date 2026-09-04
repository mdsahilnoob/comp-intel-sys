import { apiErrorResponse } from "@/server/errors"
import { getCompanyDirectory } from "@/server/services/company-service"
import { companiesQuerySchema } from "@/server/validation/schemas"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const query = companiesQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    )
    return Response.json({ data: await getCompanyDirectory(query.search) })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
