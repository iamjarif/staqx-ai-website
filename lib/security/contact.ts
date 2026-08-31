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

function normalizeOrigin(value: string): string {
  return value.replace(/\/$/, "");
}

function addOrigin(origins: Set<string>, value: string | undefined) {
  if (!value?.trim()) return;
  const trimmed = value.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    origins.add(normalizeOrigin(trimmed));
    return;
  }
  origins.add(normalizeOrigin(`https://${trimmed}`));
}

function allowedOrigins(): string[] {
  const origins = new Set<string>([
    normalizeOrigin(siteConfig.url),
    "http://localhost:3000",
    "http://localhost:3001",
  ]);

  addOrigin(origins, process.env.NEXT_PUBLIC_SITE_URL);

  for (const vercelHost of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    addOrigin(origins, vercelHost);
  }

  return [...origins];
}

function requestOrigin(request: Request): string | null {
  return originFromUrl(request.url);
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

  const hostOrigin = requestOrigin(request);
  const origin = originFromUrl(request.headers.get("origin"));
  const refererOrigin = originFromUrl(request.headers.get("referer"));

  // Same-origin browser submissions (e.g. Vercel *.vercel.app before custom domain).
  if (hostOrigin && origin && origin === hostOrigin) return true;
  if (hostOrigin && refererOrigin && refererOrigin === hostOrigin) return true;
  if (request.headers.get("sec-fetch-site") === "same-origin") return true;

  const allowed = allowedOrigins();
  if (origin && allowed.includes(origin)) return true;
  if (refererOrigin && allowed.includes(refererOrigin)) return true;

  return false;
}

/** For structured logging when origin checks fail in production. */
export function describeContactOrigin(request: Request) {
  return {
    requestOrigin: requestOrigin(request),
    origin: originFromUrl(request.headers.get("origin")),
    refererOrigin: originFromUrl(request.headers.get("referer")),
    secFetchSite: request.headers.get("sec-fetch-site"),
    allowedOrigins: allowedOrigins(),
  };
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
