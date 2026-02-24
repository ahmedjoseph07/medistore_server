export const getVerificationEmailTemplate = (verificationUrl: string, name?: string) => {
    const currentYear = new Date().getFullYear();

    return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif; color:#1f2937;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8; padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
              
              <tr>
                <td style="background:#006a4e; padding:20px 24px; text-align:center;">
                  <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">Medistore</h1>
                  <p style="margin:6px 0 0; color:#d1fae5; font-size:13px;">Email Verification</p>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 24px;">
                  <h2 style="margin:0 0 12px; font-size:20px; color:#111827;">Verify your email address</h2>
                  <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#374151;">
                    ${name ? `Hi ${name},` : "Hello,"}
                  </p>
                  <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#374151;">
                    Thanks for signing up for Medistore. Please confirm your email address to activate your account.
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                    <tr>
                      <td align="center" style="border-radius:8px; background:#006a4e;">
                        <a href="${verificationUrl}"
                           style="display:inline-block; padding:12px 20px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px; font-size:13px; color:#6b7280;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="margin:0 0 20px; word-break:break-all; font-size:13px; line-height:1.5;">
                    <a href="${verificationUrl}" style="color:#2563eb; text-decoration:none;">
                      ${verificationUrl}
                    </a>
                  </p>

                  <p style="margin:0; font-size:13px; line-height:1.6; color:#6b7280;">
                    If you didn't create an account, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#f9fafb; padding:16px 24px; border-top:1px solid #e5e7eb; text-align:center;">
                  <p style="margin:0; font-size:12px; color:#6b7280;">
                    © ${currentYear} Medistore. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
