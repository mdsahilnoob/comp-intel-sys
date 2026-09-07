import { apiErrorResponse, notFoundError } from "@/server/errors";
import {
  getAiCompanyDetail,
  getCompanyDetail,
} from "@/server/services/company-service";
import { companyDetailQuerySchema } from "@/server/validation/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const aiCompany = await getAiCompanyDetail(slug);
    if (aiCompany) {
      return Response.json({
        data: {
          company: aiCompany,
          products: aiCompany.products,
          relatedCompanies: aiCompany.relatedCompanies,
        },
      });
    }

    const query = companyDetailQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );
    try {
      return Response.json({
        data: await getCompanyDetail(slug, query.role, query.location),
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Company not found") {
        throw notFoundError("Company not found");
      }
      throw error;
    }
  } catch (error: unknown) {
    return apiErrorResponse(error);
  }
}
