import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const EmailLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { palette } = useTheme();
  const { sendOtp, pendingEmail, setPendingEmail } = useAuth();

  const [email, setEmail] = useState<string>(pendingEmail || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = EMAIL_REGEX.test(email.trim());

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendOtp(email.trim().toLowerCase());
      setPendingEmail(email.trim().toLowerCase());
      toast.success('Verification code sent to your email.');
      navigate('/verify-otp');
    } catch (err: any) {
      toast.error(err.message || 'Unable to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        {/* Briefcase App Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-glass">
          <Briefcase className="w-11 h-11 text-white stroke-[2]" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
            Welcome Back!
          </h1>
          <p className="text-xs font-medium text-white/90">
            Enter your email address to continue
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="w-full space-y-4 pt-1">
          {/* Email Input */}
          <div className="space-y-1 text-left">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/80">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                required
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full py-3.5 pl-12 pr-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 font-semibold text-sm focus:outline-none focus:border-white focus:bg-white/20 transition-all tracking-wide shadow-inner"
              />
            </div>
            {touched && email.trim() && !isValidEmail && (
              <p className="text-xs text-rose-200 font-medium pl-2 pt-1">
                Please enter a valid email address (e.g. name@example.com)
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={!isValidEmail || isSubmitting}
            className="w-full py-3.5 px-6 bg-slate-950/90 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-glass transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending OTP...</span>
              </div>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Send OTP</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-[11px] text-white/75 font-medium tracking-wide uppercase relative z-10">
        Commodity Brokerage Management System
      </div>
    </div>
  );
};
