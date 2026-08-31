import "server-only";

import { buildContactInquiryEmail } from "@/lib/email/templates/contact-inquiry";
import type { ContactFormPayload } from "@/lib/email/templates/contact-inquiry";
import { getResendClient, isResendConfigured } from "@/lib/resend";

export type { ContactFormPayload };

export async function sendContactEmail(payload: ContactFormPayload) {
  if (!isResendConfigured()) {
    throw new Error("Resend is not configured.");
  }

  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_CONTACT_TO_EMAIL;

  if (!resend || !from || !to) {
    throw new Error("Resend is not configured.");
  }

  const { subject, text, html } = buildContactInquiryEmail(payload);

  return resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject,
    text,
    html,
    headers: {
      "X-Entity-Ref-ID": `contact-${Date.now()}`,
    },
    tags: [{ name: "category", value: "contact-form" }],
  });
}
