import nodemailer from "nodemailer";
import env from "../config/env.js";
import logger from "../config/logger.js";

// Check if credentials are placeholders or empty
const isConfigured =
  env.smtp.user && env.smtp.pass && !env.smtp.user.includes("your-email");

let transporter = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
    connectionTimeout: 5000, // Fail fast after 5 seconds instead of hanging
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!isConfigured || !transporter) {
    logger.warn(
      { to, resetUrl },
      "SMTP not configured. Password reset link printed above for testing",
    );
    return;
  }

  const mailOptions = {
    from: env.smtp.from,
    to,
    subject: "Reset Your Rovia Password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Rovia account.</p>
        <p>Click the link below to set a new password. This link expires in 1 hour:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #6b7280; font-size: 12px;">Rovia — Career Growth Platform</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ to }, "Password reset email sent successfully");
  } catch (error) {
    // Log the error but DO NOT crash the request
    logger.error(
      { err: error.message, to, resetUrl },
      "Failed to send password reset email via SMTP. Reset link logged for development",
    );
  }
}
