import "server-only";

import { Resend } from "resend";

let client: Resend | null = null;

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.RESEND_CONTACT_TO_EMAIL
  );
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!client) {
    client = new Resend(apiKey);
  }

  return client;
}
