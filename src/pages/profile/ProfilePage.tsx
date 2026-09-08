import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Edit2,
  Repeat,
  BarChart3,
  FileText,
  Zap,
  Settings,
  Shield,
  Lock,
  Users2,
  Copy,
  Share2,
  LogOut,
  HelpCircle,
  FileCheck,
  Star,
  Info,
  Smartphone,
  ChevronRight,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ChangeCompanyFYModal } from './ChangeCompanyFYModal';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userProfile, lockApp } = useApp();

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = userProfile?.referralCode || 'LHPXC3';

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sauda Book',
        text: `Manage your commodity brokerage effortlessly on Sauda Book! Use my code ${referralCode}`,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      handleCopyReferral();
    }
  };

  const handleLogout = () => {
    lockApp();
    navigate('/splash');
    toast.info('Logged out to Company Selection');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      {/* Header Replicating Screenshot 15 */}
      <PageHeader title="My Profile" />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-4">
        {/* Top Profile Card (Screenshot 15) */}
        <div className="bg-white rounded-3xl p-6 card-shadow flex flex-col items-center text-center">
          {/* Avatar with Edit Icon */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-[#FF9800] text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-orange-500/20">
              {userProfile?.name?.charAt(0) || 'J'}
            </div>
            <button
              onClick={() => toast.info('Profile name: ' + userProfile?.name)}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-sm hover:text-[#FF9800]"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {userProfile?.name || 'JENISH'}
          </h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            {userProfile?.phone || '9574823170'}
          </p>

          {/* Status Badges matching Screenshot 15 */}
          <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs tracking-wider">
              {userProfile?.plan || 'FREE'}
            </span>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs">
              Renews 8/10/2026 (30 days left)
            </span>
          </div>
        </div>

        {/* 1. Personal Information Card (Screenshot 15) */}
        <div className="bg-white rounded-3xl p-5 card-shadow space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <User className="w-4 h-4 text-[#FF9800]" />
            <span>Personal Information</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 text-sm">
            <span className="text-gray-600 font-medium">Phone Number:</span>
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span>{userProfile?.phone || '9574823170'}</span>
              <Edit2 className="w-3.5 h-3.5 text-orange-500 cursor-pointer" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSwitchModal(true)}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-900 font-bold hover:text-[#FF9800] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <span>Change company / financial year</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 2. Reports Card (Screenshots 15 & 17) */}
        <div className="bg-white rounded-3xl p-5 card-shadow space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Reports</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/profile/reports')}
            className="w-full flex items-center justify-between py-2.5 border-b border-gray-100 text-sm text-gray-800 font-semibold hover:text-[#FF9800] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>Brok.Total Amt Party Wise Report</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/sauda/bills')}
            className="w-full flex items-center justify-between py-2.5 text-sm text-gray-800 font-semibold hover:text-[#FF9800] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span>Generated Brok. Bills</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 3. Quick Values Card (Screenshot 17) */}
        <div className="bg-white rounded-3xl p-5 card-shadow space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <Zap className="w-4 h-4 text-[#FF9800]" />
            <span>Quick Values</span>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            Save shortcuts for order fields used while creating sauda.
          </p>

          <button
            type="button"
            onClick={() => navigate('/profile/quick-values')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-800 font-semibold hover:text-[#FF9800] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span>Manage Quick Values</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 4. Security Card (Screenshot 16) */}
        <div className="bg-white rounded-3xl p-5 card-shadow space-y-3">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Security</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/profile/security')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-800 font-semibold hover:text-purple-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <span>Set PIN</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 5. Referrals Card (Screenshot 16) */}
        <div className="bg-white rounded-3xl p-5 card-shadow space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Users2 className="w-4 h-4 text-emerald-600" />
            <span>Referrals</span>
          </div>

          {/* Referral Code Box */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Your Referral Code
              </div>
              <div className="text-2xl font-black text-emerald-900 tracking-widest mt-0.5">
                {referralCode}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyReferral}
              className="p-2.5 bg-white text-emerald-700 rounded-xl shadow-xs hover:bg-emerald-100 transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleShareApp}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-800 font-semibold hover:text-emerald-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              <span>Share App</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/profile/referrals')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-800 font-semibold hover:text-emerald-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users2 className="w-4 h-4" />
              </div>
              <span>My Referral Users</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 6. Legal & Support (Screenshots 16 & 17) */}
        <div className="bg-white rounded-3xl p-5 card-shadow space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span>Legal & Support</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/legal/terms')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 font-medium hover:text-teal-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span>Terms & Conditions</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/legal/privacy')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 font-medium hover:text-teal-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/legal/how-to-use')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 font-medium hover:text-teal-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>How to Use App</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.success('Thank you for rating Sauda Book 5 stars! ⭐⭐⭐⭐⭐')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 font-medium hover:text-teal-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Rate Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.info('Sauda Book v1.0. Developed for Commodity & Agro Brokers.')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 font-medium hover:text-teal-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-teal-600" />
              <span>About Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.info('Support: support@saudabook.com | +91 9574823170')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 font-medium hover:text-teal-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>Contact Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Logout Red Button matching Screenshot 16 */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-4 px-4 bg-[#DC2626] hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Switch Company / FY Modal */}
      {showSwitchModal && (
        <ChangeCompanyFYModal
          isOpen={showSwitchModal}
          onClose={() => setShowSwitchModal(false)}
        />
      )}
    </div>
  );
};
