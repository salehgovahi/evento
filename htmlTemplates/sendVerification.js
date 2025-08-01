module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verification Code</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#1e1e2f; color: #ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e1e2f; padding: 40px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" width="600" style="background-color: #2c2c3e; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.3); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #3f51b5; padding: 24px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: #ffffff;">🔐 Email Verification</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="font-size: 16px; margin-top: 0; color: #e0e0e0;">Hello,</p>
              <p style="font-size: 16px; color: #cccccc;">To complete your sign-in or secure your account, please use the code below:</p>

              <!-- Dynamic Content Placeholder -->
              <div style="margin: 32px 0; text-align: center;">
                <span style="display: inline-block; background-color: #444866; color: #ffffff; font-size: 26px; font-weight: bold; padding: 16px 28px; border-radius: 10px; letter-spacing: 3px;">
                  {{content}}
                </span>
              </div>

              <p style="font-size: 14px; color: #999999;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e1e2f; text-align: center; padding: 24px; font-size: 13px; color: #666666;">
              © 2025 Your Company, All rights reserved.<br/>
              <a href="https://yourcompany.com" style="color: #8888ff; text-decoration: none;">Visit our site</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`