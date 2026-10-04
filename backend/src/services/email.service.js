import { env } from "../config/env.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";

/**
 * Enterprise Email Dispatch Service
 * Handles transactional email delivery using Resend REST API with native fetch.
 */
export const EmailService = {
  /**
   * Generates responsive HTML email template for verification
   * @param {Object} params - { name, verificationUrl, expiresMinutes }
   * @returns {string} HTML string
   */
  getVerificationEmailHtml({ name, verificationUrl, expiresMinutes = 30 }) {
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
                Thank you for creating an account with ADOS. To complete your registration and activate your workspace, please verify your email address.
              </p>
              
              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #9ed84f; color: #16330e; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 34px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(158, 216, 79, 0.35);">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #6d7d70;">
                ⏰ <strong>Security Notice:</strong> This verification link will expire in <strong>${expiresMinutes} minutes</strong> and can only be used once.
              </p>

              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #6d7d70;">
                If the button above does not work, copy and paste this URL into your browser:
              </p>
              <p style="margin: 0 0 24px; font-size: 12px; line-height: 1.4; word-break: break-all; color: #366023; background-color: #f1f8ea; padding: 12px; border-radius: 8px;">
                ${verificationUrl}
              </p>

              <hr style="border: 0; border-top: 1px solid #edf3e6; margin: 30px 0 20px;">

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #879789;">
                If you did not sign up for an ADOS account, please disregard this email or contact support. No further action is required.
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
   * @param {Object} options - { to, name, verificationUrl }
   * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
   */
  async sendVerificationEmail({ to, name, verificationUrl }) {
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ [EmailService] RESEND_API_KEY is not configured. Simulating verification email dispatch.");
      console.log(`✉️ [EmailService Simulation] Verification Link for ${to}: ${verificationUrl}`);
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
          subject: "Verify your ADOS account",
          html: this.getVerificationEmailHtml({
            name,
            verificationUrl,
            expiresMinutes: env.EMAIL_VERIFICATION_EXPIRES_MINUTES,
          }),
          text: `Hi ${name || "there"},\n\nPlease verify your ADOS email address by visiting this link:\n${verificationUrl}\n\nThis link will expire in ${env.EMAIL_VERIFICATION_EXPIRES_MINUTES} minutes.\n\nIf you did not create this account, please ignore this email.`,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("❌ [EmailService] Resend API Error:", responseData);
        SecurityLogger.log("EMAIL_DISPATCH_FAILED", {
          details: responseData.message || "Failed to dispatch email via Resend",
          outcome: "FAILURE",
        });
        return { success: false, error: responseData.message };
      }

      SecurityLogger.log("EMAIL_VERIFICATION_DISPATCHED", {
        outcome: "SUCCESS",
      });

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
