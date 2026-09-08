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
  Sun,
  Moon,
  Palette,
  Globe,
  X,
  Mail,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme, THEME_PALETTES, type ThemeColor } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChangeCompanyFYModal } from './ChangeCompanyFYModal';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { userProfile, lockApp, currentCompany } = useApp();
  const { currentUser, logout } = useAuth();
  const { isDarkMode, setDarkMode, themeColor, setThemeColor, palette } = useTheme();
  const { language, setLanguage, languages, t } = useLanguage();

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
        title: 'VyaparX',
        text: `Manage your commodity brokerage effortlessly on VyaparX! Use my code ${referralCode}`,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      handleCopyReferral();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      {/* Header Replicating Screenshot 15 */}
      <PageHeader title={t('profile.title', 'My Profile')} />

      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-4">
        {/* Top Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 card-shadow flex flex-col items-center text-center transition-colors">
          {/* Avatar with Edit Icon linking to Company Edit */}
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full text-white flex items-center justify-center text-3xl font-black shadow-lg uppercase"
              style={{ backgroundColor: palette.primary }}
            >
              {currentCompany?.name?.charAt(0) || userProfile?.name?.charAt(0) || 'C'}
            </div>
            <button
              type="button"
              onClick={() => {
                if (currentCompany?.id) {
                  navigate(`/companies/edit/${currentCompany.id}`);
                } else {
                  navigate('/companies');
                }
              }}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center justify-center shadow-sm hover:text-[var(--primary)] transition-colors"
              title="Edit Company Details"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight uppercase">
            {currentCompany?.name || userProfile?.name || 'COMPANY NAME'}
          </h2>
          <p className="text-xs font-bold mt-0.5 uppercase tracking-wide" style={{ color: palette.primary }}>
            {currentCompany?.username ? `Username: ${currentCompany.username}` : (userProfile?.name ? `Username: ${userProfile.name}` : '')}
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
            {currentCompany?.city ? `${currentCompany.city}, ${currentCompany.state}` : 'BOTAD, GUJARAT'} • {currentCompany?.contactNumber || userProfile?.phone || ''}
          </p>
        </div>

        {/* 1. Personal Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 card-shadow space-y-4 transition-colors">
          <div className="flex items-center gap-2 font-bold text-sm" style={{ color: palette.primary }}>
            <User className="w-4 h-4" />
            <span>{t('profile.personalInfo', 'Personal Information')}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">{t('profile.phone', 'Phone Number')}:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {currentCompany?.contactNumber || userProfile?.phone || '9574823170'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Email:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-xs lowercase">
              {currentCompany?.email || currentCompany?.userEmail || currentUser?.email || 'krishnafibers@gmail.com'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowSwitchModal(true)}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-900 dark:text-gray-100 font-bold hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: palette.light, color: palette.primary }}
              >
                <Repeat className="w-4 h-4" />
              </div>
              <span>{t('profile.changeCompany', 'Change company / financial year')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* App Language Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 card-shadow space-y-4 transition-colors">
          <div className="flex items-center gap-2 font-bold text-sm" style={{ color: palette.primary }}>
            <Globe className="w-4 h-4" />
            <span>{t('profile.appLanguage', 'App Language')}</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {t('profile.selectLanguageDesc', 'Choose your preferred language for VyaparX')}
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {languages.map(item => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    toast.success(`Language set to ${item.nativeLabel}`);
                  }}
                  className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? 'border-gray-900 dark:border-white ring-2 ring-orange-200 dark:ring-gray-600 bg-orange-50/50 dark:bg-gray-700 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {item.nativeLabel}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Theme & Appearance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 card-shadow space-y-4 transition-colors">
          <div className="flex items-center gap-2 font-bold text-sm" style={{ color: palette.primary }}>
            <Palette className="w-4 h-4" />
            <span>{t('profile.themeAppearance', 'App Theme & Appearance')}</span>
          </div>

          {/* Dark / Light Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {t('common.appearance', 'Appearance Mode')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all ${
                  !isDarkMode
                    ? 'border-gray-900 dark:border-white bg-orange-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{t('common.lightMode', 'Light Mode')}</span>
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all ${
                  isDarkMode
                    ? 'border-gray-900 dark:border-white bg-gray-700 text-white shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>{t('common.darkMode', 'Dark Mode')}</span>
              </button>
            </div>
          </div>

          {/* Accent Color Palettes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {t('profile.brandAccent', 'Brand Accent Color')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(THEME_PALETTES) as ThemeColor[]).map(c => {
                const item = THEME_PALETTES[c];
                const isSelected = themeColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setThemeColor(c)}
                    className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-gray-900 dark:border-white ring-2 ring-orange-200 dark:ring-gray-600 bg-gray-50 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full shadow-xs flex items-center justify-center text-white"
                      style={{ backgroundColor: item.primary }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate max-w-full">
                      {item.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Reports Card (Screenshots 15 & 17) */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 card-shadow space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Reports</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/profile/reports')}
            className="w-full flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 font-semibold hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>Brok.Total Amt Party Wise Report</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/vyapar/bills')}
            className="w-full flex items-center justify-between py-2.5 text-sm text-gray-800 dark:text-gray-200 font-semibold hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span>Generated Brok. Bills</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 3. Quick Values Card (Screenshot 17) */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 card-shadow space-y-3 transition-colors">
          <div className="flex items-center gap-2 font-bold text-sm" style={{ color: palette.primary }}>
            <Zap className="w-4 h-4" style={{ color: palette.primary }} />
            <span>Quick Values</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Save shortcuts for order fields used while creating vyapar.
          </p>

          <button
            type="button"
            onClick={() => navigate('/profile/quick-values')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-800 dark:text-gray-200 font-semibold hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: palette.light, color: palette.primary }}
              >
                <Settings className="w-4 h-4" />
              </div>
              <span>Manage Quick Values</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 4. Legal & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 card-shadow space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Legal & Support</span>
          </div>

          {/* Share App (Moved from Referrals) */}
          <button
            type="button"
            onClick={handleShareApp}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-[var(--primary)] dark:hover:text-[var(--primary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-4 h-4" style={{ color: palette.primary }} />
              <span>Share App</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/legal/terms')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
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
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
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
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>How to Use App</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.success('Thank you for rating VyaparX 5 stars! ⭐⭐⭐⭐⭐')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Rate Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => toast.info('VyaparX v1.0. Developed for Commodity & Agro Brokers.')}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-teal-600" />
              <span>About Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
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
          <span>{t('profile.logout', 'Logout')}</span>
        </button>
      </div>

      {/* Switch Company / FY Modal */}
      {showSwitchModal && (
        <ChangeCompanyFYModal
          isOpen={showSwitchModal}
          onClose={() => setShowSwitchModal(false)}
        />
      )}

      {/* Selected Company Contact Us Popup Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white uppercase tracking-tight">
                  {currentCompany?.name || 'Company Contact'}
                </h3>
                {currentCompany?.username && (
                  <p className="text-xs font-bold uppercase mt-0.5" style={{ color: palette.primary }}>
                    @{currentCompany.username}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Phone / Mobile */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-gray-400">Mobile Number</div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {currentCompany?.contactNumber || userProfile?.phone || '9574823170'}
                    </div>
                  </div>
                </div>
                {(currentCompany?.contactNumber || userProfile?.phone) && (
                  <a
                    href={`tel:${currentCompany?.contactNumber || userProfile?.phone}`}
                    style={{ backgroundColor: palette.primary }}
                    className="px-3 py-1.5 text-white text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                  >
                    Call
                  </a>
                )}
              </div>

              {/* Email */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase text-gray-400">Email Address</div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[160px]">
                      {currentCompany?.email || currentCompany?.userEmail || currentUser?.email || 'krishnafibers@gmail.com'}
                    </div>
                  </div>
                </div>
                {(currentCompany?.email || currentCompany?.userEmail || currentUser?.email) && (
                  <a
                    href={`mailto:${currentCompany?.email || currentCompany?.userEmail || currentUser?.email}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Email
                  </a>
                )}
              </div>

              {/* Address */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase text-gray-400">Business Address</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 uppercase leading-relaxed">
                  {currentCompany?.address || 'PALIYAD ROAD BOTAD'}
                  {currentCompany?.city ? `, ${currentCompany.city}` : ', BOTAD'}
                  {currentCompany?.state ? `, ${currentCompany.state}` : ', GUJARAT'}
                  {currentCompany?.pinCode ? ` - ${currentCompany.pinCode}` : ' - 364710'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
