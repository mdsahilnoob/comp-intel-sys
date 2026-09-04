import { Prisma } from "@prisma/client"
import { z } from "zod"

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DUPLICATE_SUBMISSION"
  | "UNSUPPORTED_CURRENCY"
  | "DATABASE_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"

export class AppError extends Error {
  readonly code: ApiErrorCode
  readonly status: number
  readonly details: unknown

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    details: unknown = {},
  ) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.status = status
    this.details = details
  }
}

export function validationError(message = "Please check the submitted values", details: unknown = {}) {
  return new AppError("VALIDATION_ERROR", message, 400, details)
}

export function notFoundError(message: string, details: unknown = {}) {
  return new AppError("NOT_FOUND", message, 404, details)
}

export function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.status },
    )
  }

  if (error instanceof z.ZodError) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the submitted values",
          details: error.flatten(),
        },
      },
      { status: 400 },
    )
  }

  console.error("Unhandled API error", error)
  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request",
        details: {},
      },
    },
    { status: 500 },
  )
}
