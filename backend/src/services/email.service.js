import { env } from "../config/env.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";
import nodemailer from "nodemailer";

/**
 * Enterprise Email Dispatch Service
 * Supports:
 * 1. Nodemailer (Gmail SMTP) when EMAIL_PASS is configured (delivers to ANY recipient worldwide).
 * 2. Resend REST API when RESEND_API_KEY is configured.
 * 3. Local development console logging with the 6-digit code for instant verification.
 */
export const EmailService = {
  /**
   * Generates responsive HTML email template for verification
   * @param {Object} params - { name, verificationUrl, verificationCode, expiresMinutes }
   * @returns {string} HTML string
   */
  getVerificationEmailHtml({ name, verificationUrl, verificationCode, expiresMinutes = 30 }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your ADOS Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9f6; color: #1c2e1f;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 40px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2ebd8; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background: #172c1c; padding: 36px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">ADOS</h1>
              <p style="margin: 6px 0 0; color: #9ed84f; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Workspace Authentication</p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 40px 30px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #172c1c;">Verify your email address</h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #425244;">
                Hi <strong>${name || "there"}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #425244;">
                Thank you for creating an account with ADOS. Enter the 6-digit verification code below in your browser, or click the verification button.
              </p>
              
              <!-- 6-Digit Verification Code Box -->
              <div style="background-color: #f3faec; border: 2px dashed #9ed84f; border-radius: 16px; padding: 24px 20px; text-align: center; margin: 24px 0;">
                <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #446e27; font-weight: 700; display: block; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #172c1c; font-family: 'Courier New', Courier, monospace; display: inline-block;">
                  ${verificationCode || "------"}
                </span>
                <span style="display: block; font-size: 12px; color: #6f8072; margin-top: 8px;">
                  Valid for ${expiresMinutes} minutes
                </span>
              </div>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0 20px;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #9ed84f; color: #16330e; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 34px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(158, 216, 79, 0.35);">
                      Verify via Direct Link
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #6d7d70; text-align: center;">
                ⏰ This code and link will expire in <strong>${expiresMinutes} minutes</strong> and can only be used once.
              </p>

              <hr style="border: 0; border-top: 1px solid #edf3e6; margin: 26px 0 20px;">

              <p style="margin: 0 0 10px; font-size: 12px; line-height: 1.5; color: #6d7d70;">
                Direct link fallback:
              </p>
              <p style="margin: 0 0 20px; font-size: 11px; line-height: 1.4; word-break: break-all; color: #366023; background-color: #f1f8ea; padding: 10px 12px; border-radius: 8px;">
                ${verificationUrl}
              </p>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #879789;">
                If you did not sign up for an ADOS account, please disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f7fbf3; padding: 20px 40px; text-align: center; border-top: 1px solid #e7f0de;">
              <p style="margin: 0; font-size: 11px; color: #7f8f81;">
                &copy; ${new Date().getFullYear()} ADOS Platform. Built for a better tomorrow.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  /**
   * Dispatches verification email
   * @param {Object} options - { to, name, verificationUrl, verificationCode }
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
   */
  async sendVerificationEmail({ to, name, verificationUrl, verificationCode }) {
    // Developer convenience: Always log code and link in terminal during development
    console.log(`\n📬 =====================================================`);
    console.log(`✉️ [EMAIL DISPATCH] Recipient: ${to}`);
    console.log(`🔑 Verification Code : ${verificationCode}`);
    console.log(`🔗 Verification Link : ${verificationUrl}`);
    console.log(`=====================================================\n`);

    const htmlContent = this.getVerificationEmailHtml({
      name,
      verificationUrl,
      verificationCode,
      expiresMinutes: env.EMAIL_VERIFICATION_EXPIRES_MINUTES,
    });
    const textContent = `Hi ${name || "there"},\n\nYour ADOS 6-digit verification code is: ${verificationCode}\n\nAlternatively, verify by clicking: ${verificationUrl}\n\nThis code will expire in ${env.EMAIL_VERIFICATION_EXPIRES_MINUTES} minutes.`;

    // 1. Check if Gmail SMTP (EMAIL_PASS) is configured
    if (env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: `"ADOS" <${env.EMAIL_USER}>`,
          to,
          subject: `${verificationCode} is your ADOS verification code`,
          text: textContent,
          html: htmlContent,
        });

        console.log(`✅ [EmailService] Gmail SMTP email delivered successfully to ${to} [MessageId: ${info.messageId}]`);
        SecurityLogger.log("EMAIL_VERIFICATION_DISPATCHED", { outcome: "SUCCESS" });
        return { success: true, messageId: info.messageId };
      } catch (smtpErr) {
        console.error("❌ [EmailService] Gmail SMTP Error:", smtpErr.message);
        SecurityLogger.log("EMAIL_DISPATCH_FAILED", {
          details: smtpErr.message,
          outcome: "FAILURE",
        });
        return { success: false, error: smtpErr.message };
      }
    }

    // 2. Fallback to Resend REST API
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ [EmailService] Neither RESEND_API_KEY nor EMAIL_PASS is configured. Verification simulated.");
      return { success: true, simulated: true };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: [to],
          subject: `${verificationCode} is your ADOS verification code`,
          html: htmlContent,
          text: textContent,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("❌ [EmailService] Resend API Error:", responseData);
        if (responseData.message && responseData.message.includes("only send testing emails to your own email address")) {
          console.warn(
            `\n⚠️ [Email Notice] Resend's free tier currently only delivers to ${env.EMAIL_USER}.\nUse the verification code printed in your console above: ${verificationCode}\nOr add EMAIL_PASS (Gmail App Password) in .env to deliver to ANY recipient!\n`
          );
        }

        SecurityLogger.log("EMAIL_DISPATCH_FAILED", {
          details: responseData.message || "Failed to dispatch email via Resend",
          outcome: "FAILURE",
        });
        return { success: false, error: responseData.message };
      }

      console.log(`✅ [EmailService] Resend email dispatched to ${to} [ID: ${responseData.id}]`);
      SecurityLogger.log("EMAIL_VERIFICATION_DISPATCHED", { outcome: "SUCCESS" });
      return { success: true, messageId: responseData.id };
    } catch (err) {
      console.error("❌ [EmailService] Unexpected Error:", err.message);
      SecurityLogger.log("EMAIL_DISPATCH_EXCEPTION", {
        details: err.message,
        outcome: "FAILURE",
      });
      return { success: false, error: err.message };
    }
  },
};
