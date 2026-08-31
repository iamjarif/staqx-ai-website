import { siteConfig } from "@/config/site";
import type { ContactFormPayload } from "@/lib/email/templates/contact-inquiry";

export const CONTACT_FIELD_LIMITS = {
  fullName: 120,
  email: 254,
  company: 200,
  message: 5000,
} as const;

const MAX_BODY_BYTES = 32_768;
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export type ContactParseResult =
  | { ok: true; payload: ContactFormPayload }
  | { ok: false; reason: "honeypot" | "invalid" };

function hasDisallowedChars(value: string, allowNewlines = false): boolean {
  const normalized = allowNewlines
    ? value.replaceAll("\n", "").replaceAll("\t", "")
    : value;
  return /[\u0000-\u001F\u007F]/.test(normalized);
}

function isValidEmail(value: string): boolean {
  if (value.length > CONTACT_FIELD_LIMITS.email) return false;
  if (hasDisallowedChars(value)) return false;
  if (/[\s,;:]/.test(value)) return false;
  return EMAIL_PATTERN.test(value);
}

function allowedOrigins(): string[] {
  const origins = new Set<string>([
    siteConfig.url.replace(/\/$/, ""),
    "http://localhost:3000",
    "http://localhost:3001",
  ]);

  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (publicUrl) origins.add(publicUrl);

  return [...origins];
}

function originFromUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isTrustedContactOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const allowed = allowedOrigins();
  const origin = originFromUrl(request.headers.get("origin"));
  if (origin && allowed.includes(origin)) return true;

  const refererOrigin = originFromUrl(request.headers.get("referer"));
  if (refererOrigin && allowed.includes(refererOrigin)) return true;

  return false;
}

export function isBodyWithinLimit(request: Request): boolean {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isFinite(length) || length <= 0) return true;
  return length <= MAX_BODY_BYTES;
}

export function parseContactPayload(body: unknown): ContactParseResult {
  if (!body || typeof body !== "object") {
    return { ok: false, reason: "invalid" };
  }

  const record = body as Record<string, unknown>;
  if (typeof record.website === "string" && record.website.trim() !== "") {
    return { ok: false, reason: "honeypot" };
  }

  const { fullName, email, company, message } = record;

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string" ||
    typeof message !== "string"
  ) {
    return { ok: false, reason: "invalid" };
  }

  const trimmed: ContactFormPayload = {
    fullName: fullName.trim(),
    email: email.trim(),
    company: company.trim(),
    message: message.trim().replaceAll("\r\n", "\n").replaceAll("\r", "\n"),
  };

  if (
    !trimmed.fullName ||
    !trimmed.email ||
    !trimmed.company ||
    !trimmed.message ||
    trimmed.fullName.length > CONTACT_FIELD_LIMITS.fullName ||
    trimmed.company.length > CONTACT_FIELD_LIMITS.company ||
    trimmed.message.length > CONTACT_FIELD_LIMITS.message ||
    hasDisallowedChars(trimmed.fullName) ||
    hasDisallowedChars(trimmed.company) ||
    hasDisallowedChars(trimmed.message, true) ||
    !isValidEmail(trimmed.email)
  ) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, payload: trimmed };
}
