import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { palette } = useTheme();
  const { currentUser, logout } = useAuth();
  const {
    companies,
    currentCompany,
    setCurrentCompany,
    financialYears,
    currentFinancialYear,
    setCurrentFinancialYear,
    isLoading,
  } = useApp();

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>('');
  const [selectedFY, setSelectedFY] = useState<string>('2026-2027');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // If no companies found after loading, automatically redirect to create company (CASE 2)
  useEffect(() => {
    if (!isLoading) {
      if (companies.length === 0) {
        toast.info("Please create your first company to continue.");
        navigate('/create-first-company', { replace: true });
      } else {
        if (!selectedCompanyId) {
          const initialId = currentCompany?.id || companies[0]?.id || '';
          setSelectedCompanyId(initialId);
        }
      }
    }
  }, [isLoading, companies, currentCompany, navigate, selectedCompanyId, toast]);

  useEffect(() => {
    if (currentFinancialYear) {
      setSelectedFY(currentFinancialYear);
    } else if (financialYears.length > 0) {
      const defaultFY = financialYears.find(f => f.isCurrent)?.id || financialYears[0]?.id || '2026-2027';
      setSelectedFY(defaultFY);
    }
  }, [currentFinancialYear, financialYears]);

  const handleContinue = async () => {
    if (!selectedCompanyId) {
      toast.error('Please select a company to continue.');
      return;
    }

    const compId = Number(selectedCompanyId);
    const comp = companies.find(c => c.id === compId);

    if (!comp) {
      toast.error("You don't have access to this company.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Backend validation of company ownership/access
      const isAuthorized = await authService.validateCompanyAccess(compId);
      if (!isAuthorized) {
        toast.error("You don't have access to this company.");
        return;
      }

      setCurrentCompany(comp);

      if (selectedFY) {
        setCurrentFinancialYear(selectedFY);
      }

      navigate('/home');
    } catch {
      toast.error('Failed to select company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-6 md:p-12 text-white transition-colors"
      style={{ backgroundColor: palette.primary }}
    >
      {/* Top Bar with Logged In User and Logout */}
      <div className="w-full max-w-sm flex justify-between items-center text-xs font-semibold text-white/90">
        <span className="truncate max-w-[200px]" title={currentUser?.email || ''}>
          {currentUser?.email || ''}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 hover:text-black transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Briefcase App Icon matching Image 3 */}
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xs flex items-center justify-center border-2 border-white/20 shadow-2xl">
          <Briefcase className="w-14 h-14 text-white stroke-[2]" />
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
            VyaparX
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">
            Select Company
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          {/* Select Company Dropdown matching Image 3 */}
          <div className="relative">
            <select
              value={selectedCompanyId}
              onChange={e => setSelectedCompanyId(e.target.value)}
              className="w-full py-4 px-5 bg-transparent border-2 border-white/60 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-white appearance-none cursor-pointer tracking-wide"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id} className="text-gray-900 font-semibold">
                  {c.name} {c.username ? `(${c.username})` : ''} {c.isDefault ? ' • Default' : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Select Financial Year Dropdown matching Image 3 */}
          <div className="relative">
            <select
              value={selectedFY}
              onChange={e => setSelectedFY(e.target.value)}
              className="w-full py-4 px-5 bg-transparent border-2 border-white/60 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-white appearance-none cursor-pointer tracking-wide"
            >
              {financialYears.map(fy => (
                <option key={fy.id} value={fy.id} className="text-gray-900 font-semibold">
                  {fy.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Continue Button matching Image 3 */}
          <button
            type="button"
            disabled={!selectedCompanyId || isSubmitting}
            onClick={handleContinue}
            className="w-full py-4 px-6 bg-[#111827] hover:bg-black text-white font-bold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Opening Application...</span>
              </div>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                <span>Continue</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="text-xs text-white/70 font-medium">
        Commodity Brokerage Management System
      </div>
    </div>
  );
};
