import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const PinLockModal: React.FC = () => {
  const { isPinLocked, unlockWithPin, userProfile } = useApp();
  const { palette } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const toast = useToast();

  if (!isPinLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockWithPin(pin)) {
      toast.success('App unlocked successfully');
      setPin('');
      setError(false);
    } else {
      setError(true);
      toast.error('Incorrect PIN. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ backgroundColor: palette.primary + 'E6' }}
    >
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 border border-gray-100 dark:border-gray-700">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner border"
          style={{ backgroundColor: palette.light, color: palette.primary, borderColor: palette.primary + '33' }}
        >
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1">
          VyaparX Locked
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
          Welcome back {userProfile?.name || 'JENISH'}, enter your security PIN to continue.
        </p>

        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={e => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="Enter 4 or 6 digit PIN"
            autoFocus
            className={`w-full py-3 px-4 text-center tracking-[0.5em] text-2xl font-bold bg-gray-50 dark:bg-gray-900 border-2 rounded-2xl focus:outline-none transition-all ${
              error
                ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-300'
                : 'border-gray-200 dark:border-gray-700 focus:border-[var(--primary)] text-gray-900 dark:text-gray-100'
            }`}
          />

          <button
            type="submit"
            disabled={!pin}
            style={{ backgroundColor: palette.primary }}
            className="w-full py-3.5 px-4 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90"
          >
            <Unlock className="w-5 h-5" />
            <span>Unlock Application</span>
          </button>
        </form>
      </div>
    </div>
  );
};
