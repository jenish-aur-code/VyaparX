import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RotateCw, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { companyService } from '../../services/companyService';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { palette } = useTheme();
  const { verifyOtp, resendOtp, pendingEmail } = useAuth();
  const { refreshAppContext } = useApp();

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = pendingEmail || '';

  // Redirect back to login if email is missing
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const maskEmail = (rawEmail: string): string => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [user, domain] = rawEmail.split('@');
    if (user.length <= 2) {
      return `${user.charAt(0)}***@${domain}`;
    }
    const visibleLength = Math.min(3, user.length - 1);
    const visiblePart = user.slice(0, visibleLength);
    return `${visiblePart}***@${domain}`;
  };

  const handleChange = (index: number, value: string) => {
    setErrorMessage('');
    // Allow only single numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const lastChar = cleaned.charAt(cleaned.length - 1);
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);

    // Auto move to next input
    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;

    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    const nextFocusIndex = Math.min(pasted.length, 3);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const otpCode = digits.join('');
  const isComplete = otpCode.length === 4;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isComplete || isVerifying) return;

    try {
      setIsVerifying(true);
      setErrorMessage('');
      await verifyOtp(email, otpCode);
      toast.success('Email verified successfully!');

      // Check companies associated with this email
      await refreshAppContext();
      const userCompanies = await companyService.getByUser(email);

      if (userCompanies.length > 0) {
        // CASE 1: Existing companies found -> Go to Company Selection
        navigate('/splash', { replace: true });
      } else {
        // CASE 2: No company found -> Redirect to Create First Company Form
        toast.info("Please create your first company to continue.");
        navigate('/create-first-company', { replace: true });
      }
    } catch (err: any) {
      const msg = err.message || 'Invalid verification code. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    try {
      setIsResending(true);
      setErrorMessage('');
      await resendOtp(email);
      setDigits(['', '', '', '']);
      setCountdown(60);
      inputRefs.current[0]?.focus();
      toast.success('New verification code sent to your email.');
    } catch (err: any) {
      const msg = err.message || 'Unable to resend OTP. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-6 md:p-12 text-white transition-colors relative overflow-hidden"
      style={{ backgroundColor: palette.primary }}
    >
      {/* Ambient background refraction blobs */}
      <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-28 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

      <div className="w-full flex justify-end relative z-10">
        {/* Top spacer */}
      </div>

      <div className="w-full max-w-sm flex flex-col items-center text-center p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-glass-hover space-y-6 relative z-10">
        {/* Verification Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-glass">
          <ShieldCheck className="w-11 h-11 text-white stroke-[2]" />
        </div>

        {/* Title & Masked Email */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
            Verify OTP
          </h1>
          <p className="text-xs font-semibold text-white/90">
            Enter Verification Code
          </p>
          <p className="text-[11px] text-white/80 pt-0.5">
            We sent a 4-digit code to
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide border border-white/30 shadow-2xs">
            <span>{maskEmail(email)}</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="p-0.5 hover:text-black transition-colors"
              title="Change email address"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <form onSubmit={handleVerify} className="w-full space-y-5 pt-1">
          {/* 4 OTP Input Boxes */}
          <div className="flex items-center justify-center gap-2.5">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-13 h-15 text-center text-2xl font-black bg-white/15 border-2 border-white/40 rounded-2xl text-white focus:bg-white focus:text-[#111827] focus:border-white focus:outline-none shadow-glass transition-all"
              />
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-600/90 backdrop-blur-sm text-white rounded-2xl text-xs font-bold tracking-wide shadow-glass border border-white/20 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* Verify OTP Button */}
          <button
            type="submit"
            disabled={!isComplete || isVerifying}
            className="w-full py-3.5 px-6 bg-slate-950/90 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-glass transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Verify OTP</span>
              </>
            )}
          </button>

          {/* Resend OTP & Countdown */}
          <div className="pt-1 flex flex-col items-center gap-2">
            {countdown > 0 ? (
              <div className="text-xs font-semibold text-white/80">
                Resend OTP in <span className="font-mono font-bold text-white">00:{countdown.toString().padStart(2, '0')}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs font-bold text-white hover:text-black transition-colors flex items-center gap-1.5 underline underline-offset-4"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'Resending code...' : 'Resend OTP'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-medium text-white/75 hover:text-white transition-colors pt-1"
            >
              Entered wrong email? <span className="underline font-bold">Change Email</span>
            </button>
          </div>
        </form>
      </div>

      <div className="text-[11px] text-white/75 font-medium tracking-wide uppercase relative z-10">
        Commodity Brokerage Management System
      </div>
    </div>
  );
};
