import { apiErrorResponse } from "@/server/errors";
import { getAiCompanyCategories } from "@/server/services/company-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ data: await getAiCompanyCategories() });
  } catch (error: unknown) {
    return apiErrorResponse(error);
  }
}
