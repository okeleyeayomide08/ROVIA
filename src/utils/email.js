import nodemailer from "nodemailer";
import env from "../config/env.js";
import logger from "../config/logger.js";

const isConfigured = Boolean(env.smtp.user && env.smtp.pass);

let transporter = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
    tls: {
      // NOTE: Set this to true in production to prevent Man-in-the-Middle attacks
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!isConfigured || !transporter) {
    logger.warn(
      { to, resetUrl },
      "SMTP not configured. Reset link printed to terminal",
    );
    return;
  }

  const mailOptions = {
    from: env.smtp.from || `"Rovia" <${env.smtp.user}>`,
    to,
    subject: "Reset Your Rovia Password",
    html: `
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
            <h2>Password Reset Request</h2>
            <p>We received a request to reset the password for your Rovia account.</p>
            <p>Click the button below to set a new password. For security reasons, this link will expire in <strong>1 hour</strong>.</p>
            
            <!-- Table-wrapped button ensures consistent background & padding in Gmail/Outlook -->
            <table class="button-table" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="button">
                  <a href="${resetUrl}" target="_blank" style="text-decoration: none;">
                    <span>Reset Password</span>
                  </a>
                </td>
              </tr>
            </table>

            <p class="link-text">If the button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}">${resetUrl}</a></p>
            <p style="font-size: 13px; color: #6b7280;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Rovia Technologies. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    // CRITICAL FIX: Actually execute the send mail operation
    await transporter.sendMail(mailOptions);
    logger.info({ to }, "Password reset email delivered successfully");
  } catch (error) {
    logger.error(
      { err: error.message, to, resetUrl },
      "Failed to send password reset email via SMTP",
    );
    throw error; // Propagate error back to the route/controller handling the request
  }
}
