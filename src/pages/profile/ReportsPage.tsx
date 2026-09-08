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
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader
        title="Brokerage Total Amount Report"
        subtitle={`Party Wise Summary • FY: ${currentFinancialYear} • ${currentCompany?.name}`}
        rightAction={
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 text-gray-600 hover:text-orange-600 rounded-xl hover:bg-gray-100"
            title="Print Report"
          >
            <Printer className="w-5 h-5" />
          </button>
        }
      />

      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 card-shadow text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Total Brokerage</div>
            <div className="text-lg md:text-xl font-black text-emerald-600 mt-1">
              {formatCurrency(totalBrokerageSum)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 card-shadow text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Total Volume</div>
            <div className="text-lg md:text-xl font-black text-gray-900 mt-1">
              {totalVolumeSum.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 card-shadow text-center">
            <div className="text-[11px] font-bold text-gray-500 uppercase">Turnover Amount</div>
            <div className="text-lg md:text-xl font-black text-orange-600 mt-1">
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
            className="input-sauda pl-12"
          />
        </div>

        {/* Report Table / Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Party Name</th>
                  <th className="p-3.5 text-center">Orders</th>
                  <th className="p-3.5 text-right">Volume</th>
                  <th className="p-3.5 text-right">Turnover</th>
                  <th className="p-3.5 text-right">Brokerage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map(row => (
                  <tr key={row.partyId} className="hover:bg-orange-50/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-gray-900 uppercase">
                      {row.partyName}
                      <div className="text-[10px] text-gray-400 font-normal">
                        Seller: {row.asSellerCount} | Buyer: {row.asBuyerCount}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-gray-700">
                      {row.totalOrders}
                    </td>
                    <td className="p-3.5 text-right font-bold text-gray-900">
                      {row.totalQuantity.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-gray-600">
                      {formatCurrency(row.totalBillAmount, 0)}
                    </td>
                    <td className="p-3.5 text-right font-black text-emerald-600 text-sm">
                      {formatCurrency(row.totalBrokerage)}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
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
