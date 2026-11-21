import env from "../config/env.js";
import logger from "../config/logger.js";

// Emails are sent through Brevo's HTTPS API, not SMTP. Hosts such as Render's
// free plan block outbound SMTP ports (25, 465, 587), so SMTP fails there.
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Thrown when an email could not be delivered. Callers decide how to respond.
 * The message never contains the email body or any tokens.
 */
export class EmailDeliveryError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

/**
 * Call once at server startup. Logs a warning for missing or unsafe settings
 * without stopping the server.
 */
export function checkEmailConfig() {
  if (!env.email.brevoApiKey) {
    logger.warn("BREVO_API_KEY is not set. Verification and reset emails will fail.");
  }
  if (!env.email.from) {
    logger.warn("EMAIL_FROM is not set. Set it to a sender verified in Brevo.");
  }
  if (env.nodeEnv === "production" && env.frontendUrl.includes("localhost")) {
    logger.warn(
      "FRONTEND_URL points to localhost in production. Email links will not work for users.",
    );
  }
}

/**
 * Split "Name <email@example.com>" into the parts Brevo expects.
 */
function parseSender(from) {
  const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(from || "");
  if (match) {
    return { name: match[1].trim() || "Rovia", email: match[2].trim() };
  }
  return { name: "Rovia", email: (from || "").trim() };
}

/**
 * Send one email through Brevo. Throws EmailDeliveryError on any failure.
 */
async function deliver({ to, subject, html, kind }) {
  if (!env.email.brevoApiKey) {
    throw new EmailDeliveryError(`${kind}: BREVO_API_KEY is not configured`);
  }
  if (!env.email.from) {
    throw new EmailDeliveryError(`${kind}: EMAIL_FROM is not configured`);
  }

  let response;
  try {
    response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": env.email.brevoApiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: parseSender(env.email.from),
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    logger.error(
      { kind, to, reason: error.name },
      "Email service could not be reached",
    );
    throw new EmailDeliveryError(`${kind}: email service could not be reached`);
  }

  if (!response.ok) {
    // Brevo returns { code, message }. Log only the code, never the request body.
    let code = "unknown";
    try {
      const body = await response.json();
      code = body.code || code;
    } catch {
      // Response was not JSON; keep the default code.
    }
    logger.error(
      { kind, to, status: response.status, brevoCode: code },
      "Email service rejected the request",
    );
    throw new EmailDeliveryError(
      `${kind}: email service responded with ${response.status}`,
    );
  }

  return true;
}

/**
 * Shared HTML layout for all Rovia emails.
 */
function renderEmail({ heading, paragraphs, buttonText, url, footer }) {
  const year = new Date().getFullYear();
  const body = paragraphs.map((p) => `<p>${p}</p>`).join("\n            ");

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb; }
            .logo { font-size: 24px; font-weight: 700; color: #16a34a; margin-bottom: 24px; }
            h2 { color: #111827; font-size: 20px; margin-top: 0; }
            p { color: #374151; font-size: 15px; line-height: 1.6; }
            .button-table { margin: 28px auto; border-collapse: separate; }
            .button { background-color: #16a34a; border-radius: 6px; display: inline-block; padding: 14px 32px; text-align: center; text-decoration: none; }
            .button span { color: #ffffff !important; font-weight: 600; font-size: 15px; }
            .link-text { font-size: 13px; color: #6b7280; word-break: break-all; }
            .link-text a { color: #16a34a; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Rovia</div>
            <h2>${heading}</h2>
            ${body}
            <table class="button-table" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="button">
                  <a href="${url}" target="_blank" style="text-decoration: none;">
                    <span>${buttonText}</span>
                  </a>
                </td>
              </tr>
            </table>
            <p class="link-text">If the button doesn't work, copy and paste this link into your browser:<br><a href="${url}">${url}</a></p>
            <p style="font-size: 13px; color: #6b7280;">${footer}</p>
            <div class="footer">
              &copy; ${year} Rovia Technologies. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
}

/**
 * Send the password reset email. Throws EmailDeliveryError on failure.
 * The reset link is never logged.
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  await deliver({
    kind: "password reset email",
    to,
    subject: "Reset Your Rovia Password",
    html: renderEmail({
      heading: "Password Reset Request",
      paragraphs: [
        "We received a request to reset the password for your Rovia account.",
        "Click the button below to set a new password. For security reasons, this link will expire in <strong>1 hour</strong>.",
      ],
      buttonText: "Reset Password",
      url: resetUrl,
      footer:
        "If you didn't request a password reset, you can safely ignore this email. Your password will not change.",
    }),
  });

  logger.info({ to }, "Password reset email sent");
}

/**
 * Send the email verification email. Throws EmailDeliveryError on failure.
 * The verification link is never logged.
 */
export async function sendVerificationEmail({
  to,
  firstName,
  verificationUrl,
}) {
  await deliver({
    kind: "verification email",
    to,
    subject: "Verify Your Rovia Email Address",
    html: renderEmail({
      heading: `Welcome to Rovia${firstName ? `, ${firstName}` : ""}!`,
      paragraphs: [
        "Thanks for creating an account. Please verify your email address to confirm your registration.",
        "This verification link will expire in <strong>24 hours</strong>.",
      ],
      buttonText: "Verify Email Address",
      url: verificationUrl,
      footer:
        "If you did not create an account on Rovia, you can safely ignore this email.",
    }),
  });

  logger.info({ to }, "Verification email sent");
}
