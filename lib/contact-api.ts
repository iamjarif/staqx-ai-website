import "server-only";

import type { NextResponse } from "next/server";

/** Safe, non-secret codes returned to the client for debugging failed submissions. */
export type ContactErrorCode =
  | "ORIGIN_FORBIDDEN"
  | "BODY_TOO_LARGE"
  | "RATE_LIMITED"
  | "RESEND_NOT_CONFIGURED"
  | "INVALID_BODY"
  | "INVALID_PAYLOAD"
  | "RESEND_SEND_FAILED"
  | "INTERNAL_ERROR";

export const CONTACT_USER_ERROR =
  "Unable to send your message. Please try again." as const;

type ContactErrorPayload = {
  error: string;
  code: ContactErrorCode;
  /** Present outside production so you can inspect failures without Vercel logs. */
  debug?: string;
};

type LogContext = Record<string, unknown>;

function serializeForLog(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
}

function serializeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [key, serializeForLog(value)])
  );
}

export function logContactFailure(
  code: ContactErrorCode,
  message: string,
  context?: LogContext
): void {
  console.error("[contact]", {
    code,
    message,
    ...serializeContext(context),
  });
}

export function contactErrorResponse(
  NextResponseClass: typeof NextResponse,
  code: ContactErrorCode,
  status: number,
  logMessage: string,
  context?: LogContext,
  init?: ResponseInit & { userMessage?: string }
): NextResponse<ContactErrorPayload> {
  logContactFailure(code, logMessage, context);

  const { userMessage, ...responseInit } = init ?? {};

  const body: ContactErrorPayload = {
    error: userMessage ?? CONTACT_USER_ERROR,
    code,
  };

  if (process.env.NODE_ENV !== "production") {
    body.debug = logMessage;
  }

  return NextResponseClass.json(body, { status, ...responseInit });
}
