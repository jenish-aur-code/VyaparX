import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building, Phone, Plus, CheckCircle2 } from 'lucide-react';
import { partyService } from '../../services/partyService';
import type { Party } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { useTheme } from '../../context/ThemeContext';

export const PartiesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [parties, setParties] = useState<Party[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchParties = async () => {
    setIsLoading(true);
    try {
      const data = await partyService.search(searchQuery);
      setParties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, [searchQuery]);

  return (
    <div className="min-h-[calc(100vh-60px)] pb-24 md:pb-12 bg-[#F5F7FA] dark:bg-[#0B1120] transition-colors">
      {/* Header Replicating Screenshot 8 */}
      <PageHeader
        title={`PARTIES (${parties.length})`}
        subtitle="Manage your seller/buyer Party"
        onRefresh={fetchParties}
      />

      <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto">
        {/* Search Bar matching screenshot */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search parties..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--primary)] transition-all placeholder-gray-400 dark:placeholder-gray-500 card-shadow"
          />
        </div>

        {/* Party Cards List */}
        <div className="space-y-3">
          {parties.map(party => (
            <div
              key={party.id}
              onClick={() => navigate(`/parties/edit/${party.id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow border border-gray-100/80 dark:border-gray-700 cursor-pointer hover:border-[var(--primary)] transition-all flex items-start gap-3.5 group"
            >
              {/* Building Icon in Soft Circle */}
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border"
                style={{ backgroundColor: palette.light, borderColor: palette.primary + '33', color: palette.primary }}
              >
                <Building className="w-6 h-6 stroke-[2.2]" />
              </div>

              {/* Details matching screenshot 8 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {party.name}
                </h3>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-0.5">
                  {party.city || 'BOTAD'} - {party.state || 'GUJARAT'}
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span>{party.mobileNumber}</span>
                  </div>
                  <span className="text-gray-400"># ID: {party.id}</span>
                </div>

                <div className="text-xs text-gray-400 italic mt-2 group-hover:text-[var(--primary)] transition-colors">
                  Tap to view or edit
                </div>
              </div>
            </div>
          ))}

          {/* Bottom message matching screenshot 8 */}
          <div className="text-center py-8 text-gray-400 text-xs font-medium flex flex-col items-center gap-1">
            <CheckCircle2 className="w-6 h-6 text-gray-300 stroke-[1.5]" />
            <span>No more parties to load</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) matching screenshot 8 */}
      <button
        type="button"
        onClick={() => navigate('/parties/new')}
        style={{ backgroundColor: palette.primary }}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 w-14 h-14 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-95 hover:opacity-90"
        aria-label="Add Party"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
