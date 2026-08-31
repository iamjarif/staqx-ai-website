import { NextResponse } from "next/server";

import { contactErrorResponse, logContactFailure } from "@/lib/contact-api";
import { sendContactEmail } from "@/lib/email/contact";
import { getMissingResendEnvVars, isResendConfigured } from "@/lib/resend";
import {
  describeContactOrigin,
  isBodyWithinLimit,
  isTrustedContactOrigin,
  parseContactPayload,
} from "@/lib/security/contact";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  if (!isTrustedContactOrigin(request)) {
    return contactErrorResponse(
      NextResponse,
      "ORIGIN_FORBIDDEN",
      403,
      "Contact submission blocked: request origin is not trusted.",
      describeContactOrigin(request)
    );
  }

  if (!isBodyWithinLimit(request)) {
    return contactErrorResponse(
      NextResponse,
      "BODY_TOO_LARGE",
      413,
      "Contact submission blocked: request body exceeds size limit."
    );
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return contactErrorResponse(
      NextResponse,
      "RATE_LIMITED",
      429,
      "Contact submission rate limited.",
      { ip },
      {
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
        userMessage:
          "Too many requests. Please wait before sending another message.",
      }
    );
  }

  if (!isResendConfigured()) {
    const missing = getMissingResendEnvVars();
    return contactErrorResponse(
      NextResponse,
      "RESEND_NOT_CONFIGURED",
      503,
      `Resend is not configured. Missing env: ${missing.join(", ")}`,
      { missingEnv: missing }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return contactErrorResponse(
      NextResponse,
      "INVALID_BODY",
      400,
      "Contact submission failed: invalid JSON body.",
      { error }
    );
  }

  const parsed = parseContactPayload(body);

  if (!parsed.ok) {
    if (parsed.reason === "honeypot") {
      return NextResponse.json({ ok: true });
    }

    logContactFailure(
      "INVALID_PAYLOAD",
      "Contact submission rejected: payload failed validation."
    );

    return NextResponse.json(
      {
        error: "Please fill in all fields with a valid email.",
        code: "INVALID_PAYLOAD" as const,
      },
      { status: 400 }
    );
  }

  try {
    const result = await sendContactEmail(parsed.payload);

    if (result.error) {
      return contactErrorResponse(
        NextResponse,
        "RESEND_SEND_FAILED",
        502,
        "Resend rejected the contact email send.",
        {
          resendError: result.error,
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.RESEND_CONTACT_TO_EMAIL,
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return contactErrorResponse(
      NextResponse,
      "INTERNAL_ERROR",
      500,
      "Contact submission threw an unexpected error.",
      { error }
    );
  }
}
