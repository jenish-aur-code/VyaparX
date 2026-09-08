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
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="p-1 -ml-1 text-gray-800 dark:text-gray-200 hover:text-[var(--primary)] active:scale-95 transition-all"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] dark:text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{subtitle}</p>
          )}
          {companyInfo && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5">
              {companyInfo.financialYear && (
                <div>Financial Year: <span className="text-gray-700 dark:text-gray-200 font-semibold">{companyInfo.financialYear}</span></div>
              )}
              {companyInfo.companyName && (
                <div>Company: <span className="text-gray-700 dark:text-gray-200 font-semibold">{companyInfo.companyName}</span></div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onSearchByGst && (
          <button
            type="button"
            onClick={onSearchByGst}
            className="text-sm font-semibold text-[var(--primary)] hover:opacity-80 transition-opacity py-1 px-2"
          >
            Search by GST
          </button>
        )}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-[var(--primary)] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:rotate-180 duration-300"
            aria-label="Refresh"
          >
            <RefreshCw className="w-5 h-5 stroke-[2]" />
          </button>
        )}
        {rightAction}
      </div>
    </div>
  );
};
