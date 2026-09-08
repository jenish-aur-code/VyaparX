import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { profileService } from '../../services/profileService';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const PinSecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userProfile, refreshAppContext, lockApp } = useApp();

  const [pinEnabled, setPinEnabled] = useState(userProfile?.isPinEnabled || false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEnabled) {
      if (newPin.length < 4) {
        toast.error('PIN must be at least 4 digits');
        return;
      }
      if (newPin !== confirmPin) {
        toast.error('PIN and Confirm PIN do not match');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await profileService.updateProfile({
        isPinEnabled: pinEnabled,
        pin: pinEnabled ? newPin : '',
      });
      await refreshAppContext();
      toast.success('Security PIN settings updated successfully');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to update PIN settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader title="Security & PIN" />

      <div className="p-4 md:p-6 max-w-md mx-auto space-y-5">
        <div className="bg-white rounded-3xl p-6 card-shadow space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">App Passcode Lock</h2>
              <p className="text-xs text-gray-500">Protect access to your trade records</p>
            </div>
          </div>

          <form onSubmit={handleSavePin} className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-gray-800">Enable PIN Lock</span>
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={e => setPinEnabled(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>

            {pinEnabled && (
              <div className="space-y-3 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    New PIN (4 digits)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="input-sauda text-center tracking-[0.5em] text-xl font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    className="input-sauda text-center tracking-[0.5em] text-xl font-black"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save PIN Settings'}
            </button>
          </form>

          {userProfile?.isPinEnabled && (
            <button
              type="button"
              onClick={lockApp}
              className="w-full py-2.5 px-4 border border-purple-200 text-purple-700 font-bold rounded-xl text-xs hover:bg-purple-50 transition-colors"
            >
              Lock App Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
