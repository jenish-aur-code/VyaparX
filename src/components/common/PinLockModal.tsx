import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const PinLockModal: React.FC = () => {
  const { isPinLocked, unlockWithPin, userProfile } = useApp();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FF9800] backdrop-blur-md">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#FF9800] flex items-center justify-center mb-4 shadow-inner">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
          Sauda Book Locked
        </h2>
        <p className="text-xs text-gray-500 mb-6 font-medium">
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
            className={`w-full py-3 px-4 text-center tracking-[0.5em] text-2xl font-bold bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
              error
                ? 'border-red-500 bg-red-50 text-red-900'
                : 'border-gray-200 focus:border-[#FF9800] focus:bg-white text-gray-900'
            }`}
          />

          <button
            type="submit"
            disabled={!pin}
            className="w-full py-3.5 px-4 bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold rounded-2xl shadow-md shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Unlock className="w-5 h-5" />
            <span>Unlock Application</span>
          </button>
        </form>
      </div>
    </div>
  );
};
