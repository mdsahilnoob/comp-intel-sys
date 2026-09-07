import { apiErrorResponse } from "@/server/errors";
import {
  getAiCompanyDirectory,
  getCompanyDirectory,
} from "@/server/services/company-service";
import { companiesQuerySchema } from "@/server/validation/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = companiesQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );
    const result = await getAiCompanyDirectory(query);

    if (
      query.search &&
      !query.category &&
      !query.country &&
      !query.status &&
      result.data.length === 0
    ) {
      const legacyCompanies = await getCompanyDirectory(query.search);
      if (legacyCompanies.length > 0) {
        return Response.json({
          data: legacyCompanies,
          pagination: {
            page: 1,
            limit: legacyCompanies.length,
            total: legacyCompanies.length,
            totalPages: 1,
          },
        });
      }
    }

    return Response.json(result);
  } catch (error: unknown) {
    return apiErrorResponse(error);
  }
}
