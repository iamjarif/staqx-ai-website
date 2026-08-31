import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email/contact";
import { isResendConfigured } from "@/lib/resend";
import {
  isBodyWithinLimit,
  isTrustedContactOrigin,
  parseContactPayload,
} from "@/lib/security/contact";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";

const GENERIC_ERROR = "Unable to send your message. Please try again.";

export async function POST(request: Request) {
  if (!isTrustedContactOrigin(request)) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
  }

  if (!isBodyWithinLimit(request)) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 413 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before sending another message." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  if (!isResendConfigured()) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 503 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseContactPayload(body);

  if (!parsed.ok) {
    if (parsed.reason === "honeypot") {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Please fill in all fields with a valid email." },
      { status: 400 }
    );
  }

  try {
    const { error } = await sendContactEmail(parsed.payload);

    if (error) {
      console.error("Resend contact email failed");
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Contact form submission failed");
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
