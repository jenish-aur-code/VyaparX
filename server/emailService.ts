import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer, { type Transporter } from 'nodemailer';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback

let cachedTransporter: Transporter | null = null;
let lastConfigHash: string = '';

export function isSmtpConfigured(): boolean {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASSWORD?.trim();
  return Boolean(user && pass);
}

export function getSmtpStatus(): { configured: boolean; user?: string; serviceOrHost?: string } {
  const user = process.env.EMAIL_USER?.trim();
  const host = process.env.EMAIL_HOST?.trim();
  const service = process.env.EMAIL_SERVICE?.trim();
  const configured = isSmtpConfigured();

  let maskedUser: string | undefined = undefined;
  if (user && user.includes('@')) {
    const [u, d] = user.split('@');
    maskedUser = `${u.slice(0, 3)}***@${d}`;
  }

  return {
    configured,
    user: maskedUser,
    serviceOrHost: service || host || (user?.endsWith('@gmail.com') ? 'gmail' : undefined),
  };
}

function getTransporter(): Transporter {
  const rawUser = process.env.EMAIL_USER?.trim() || '';
  const rawPass = process.env.EMAIL_PASSWORD?.trim() || '';
  const rawHost = process.env.EMAIL_HOST?.trim() || '';
  const rawPort = Number(process.env.EMAIL_PORT?.trim() || 587);
  const rawSecure = process.env.EMAIL_SECURE?.trim() === 'true' || rawPort === 465;
  const rawService = process.env.EMAIL_SERVICE?.trim()?.toLowerCase();

  if (!rawUser || !rawPass) {
    throw new Error(
      'EMAIL_NOT_CONFIGURED: Sender email credentials are not set in .env. Please configure EMAIL_USER and EMAIL_PASSWORD to send real emails.'
    );
  }

  // Google App Passwords commonly have spaces when copied (e.g. "abcd efgh ijkl mnop")
  const sanitizedPass = rawPass.replace(/\s+/g, '');
  const configHash = `${rawService}-${rawHost}-${rawPort}-${rawSecure}-${rawUser}-${sanitizedPass}`;

  if (cachedTransporter && lastConfigHash === configHash) {
    return cachedTransporter;
  }

  let transporter: Transporter;

  // Use Gmail service if explicitly requested or if sender is a @gmail.com address without custom host
  if (rawService === 'gmail' || (!rawHost && rawUser.endsWith('@gmail.com'))) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: rawUser,
        pass: sanitizedPass,
      },
    });
  } else {
    // Custom SMTP
    transporter = nodemailer.createTransport({
      host: rawHost || 'smtp.gmail.com',
      port: rawPort,
      secure: rawSecure,
      auth: {
        user: rawUser,
        pass: sanitizedPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  cachedTransporter = transporter;
  lastConfigHash = configHash;
  return transporter;
}

export async function verifySmtpConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { success: true, message: 'SMTP connection verified successfully.' };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to verify SMTP connection.',
    };
  }
}

/**
 * Generates modern, responsive HTML email template for OTP delivery
 */
function buildOtpEmailHtml(toEmail: string, otp: string): string {
  const formattedTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your VyaparX Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #1e293b;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f1f5f9;
      padding: 40px 12px;
    }
    .main-card {
      background-color: #ffffff;
      margin: 0 auto;
      max-width: 560px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      border: 1px solid #e2e8f0;
    }
    .header-banner {
      background: linear-gradient(135deg, #ff9800 0%, #ea580c 100%);
      padding: 36px 28px;
      text-align: center;
    }
    .brand-logo {
      display: inline-block;
      font-size: 30px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
      text-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .brand-tagline {
      color: #ffedd5;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1.5px;
      margin-top: 6px;
      text-transform: uppercase;
    }
    .content-body {
      padding: 36px 32px;
      text-align: center;
    }
    .headline {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px 0;
    }
    .subtext {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 26px 0;
    }
    .otp-container {
      background: #fff7ed;
      border: 2px dashed #f97316;
      border-radius: 16px;
      padding: 24px 20px;
      margin: 0 auto 26px;
      max-width: 380px;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      color: #c2410c;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
      display: block;
    }
    .otp-number {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 14px;
      color: #ea580c;
      font-family: 'SF Pro Display', -apple-system, 'Courier New', Courier, monospace;
      padding-left: 14px; /* balance letter-spacing */
      line-height: 1.1;
      margin: 4px 0;
    }
    .otp-badge {
      display: inline-block;
      margin-top: 10px;
      background: #fed7aa;
      color: #9a3412;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
    }
    .security-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;
    }
    .security-title {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .security-list {
      margin: 0;
      padding-left: 18px;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .meta-card {
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
      margin-top: 10px;
      font-size: 12px;
      color: #94a3b8;
      text-align: left;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .meta-key {
      color: #64748b;
      font-weight: 600;
    }
    .meta-val {
      color: #0f172a;
      font-family: monospace;
      font-weight: 600;
    }
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <!-- Header Banner -->
      <div class="header-banner">
        <div class="brand-logo">VyaparX</div>
        <div class="brand-tagline">Commodity Brokerage Management System</div>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        <h2 class="headline">Verify Your Email Address</h2>
        <p class="subtext">
          We received a request to log in to your VyaparX portal. Please use the one-time verification code below:
        </p>

        <!-- OTP Highlight Card -->
        <div class="otp-container">
          <span class="otp-label">Verification Code</span>
          <div class="otp-number">${otp}</div>
          <div class="otp-badge">⏱️ Valid for 5 minutes only</div>
        </div>

        <!-- Security Guidance -->
        <div class="security-box">
          <div class="security-title">🛡️ Security Reminder</div>
          <ul class="security-list">
            <li>Never share this code with anyone. VyaparX support will never request your OTP.</li>
            <li>If you did not request this login, your account is still secure. You can safely disregard this message.</li>
          </ul>
        </div>

        <!-- Request Details -->
        <div class="meta-card">
          <div class="meta-row">
            <span class="meta-key">Recipient:</span>
            <span class="meta-val">${toEmail}</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">Timestamp:</span>
            <span class="meta-val">${formattedTime}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        © 2026 VyaparX. All rights reserved.<br>
        This is an automated security transmission. Please do not reply directly to this email.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatches the OTP email to the user's real email address.
 * Throws an error if SMTP is not configured or if sending fails.
 */
export async function sendOtpEmail(
  toEmail: string,
  otp: string
): Promise<{ success: boolean; messageId?: string }> {
  try {
    const transporter = getTransporter();
    const fromUser = process.env.EMAIL_USER?.trim() || 'noreply@vyaparx.com';
    const fromAddress = process.env.EMAIL_FROM?.trim() || `"VyaparX Security" <${fromUser}>`;

    const htmlContent = buildOtpEmailHtml(toEmail, otp);
    const plainText = `Your VyaparX verification code is: ${otp}\n\nThis code will expire in 5 minutes.\nDo not share this code with anyone.\n\nSent to: ${toEmail}\nVyaparX - Commodity Brokerage Management System`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `${otp} is your VyaparX verification code`,
      text: plainText,
      html: htmlContent,
    });

    console.log(`[EMAIL SUCCESS] Real OTP email delivered to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[EMAIL ERROR] Failed to send real email to ${toEmail}:`, error.message);
    throw error;
  }
}
