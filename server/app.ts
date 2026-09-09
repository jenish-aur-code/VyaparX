import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendOtpEmail, getSmtpStatus, verifySmtpConnection, isSmtpConfigured } from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const apiApp = express();

apiApp.use(cors());
apiApp.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'vyaparx_secret_session_key_change_in_production_2026';

// Persistent Company Registry Path
const DATA_DIR = path.join(__dirname, 'data');
const REGISTRY_FILE = path.join(DATA_DIR, 'companyRegistry.json');

interface RegisteredCompany {
  id: number;
  name: string;
  username: string;
  userEmail: string;
  createdAt: string;
}

function loadCompanyRegistry(): Record<string, RegisteredCompany[]> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(REGISTRY_FILE)) {
      const data = fs.readFileSync(REGISTRY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read company registry file:', err);
  }
  // Default seed association for backward compatibility
  const initialRegistry: Record<string, RegisteredCompany[]> = {
    'krishnafibers@gmail.com': [
      {
        id: 1,
        name: 'KRISHNA FIBERS',
        username: 'JENISH',
        userEmail: 'krishnafibers@gmail.com',
        createdAt: new Date().toISOString(),
      },
    ],
  };
  saveCompanyRegistry(initialRegistry);
  return initialRegistry;
}

function saveCompanyRegistry(registry: Record<string, RegisteredCompany[]>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save company registry file:', err);
  }
}

