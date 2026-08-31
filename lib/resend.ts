import "server-only";

import { Resend } from "resend";

const RESEND_ENV_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_CONTACT_TO_EMAIL",
] as const;

let client: Resend | null = null;

export function getMissingResendEnvVars(): string[] {
  return RESEND_ENV_KEYS.filter((key) => !process.env[key]?.trim());
}

export function isResendConfigured(): boolean {
  return getMissingResendEnvVars().length === 0;
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  if (!client) {
    client = new Resend(apiKey);
  }

  return client;
}

export function getResendFromEmail(): string | undefined {
  return process.env.RESEND_FROM_EMAIL?.trim();
}

export function getResendContactToEmail(): string | undefined {
  return process.env.RESEND_CONTACT_TO_EMAIL?.trim();
}
