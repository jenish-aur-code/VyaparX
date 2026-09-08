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
      className="min-h-screen flex flex-col items-center justify-between p-6 md:p-12 text-white transition-colors"
      style={{ backgroundColor: palette.primary }}
    >
      <div className="w-full flex justify-end">
        {/* Top spacer */}
      </div>

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Briefcase App Icon */}
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xs flex items-center justify-center border-2 border-white/20 shadow-2xl">
          <Briefcase className="w-14 h-14 text-white stroke-[2]" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
            Welcome Back!
          </h1>
          <p className="text-sm font-medium text-white/90">
            Enter your email address to continue
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="w-full space-y-4 pt-2">
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
                className="w-full py-4 pl-12 pr-5 bg-transparent border-2 border-white/60 rounded-2xl text-white placeholder-white/70 font-semibold text-base focus:outline-none focus:border-white transition-all tracking-wide"
              />
            </div>
            {touched && email.trim() && !isValidEmail && (
              <p className="text-xs text-white/90 font-medium pl-2 pt-1">
                Please enter a valid email address (e.g. name@example.com)
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={!isValidEmail || isSubmitting}
            className="w-full py-4 px-6 bg-[#111827] hover:bg-black text-white font-bold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending OTP...</span>
              </div>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                <span>Send OTP</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-xs text-white/70 font-medium">
        Commodity Brokerage Management System
      </div>
    </div>
  );
};
