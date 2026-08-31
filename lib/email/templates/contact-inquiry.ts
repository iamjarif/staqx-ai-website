import { siteConfig } from "@/config/site";

export type ContactFormPayload = {
  fullName: string;
  email: string;
  company: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMessageHtml(value: string): string {
  return escapeHtml(value.trim()).replaceAll("\n", "<br />");
}

function formatSubmittedAt(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function detailRow(label: string, value: string, valueHref?: string) {
  const safeValue = escapeHtml(value);
  const valueMarkup = valueHref
    ? `<a href="${escapeHtml(valueHref)}" style="color:#ff9540;text-decoration:none;">${safeValue}</a>`
    : safeValue;

  return `
    <tr>
      <td style="padding:0 0 16px 0;width:120px;vertical-align:top;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:20px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:0 0 16px 0;vertical-align:top;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#fafafa;font-weight:500;">
        ${valueMarkup}
      </td>
    </tr>
  `;
}

export function buildContactInquiryEmail(payload: ContactFormPayload) {
  const { fullName, email, company, message } = payload;
  const submittedAt = formatSubmittedAt();
  const subject = `[${siteConfig.name}] Project inquiry from ${fullName} at ${company}`;
  const preheader = `New website inquiry from ${fullName} (${company}). Reply to respond directly.`;

  const text = [
    `${siteConfig.name} — New project inquiry`,
    "",
    `Submitted: ${submittedAt} (UTC)`,
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Company: ${company}`,
    "",
    "Project details:",
    message.trim(),
    "",
    `Reply to this email to reach ${fullName} directly.`,
    "",
    `Sent via the contact form at ${siteConfig.url}`,
    siteConfig.description,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#000000;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 24px 0;border-bottom:1px solid #262626;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;line-height:32px;font-weight:700;color:#fafafa;">
                      Staq<span style="color:#ff7d12;">X</span>.ai
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:8px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;color:#9ca3af;">
                      New project inquiry
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 0 8px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#d1d5db;">
                A visitor submitted the contact form on your website. Use <strong style="color:#fafafa;">Reply</strong> to respond directly to ${escapeHtml(fullName)}.
              </td>
            </tr>

            <tr>
              <td style="padding:16px 0 24px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:#131313;border:1px solid #262626;border-radius:8px;">
                  <tr>
                    <td style="padding:24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                        ${detailRow("Name", fullName)}
                        ${detailRow("Email", email, `mailto:${email}`)}
                        ${detailRow("Company", company)}
                        <tr>
                          <td colspan="2" style="padding:8px 0 0 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                              <tr>
                                <td style="padding:0 0 8px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:20px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">
                                  Project details
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:16px;background-color:#0a0a0a;border:1px solid #1a1a1a;border-radius:8px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;color:#fafafa;">${formatMessageHtml(message)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 24px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="border-radius:8px;background-color:#ff7d12;">
                      <a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:12px 20px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;font-weight:600;color:#111111;text-decoration:none;">
                        Reply to ${escapeHtml(fullName)}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 0 0 0;border-top:1px solid #262626;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#6b7280;">
                <p style="margin:0 0 8px 0;">
                  Submitted ${escapeHtml(submittedAt)} (UTC) via the contact form at
                  <a href="${escapeHtml(siteConfig.url)}" style="color:#ff9540;text-decoration:none;">${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}</a>.
                </p>
                <p style="margin:0;">
                  ${escapeHtml(siteConfig.description)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html, preheader };
}
