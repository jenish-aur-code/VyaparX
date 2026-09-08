import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Plus,
  ShieldCheck,
  Sun,
  Moon,
  Palette,
  Check,
  Globe,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme, THEME_PALETTES, type ThemeColor } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
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
  } = useApp();
  const { isDarkMode, toggleDarkMode, themeColor, setThemeColor, palette } = useTheme();
  const { language, setLanguage, languages, currentLanguageConfig, t } = useLanguage();
  const navigate = useNavigate();

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);
  const langPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themePickerRef.current && !themePickerRef.current.contains(e.target as Node)) {
        setShowThemePicker(false);
      }
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="flex md:hidden items-center justify-between px-3.5 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors shadow-xs">
        <Link to="/home" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg text-white flex items-center justify-center shadow-xs shrink-0"
            style={{ backgroundColor: palette.primary }}
          >
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-black text-base tracking-tight text-gray-900 dark:text-white">
            VyaparX
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Mobile Language Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangPicker(prev => !prev);
                setShowThemePicker(false);
              }}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-extrabold flex items-center gap-1 shadow-xs"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" style={{ color: palette.primary }} />
              <span>{currentLanguageConfig.shortLabel}</span>
            </button>

            {showLangPicker && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in space-y-1">
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
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors ${
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

          {/* Mobile Theme Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowThemePicker(prev => !prev);
                setShowLangPicker(false);
              }}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-xs flex items-center"
              title="Theme Color"
            >
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: palette.primary }} />
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  {t('common.themeColors', 'Theme Colors')}
                </div>
                {(Object.keys(THEME_PALETTES) as ThemeColor[]).map(key => {
                  const item = THEME_PALETTES[key];
                  const isSelected = themeColor === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setThemeColor(key);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.primary }} />
                        <span>{item.label}</span>
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
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-gray-600" />}
          </button>
        </div>
      </header>

      {/* Desktop Top Navigation Bar */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 transition-colors">
        <div className="flex items-center gap-4">
          {/* Company Switcher */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 hover:border-[var(--primary)] transition-colors">
            <Building2 className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
            <select
              value={currentCompany?.id || ''}
              onChange={e => {
                const comp = companies.find(c => c.id === Number(e.target.value));
                if (comp) setCurrentCompany(comp);
              }}
              className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer pr-1"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {c.name} {c.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Financial Year Switcher */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 hover:border-[var(--primary)] transition-colors">
            <Calendar className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
            <select
              value={currentFinancialYear}
              onChange={e => setCurrentFinancialYear(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer pr-1"
            >
              {financialYears.map(fy => (
                <option key={fy.id} value={fy.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {t('common.financialYear', 'FY')}: {fy.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowLangPicker(prev => !prev);
                setShowThemePicker(false);
              }}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-xs flex items-center gap-2 text-xs font-bold"
              title="Change Language"
            >
              <Globe className="w-4 h-4" style={{ color: palette.primary }} />
              <span>{currentLanguageConfig.nativeLabel}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-extrabold">
                {currentLanguageConfig.shortLabel}
              </span>
            </button>

            {showLangPicker && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in space-y-1">
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

          {/* Theme Color Picker */}
          <div className="relative" ref={themePickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowThemePicker(prev => !prev);
                setShowLangPicker(false);
              }}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-xs flex items-center gap-1.5"
              title="Choose Theme Color"
            >
              <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: palette.primary }} />
              <Palette className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  {t('common.themeColors', 'Theme Colors')}
                </div>
                {(Object.keys(THEME_PALETTES) as ThemeColor[]).map(key => {
                  const item = THEME_PALETTES[key];
                  const isSelected = themeColor === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setThemeColor(key);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.primary }} />
                        <span>{item.label}</span>
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
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          {/* New Sauda Button */}
          <button
            type="button"
            onClick={() => navigate('/sauda/create')}
            style={{ backgroundColor: palette.primary }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:opacity-90 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('nav.newSauda', 'New Sauda')}</span>
          </button>

          {/* Profile Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-3 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold transition-colors"
          >
            <div
              className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black"
              style={{ backgroundColor: palette.primary }}
            >
              {userProfile?.name?.charAt(0) || 'J'}
            </div>
            <span>{userProfile?.name || 'JENISH'}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
          </Link>
        </div>
      </header>
    </>
  );
};