// In-Memory OTP Store
interface OtpEntry {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const otpStore = new Map<string, OtpEntry>();
const sendHistory = new Map<string, number[]>(); // for rate limiting: email -> timestamps

// Email format validator
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

// Simple secure session token generator (HMAC signed)
function generateToken(email: string): string {
  const payload = JSON.stringify({
    email: email.toLowerCase().trim(),
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token: string): { email: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

// Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid or expired session' });
    return;
  }
  (req as any).user = user;
  next();
}

// Rate limiting checker
function checkRateLimit(email: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const history = sendHistory.get(email) || [];
  // Filter history within last 10 minutes
  const recent = history.filter(t => now - t < 10 * 60 * 1000);
  sendHistory.set(email, recent);

  if (recent.length >= 5) {
    const oldestInWindow = recent[0];
    const waitSeconds = Math.ceil((10 * 60 * 1000 - (now - oldestInWindow)) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Also check cooldown (30 seconds between sends)
  const existingOtp = otpStore.get(email);
  if (existingOtp && now - existingOtp.lastSentAt < 30 * 1000) {
    const waitSeconds = Math.ceil((30 * 1000 - (now - existingOtp.lastSentAt)) / 1000);
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
}

// -----------------------------------------------------
// AUTH ENDPOINTS (supports both /api/auth and /auth)
// -----------------------------------------------------

async function handleSendOtp(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const rateLimit = checkRateLimit(normalizedEmail);
  if (!rateLimit.allowed) {
    res.status(429).json({
      success: false,
      message: `Too many requests. Please wait ${rateLimit.waitSeconds} seconds before trying again.`,
    });
    return;
  }

  // Generate secure 4-digit OTP (1000 - 9999)
  const otp = crypto.randomInt(1000, 10000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes TTL

  otpStore.set(normalizedEmail, {
    email: normalizedEmail,
    code: otp,
    expiresAt,
    attempts: 0,
    lastSentAt: Date.now(),
  });

  const history = sendHistory.get(normalizedEmail) || [];
  history.push(Date.now());
  sendHistory.set(normalizedEmail, history);

  // Check if SMTP is configured
  if (!isSmtpConfigured()) {
    console.warn(
      `\n⚠️  [SMTP CONFIGURATION REQUIRED] Cannot send real email to ${normalizedEmail}.\n` +
      `   Please open your .env file and set EMAIL_USER & EMAIL_PASSWORD (e.g., Gmail + 16-character App Password).\n`
    );
    res.status(503).json({
      success: false,
      message: 'Email service is not configured. Please add EMAIL_USER and EMAIL_PASSWORD (Gmail App Password) in your .env file to receive OTP in your inbox.',
    });
    return;
  }

  try {
    await sendOtpEmail(normalizedEmail, otp);
    res.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Please check your inbox.`,
    });
  } catch (err: any) {
    console.error('Failed to send OTP email:', err.message || err);
    res.status(500).json({
      success: false,
      message: `Failed to deliver email: ${err.message || 'Please check your SMTP credentials in .env.'}`,
    });
  }
}

async function handleVerifyOtp(req: Request, res: Response): Promise<void> {
  const { email, otp } = req.body;
  if (!email || !isValidEmail(email)) {
    res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    return;
  }
  if (!otp || typeof otp !== 'string' || otp.trim().length !== 4) {
    res.status(400).json({ success: false, message: 'Please enter a 4-digit verification code.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    res.status(400).json({ success: false, message: 'No verification code requested for this email.' });
    return;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    res.status(400).json({ success: false, message: 'This verification code has expired. Please request a new code.' });
    return;
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(normalizedEmail);
    res.status(429).json({ success: false, message: 'Too many failed attempts. Please request a new OTP.' });
    return;
  }

  if (record.code !== otp.trim()) {
    res.status(400).json({ success: false, message: 'Invalid verification code. Please try again.' });
    return;
  }

  // Correct OTP! Invalidate OTP immediately so it cannot be reused
  otpStore.delete(normalizedEmail);

  // Generate authenticated session token
  const token = generateToken(normalizedEmail);

  res.json({
    success: true,
    message: 'Email verified successfully.',
    token,
    user: {
      email: normalizedEmail,
    },
  });
}

// Send OTP
apiApp.post('/api/auth/send-otp', handleSendOtp);
apiApp.post('/api/auth/send-email-otp', handleSendOtp);
apiApp.post('/auth/send-otp', handleSendOtp);
apiApp.post('/auth/send-email-otp', handleSendOtp);

// Resend OTP
apiApp.post('/api/auth/resend-otp', handleSendOtp);
apiApp.post('/auth/resend-otp', handleSendOtp);

// Verify OTP
apiApp.post('/api/auth/verify-otp', handleVerifyOtp);
apiApp.post('/api/auth/verify-email-otp', handleVerifyOtp);
apiApp.post('/auth/verify-otp', handleVerifyOtp);
apiApp.post('/auth/verify-email-otp', handleVerifyOtp);

// SMTP Service Status & Verification Diagnostics
apiApp.get(['/api/auth/smtp-status', '/auth/smtp-status'], (_req: Request, res: Response) => {
  res.json(getSmtpStatus());
});

apiApp.post(['/api/auth/verify-smtp', '/auth/verify-smtp'], async (_req: Request, res: Response) => {
  const result = await verifySmtpConnection();
  res.json(result);
});

// Check Session / Current User
apiApp.get(['/api/auth/me', '/auth/me'], requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    success: true,
    authenticated: true,
    user: {
      email: user.email,
    },
  });
});

// -----------------------------------------------------
// COMPANY ASSOCIATION & ACCESS CONTROL ENDPOINTS
// -----------------------------------------------------

// Get companies associated with authenticated user
apiApp.get(['/api/companies/my', '/companies/my'], requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const registry = loadCompanyRegistry();
  const userCompanies = registry[user.email] || [];
  res.json({
    success: true,
    companies: userCompanies,
  });
});

// Register a company association for authenticated user
apiApp.post(['/api/companies/register', '/companies'], requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id, name, username } = req.body;

  if (!id || !name || !username) {
    res.status(400).json({ success: false, message: 'Company id, name, and username are required.' });
    return;
  }

  const registry = loadCompanyRegistry();
  const userCompanies = registry[user.email] || [];

  // Add or update
  const existingIdx = userCompanies.findIndex(c => c.id === Number(id));
  const entry: RegisteredCompany = {
    id: Number(id),
    name: name.trim().toUpperCase(),
    username: username.trim(),
    userEmail: user.email,
    createdAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    userCompanies[existingIdx] = entry;
  } else {
    userCompanies.push(entry);
  }

  registry[user.email] = userCompanies;
  saveCompanyRegistry(registry);

  res.json({
    success: true,
    message: 'Company registered successfully.',
    company: entry,
  });
});

// Validate that authenticated user has access to a specific company ID
apiApp.post(['/api/companies/validate-access', '/companies/validate-access'], requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { companyId } = req.body;

  if (!companyId) {
    res.status(400).json({ success: false, message: 'companyId is required' });
    return;
  }

  const registry = loadCompanyRegistry();
  const userCompanies = registry[user.email] || [];
  const hasAccess = userCompanies.some(c => c.id === Number(companyId));

  if (!hasAccess) {
    res.status(403).json({
      success: false,
      message: "You don't have access to this company.",
    });
    return;
  }

  res.json({
    success: true,
    authorized: true,
  });
});
