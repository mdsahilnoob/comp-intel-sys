import { AppError } from "@/server/errors"

const WINDOW_MS = 10 * 60 * 1_000
const MAX_SUBMISSIONS_PER_WINDOW = 10
const buckets = new Map<string, { count: number; resetAt: number }>()

export function assertSubmissionRateLimit(identifier: string) {
  const now = Date.now()
  const existing = buckets.get(identifier)

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  if (existing.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    throw new AppError(
      "RATE_LIMITED",
      "Too many submissions. Please try again in a few minutes.",
      429,
      { retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1_000) },
    )
  }

  existing.count += 1
}
