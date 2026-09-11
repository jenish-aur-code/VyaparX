import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Plus,
  ShieldCheck,
  Sun,
  Moon,
  Check,
  Globe,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePwa } from '../../context/PwaContext';
import { Language } from '../../i18n/translations';

export const TopHeader: React.FC = () => {
  const {
    currentCompany,
    setCurrentCompany,
    companies,
    currentFinancialYear,
    setCurrentFinancialYear,
    financialYears,
    userProfile,
    isSidebarCollapsed,
    toggleSidebar,
  } = useApp();
  const { isDarkMode, toggleDarkMode, palette } = useTheme();
  const { language, setLanguage, languages, currentLanguageConfig, t } = useLanguage();
  const { isInstalled, promptInstall } = usePwa();
  const navigate = useNavigate();

  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showFyPicker, setShowFyPicker] = useState(false);

  const langPickerRef = useRef<HTMLDivElement>(null);
  const mobileLangPickerRef = useRef<HTMLDivElement>(null);
  const companyPickerRef = useRef<HTMLDivElement>(null);
  const fyPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (!target) return;

      const isLangClick =
        (langPickerRef.current && langPickerRef.current.contains(target)) ||
        (mobileLangPickerRef.current && mobileLangPickerRef.current.contains(target));
      if (!isLangClick) {
        setShowLangPicker(false);
      }

      if (companyPickerRef.current && !companyPickerRef.current.contains(target)) {
        setShowCompanyPicker(false);
      }
      if (fyPickerRef.current && !fyPickerRef.current.contains(target)) {
        setShowFyPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const isAnyDropdownOpen = showLangPicker || showCompanyPicker || showFyPicker;

  return (
    <>
      {/* Mobile Top Navigation Bar (iOS Frosted Glass) */}
      <header className="flex md:hidden items-center justify-between px-3.5 py-2.5 bg-white/90 dark:bg-gray-900/90 border-b border-white/40 dark:border-white/10 shrink-0 relative z-40 transition-all shadow-glass dark:shadow-glass-dark">
        <Link to="/home" className="flex items-center shrink-0 group py-0.5">
          <img
            src="/logo-name.png"
            alt="VyaparX - Business Made Simple"
            className="h-8 sm:h-9 w-auto max-w-[145px] object-contain transition-transform active:scale-95 dark:drop-shadow-[0_1px_4px_rgba(255,255,255,0.35)]"
          />
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Mobile Language Picker */}
          <div className="relative" ref={mobileLangPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowLangPicker(prev => !prev);
              }}
              className="px-2 py-1 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl text-gray-700 dark:text-gray-200 text-xs font-extrabold flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" style={{ color: palette.primary }} />
              <span>{currentLanguageConfig.shortLabel}</span>
            </button>

            {showLangPicker && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-glass-hover border border-white/60 dark:border-white/15 p-2 z-50 animate-in fade-in duration-150 space-y-1"
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  {t('common.selectLanguage', 'Select Language')}
                </div>
                {languages.map(item => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code as Language);
                        setShowLangPicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold">{item.nativeLabel}</span>
                        <span className="text-[10px] text-gray-400">{item.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl text-gray-700 dark:text-gray-200 shadow-2xs active:scale-95"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-gray-600" />}
          </button>

          {/* Mobile Download Web App Button */}
          <button
            type="button"
            onClick={promptInstall}
            className="p-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/30 backdrop-blur-xl text-blue-600 dark:text-blue-400 shadow-2xs flex items-center justify-center active:scale-95"
            title={isInstalled ? t('nav.appInstalled', 'App Installed') : t('nav.downloadApp', 'Download App')}
            aria-label="Download App"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Desktop Top Navigation Bar (iOS Frosted Glass) - Exact h-16 to match DesktopSidebar Brand Header */}
      <header className="hidden md:flex items-center justify-between px-4 lg:px-6 h-16 bg-white/90 dark:bg-gray-900/90 border-b border-white/40 dark:border-white/10 shrink-0 relative z-40 transition-all shadow-glass dark:shadow-glass-dark gap-2 min-w-0">
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          {/* Sidebar Toggle Button (Collapse / Expand Left Navigation) */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl text-gray-700 dark:text-gray-200 hover:bg-white/85 dark:hover:bg-gray-750 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
            title={isSidebarCollapsed ? t('nav.expandMenu', 'Expand Sidebar Menu') : t('nav.collapseMenu', 'Collapse Sidebar Menu')}
            aria-label="Toggle Sidebar Menu"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 stroke-[2.2]" />
            )}
          </button>

          {/* Custom Frosted Glass Company Switcher Dropdown */}
          <div className="relative" ref={companyPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowCompanyPicker(prev => !prev);
                setShowFyPicker(false);
                setShowLangPicker(false);
              }}
              className="flex items-center gap-1.5 lg:gap-2 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl px-2.5 lg:px-3.5 py-1.5 hover:border-[var(--primary)] shadow-2xs transition-all min-w-0 cursor-pointer active:scale-98"
              title={t('common.selectCompany', 'Select Company')}
            >
              <Building2 className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-100 max-w-[100px] lg:max-w-[160px] truncate">
                {currentCompany?.name || 'Select Company'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${showCompanyPicker ? 'rotate-180' : ''}`} />
            </button>

            {showCompanyPicker && (
              <div 
                className="absolute left-0 mt-3 w-64 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl p-2.5 z-50 animate-in fade-in duration-150 space-y-1 shadow-glass-hover border border-white/60 dark:border-white/15"
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1 flex items-center justify-between">
                  <span>{t('common.selectCompany', 'Select Company')}</span>
                  <span className="text-[9px] font-semibold text-gray-400">({companies.length})</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {companies.map(comp => {
                    const isSelected = currentCompany?.id === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          setCurrentCompany(comp);
                          setShowCompanyPicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                          isSelected
                            ? 'bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white shadow-xs'
                            : 'hover:bg-white/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: isSelected ? palette.primary : undefined }} />
                          <span className="truncate">{comp.name}</span>
                          {comp.isDefault && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 font-extrabold">
                              Default
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Custom Frosted Glass Financial Year Switcher Dropdown */}
          <div className="relative" ref={fyPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowFyPicker(prev => !prev);
                setShowCompanyPicker(false);
                setShowLangPicker(false);
              }}
              className="flex items-center gap-1.5 lg:gap-2 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl px-2.5 lg:px-3.5 py-1.5 hover:border-[var(--primary)] shadow-2xs transition-all shrink-0 cursor-pointer active:scale-98"
              title="Select Financial Year"
            >
              <Calendar className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                {t('common.financialYear', 'FY')}: {currentFinancialYear}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${showFyPicker ? 'rotate-180' : ''}`} />
            </button>

            {showFyPicker && (
              <div 
                className="absolute left-0 mt-3 w-52 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl p-2.5 z-50 animate-in fade-in duration-150 space-y-1 shadow-glass-hover border border-white/60 dark:border-white/15"
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1">
                  {t('common.financialYear', 'Financial Year')}
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {financialYears.map(fy => {
                    const isSelected = currentFinancialYear === fy.id;
                    return (
                      <button
                        key={fy.id}
                        type="button"
                        onClick={() => {
                          setCurrentFinancialYear(fy.id);
                          setShowFyPicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                          isSelected
                            ? 'bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white shadow-xs'
                            : 'hover:bg-white/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: isSelected ? palette.primary : undefined }} />
                          <span>{fy.name}</span>
                          {fy.isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold">
                              Current
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3] ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 lg:gap-2.5 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowLangPicker(prev => !prev);
                setShowCompanyPicker(false);
                setShowFyPicker(false);
              }}
              className="px-2.5 lg:px-3 py-1.5 rounded-2xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-750 transition-colors shadow-2xs flex items-center gap-1.5 text-xs font-bold active:scale-98"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 lg:w-4 lg:h-4" style={{ color: palette.primary }} />
              <span className="hidden lg:inline">{currentLanguageConfig.nativeLabel}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 font-extrabold">
                {currentLanguageConfig.shortLabel}
              </span>
            </button>

            {showLangPicker && (
              <div 
                className="absolute right-0 mt-3 w-52 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl p-2.5 z-50 animate-in fade-in duration-150 space-y-1 shadow-glass-hover border border-white/60 dark:border-white/15"
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              >
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1">
                  {t('common.selectLanguage', 'Select Language')}
                </div>
                {languages.map(item => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code as Language);
                        setShowLangPicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white shadow-xs'
                          : 'hover:bg-white/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold">{item.nativeLabel}</span>
                        <span className="text-[10px] text-gray-400">{item.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-1.5 lg:p-2 rounded-2xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-750 transition-colors shadow-2xs active:scale-98"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />}
          </button>

          {/* Download Web App Button */}
          <button
            type="button"
            onClick={promptInstall}
            className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-2xl border border-blue-200/80 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-950/30 backdrop-blur-xl text-blue-700 dark:text-blue-300 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 transition-all shadow-2xs text-xs font-bold active:scale-98 cursor-pointer"
            title={isInstalled ? t('nav.appInstalled', 'App Installed') : t('nav.downloadApp', 'Download App')}
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5] text-blue-600 dark:text-blue-400" />
            <span className="hidden xl:inline">{isInstalled ? t('nav.appInstalled', 'App Installed') : t('nav.downloadApp', 'Download App')}</span>
          </button>

          {/* New Vyapar Button */}
          <button
            type="button"
            onClick={() => navigate('/vyapar/create')}
            style={{ backgroundColor: palette.primary }}
            className="flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/25 transition-all hover:opacity-95 active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">{t('nav.newSauda', 'New Vyapar')}</span>
          </button>

          {/* Profile Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-1.5 lg:gap-2 pl-2 lg:pl-3 pr-2 lg:pr-3 py-1.5 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-750 rounded-2xl border border-white/60 dark:border-white/10 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all shadow-2xs active:scale-98 min-w-0"
          >
            <div
              className="w-5 h-5 lg:w-6 lg:h-6 rounded-full text-white flex items-center justify-center text-[10px] lg:text-xs font-black shadow-xs shrink-0"
              style={{ backgroundColor: palette.primary }}
            >
              {userProfile?.name?.charAt(0) || 'J'}
            </div>
            <span className="truncate max-w-[60px] lg:max-w-[100px]">{userProfile?.name || 'JENISH'}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 hidden sm:inline" />
          </Link>
        </div>
      </header>
    </>
  );
};
