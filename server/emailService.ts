import nodemailer, { type Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let cachedTransporter: Transporter | null = null;

async function getTransporter(): Promise<{ transporter: Transporter; isTestAccount: boolean }> {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const port = Number(process.env.EMAIL_PORT || 587);
  const secure = process.env.EMAIL_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    if (!cachedTransporter) {
      cachedTransporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    }
    return { transporter: cachedTransporter, isTestAccount: false };
  }

  // Fallback: Create test ethereal account if no SMTP provided
  const testAccount = await nodemailer.createTestAccount();
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return { transporter: testTransporter, isTestAccount: true };
}

export async function sendOtpEmail(toEmail: string, otp: string): Promise<{ success: boolean; previewUrl?: string }> {
  try {
    const { transporter, isTestAccount } = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"VyaparX Support" <noreply@vyaparx.com>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #f1f5f9; }
          .header { background: #FF9800; padding: 28px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; }
          .header p { color: rgba(255,255,255,0.9); margin: 4px 0 0; font-size: 13px; }
          .content { padding: 32px 28px; text-align: center; }
          .title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
          .subtitle { font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
          .otp-box { background: #fff7ed; border: 2px dashed #ff9800; border-radius: 12px; padding: 18px 24px; display: inline-block; margin: 0 auto 24px; }
          .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace; }
          .validity { font-size: 12px; color: #94a3b8; margin-top: 12px; }
          .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VyaparX</h1>
            <p>Commodity Brokerage Management System</p>
          </div>
          <div class="content">
            <div class="title">Verify Your Email Address</div>
            <div class="subtitle">Please use the verification code below to complete your login:</div>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <div class="validity">⏱️ This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.</div>
          </div>
          <div class="footer">
            If you did not request this code, you can safely ignore this email.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Your VyaparX Verification Code: ${otp}`,
      text: `Your VyaparX verification code is: ${otp}. It is valid for 5 minutes.`,
      html: htmlContent,
    });

    let previewUrl: string | undefined;
    if (isTestAccount) {
      previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      console.log(`[EMAIL DEV] OTP sent to ${toEmail}. Preview URL: ${previewUrl}`);
    } else {
      console.log(`[EMAIL PROD] OTP sent to ${toEmail} via SMTP. MessageId: ${info.messageId}`);
    }

    return { success: true, previewUrl };
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send email:', error);
    throw error;
  }
}
