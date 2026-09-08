import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Phone, Plus, CheckCircle2 } from 'lucide-react';
import { companyService } from '../../services/companyService';
import type { Company } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const CompaniesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { currentCompany, refreshAppContext } = useApp();
  const { currentUser } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await companyService.search(searchQuery, currentUser?.email);
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchQuery]);

  return (
    <div className="min-h-[calc(100vh-60px)] pb-24 md:pb-12 bg-[#F5F7FA] dark:bg-[#0B1120] transition-colors">
      {/* Header Replicating Screenshot 12 */}
      <PageHeader
        title={`COMPANIES (${companies.length})`}
        subtitle="Manage your business profiles"
        onRefresh={() => {
          fetchCompanies();
          refreshAppContext();
        }}
      />

      <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto">
        {/* Search Bar matching screenshot */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)] transition-all placeholder-gray-400 dark:placeholder-gray-500 card-shadow"
          />
        </div>

        {/* Company Cards List */}
        <div className="space-y-3">
          {companies.map(comp => (
            <div
              key={comp.id}
              onClick={() => navigate(`/companies/edit/${comp.id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow border border-gray-100/80 dark:border-gray-700 cursor-pointer hover:border-[var(--primary)] transition-all flex items-start gap-3.5 group"
            >
              {/* Building Icon in Soft Circle */}
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border"
                style={{ backgroundColor: palette.light, borderColor: palette.primary + '33', color: palette.primary }}
              >
                <Building2 className="w-6 h-6 stroke-[2.2]" />
              </div>

              {/* Details matching screenshot 12 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {comp.name}
                </h3>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-0.5">
                  {comp.address} {comp.city ? `• ${comp.city}` : ''}
                </div>

                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1">
                  Phone: {comp.contactNumber}
                </div>

                {comp.isDefault && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                    <span>Default</span>
                  </div>
                )}

                <div className="text-xs text-gray-400 italic mt-2 group-hover:text-[var(--primary)] transition-colors">
                  Tap to view or edit
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (+) matching screenshot 12 */}
      <button
        type="button"
        onClick={() => navigate('/companies/new')}
        style={{ backgroundColor: palette.primary }}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 w-14 h-14 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-95 hover:opacity-90"
        aria-label="Add Company"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
