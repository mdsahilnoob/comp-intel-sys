import { apiErrorResponse } from "@/server/errors"
import { assertSubmissionRateLimit } from "@/server/services/submission-rate-limit"
import { createSubmission } from "@/server/services/submission-service"
import { submissionSchema } from "@/server/validation/schemas"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json()
    const parsed = submissionSchema.safeParse(payload)
    if (!parsed.success) {
      return apiErrorResponse(parsed.error)
    }

    const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
    assertSubmissionRateLimit(identifier)
    const result = await createSubmission(parsed.data)
    return Response.json({ data: result }, { status: 201 })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
