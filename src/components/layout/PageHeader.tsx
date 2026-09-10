import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  companyInfo?: {
    companyName?: string;
    financialYear?: string;
  };
  showBack?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
  rightAction?: React.ReactNode;
  onSearchByGst?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  companyInfo,
  showBack = true,
  onBack,
  onRefresh,
  rightAction,
  onSearchByGst,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white/75 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-white/40 dark:border-white/10 px-3.5 sm:px-4 py-3 sm:py-3.5 sticky top-0 z-10 flex items-center justify-between gap-3 shadow-glass dark:shadow-glass-dark transition-all min-w-0">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="p-1.5 -ml-1 text-gray-800 dark:text-gray-200 hover:text-[var(--primary)] rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 active:scale-95 transition-all shrink-0"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.3]" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-xl font-black text-[#1E293B] dark:text-white tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{subtitle}</p>
          )}
          {companyInfo && (
            <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5 min-w-0">
              {companyInfo.financialYear && (
                <div className="truncate">FY: <span className="text-gray-700 dark:text-gray-200 font-semibold">{companyInfo.financialYear}</span></div>
              )}
              {companyInfo.companyName && (
                <div className="truncate">Company: <span className="text-gray-700 dark:text-gray-200 font-semibold">{companyInfo.companyName}</span></div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onSearchByGst && (
          <button
            type="button"
            onClick={onSearchByGst}
            className="text-xs font-bold text-[var(--primary)] hover:opacity-80 transition-opacity py-1.5 px-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 shadow-2xs active:scale-95"
          >
            Search by GST
          </button>
        )}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)] rounded-xl bg-white/60 dark:bg-gray-800/50 hover:bg-white/90 dark:hover:bg-gray-800/80 border border-white/60 dark:border-white/10 shadow-2xs transition-all active:rotate-180 duration-300"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4 stroke-[2]" />
          </button>
        )}
        {rightAction}
      </div>
    </div>
  );
};
