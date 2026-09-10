import React, { useState, useEffect } from 'react';
import { Search, Printer, Download, BarChart2, Users } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { reportService, type PartyWiseReportRow } from '../../services/reportService';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { currentCompany, currentFinancialYear } = useApp();
  const [reportData, setReportData] = useState<PartyWiseReportRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    reportService
      .getPartyWiseBrokerageReport(currentCompany?.id, currentFinancialYear)
      .then(data => {
        setReportData(data);
        setIsLoading(false);
      });
  }, [currentCompany?.id, currentFinancialYear]);

  const filteredData = reportData.filter(row =>
    row.partyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBrokerageSum = filteredData.reduce((sum, r) => sum + r.totalBrokerage, 0);
  const totalVolumeSum = filteredData.reduce((sum, r) => sum + r.totalQuantity, 0);
  const totalBillSum = filteredData.reduce((sum, r) => sum + r.totalBillAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 transition-colors">
      <PageHeader
        title="Brokerage Total Amount Report"
        subtitle={`Party Wise Summary • FY: ${currentFinancialYear} • ${currentCompany?.name}`}
        rightAction={
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 rounded-xl hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
            title="Print Report"
          >
            <Printer className="w-5 h-5" />
          </button>
        }
      />

      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-card p-4 md:p-5 rounded-3xl text-center shadow-glass-card min-w-0 overflow-hidden">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Brokerage</div>
            <div className="text-base sm:text-lg md:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 truncate" title={formatCurrency(totalBrokerageSum)}>
              {formatCurrency(totalBrokerageSum)}
            </div>
          </div>
          <div className="glass-card p-4 md:p-5 rounded-3xl text-center shadow-glass-card min-w-0 overflow-hidden">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Volume</div>
            <div className="text-base sm:text-lg md:text-xl font-black text-gray-900 dark:text-white mt-1 truncate" title={totalVolumeSum.toLocaleString()}>
              {totalVolumeSum.toLocaleString()}
            </div>
          </div>
          <div className="glass-card p-4 md:p-5 rounded-3xl text-center shadow-glass-card min-w-0 overflow-hidden">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turnover Amount</div>
            <div className="text-base sm:text-lg md:text-xl font-black text-orange-600 dark:text-orange-400 mt-1 truncate" title={formatCurrency(totalBillSum, 0)}>
              {formatCurrency(totalBillSum, 0)}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search party in report..."
            className="input-vyapar pl-12 pr-4 py-3.5 text-sm font-medium"
          />
        </div>

        {/* Report Table / Cards */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-glass-card border border-white/60 dark:border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white/40 dark:bg-white/5 border-b border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap">
                  <th className="p-4">Party Name</th>
                  <th className="p-4 text-center">Orders</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-right">Turnover</th>
                  <th className="p-4 text-right">Brokerage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/40 dark:divide-white/5 whitespace-nowrap">
                {filteredData.map(row => (
                  <tr key={row.partyId} className="hover:bg-orange-500/10 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-extrabold text-gray-900 dark:text-white uppercase">
                      <div className="truncate max-w-[180px] sm:max-w-xs" title={row.partyName}>{row.partyName}</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">
                        Seller: {row.asSellerCount} | Buyer: {row.asBuyerCount}
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">
                      {row.totalOrders}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                      {row.totalQuantity.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-600 dark:text-gray-400">
                      {formatCurrency(row.totalBillAmount, 0)}
                    </td>
                    <td className="p-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrency(row.totalBrokerage)}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      No brokerage records for the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
