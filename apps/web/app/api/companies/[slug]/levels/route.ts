import { apiErrorResponse } from "@/server/errors"
import { getCompanyDetail } from "@/server/services/company-service"
import { companyDetailQuerySchema } from "@/server/validation/schemas"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const query = companyDetailQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    )
    const detail = await getCompanyDetail(slug, query.role, query.location)
    return Response.json({ data: detail.levels })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
