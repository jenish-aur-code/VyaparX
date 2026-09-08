import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Printer, Download, Eye, X } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SaudaNoteTemplate } from '../../components/pdf/SaudaNoteTemplate';
import { saudaService } from '../../services/saudaService';
import { useApp } from '../../context/AppContext';
import type { SaudaOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SaudaBillsPage: React.FC = () => {
  const { currentCompany, currentFinancialYear } = useApp();
  const [orders, setOrders] = useState<SaudaOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SaudaOrder | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<1 | 2 | 3 | 4>(
    currentCompany?.pdfTemplate || 1
  );
  const [activeColor, setActiveColor] = useState<string>(
    currentCompany?.saudaNoteColor || 'RED'
  );

  useEffect(() => {
    saudaService
      .getAll({
        companyId: currentCompany?.id,
        financialYear: currentFinancialYear,
      })
      .then(data => {
        setOrders(data);
        if (data.length > 0 && !selectedOrder) {
          setSelectedOrder(data[0]);
        }
      });
  }, [currentCompany?.id, currentFinancialYear]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 md:pb-12">
      <PageHeader
        title="Sauda Bills & Notes"
        subtitle="Manage and generate printable trade confirmation notes"
      />

      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        {/* Template & Color Selector Bar */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200 card-shadow flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-700 uppercase">PDF Template:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setActiveTemplate(num as 1 | 2 | 3 | 4)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                    activeTemplate === num
                      ? 'bg-[#FF9800] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 uppercase">Note Color:</span>
            <div className="flex gap-1.5">
              {[
                { label: 'RED', hex: '#DC2626' },
                { label: 'ORANGE', hex: '#FF9800' },
                { label: 'BLUE', hex: '#2563EB' },
                { label: 'GREEN', hex: '#059669' },
                { label: 'BLACK', hex: '#111827' },
              ].map(col => (
                <button
                  key={col.label}
                  type="button"
                  onClick={() => setActiveColor(col.label)}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    activeColor === col.label ? 'scale-125 border-gray-900 ring-2 ring-orange-200' : 'border-transparent'
                  }`}
                  title={col.label}
                />
              ))}
            </div>
          </div>

          {selectedOrder && (
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          )}
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List (1 Col) */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              Select Sauda Order ({orders.length})
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {orders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? 'bg-orange-50 border-[#FF9800] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-900">#{order.id} • {order.itemName}</span>
                    <span className="text-orange-600">{formatCurrency(order.totalBillAmount)}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                    <span>{order.sellerName} ➔ {order.buyerName}</span>
                    <span>{formatDate(order.date)}</span>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-400 text-xs">
                  No Sauda orders found for selected company & financial year.
                </div>
              )}
            </div>
          </div>

          {/* Active Order Live PDF Preview (2 Cols) */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-white p-4 rounded-2xl border border-gray-200 card-shadow">
                <SaudaNoteTemplate
                  order={selectedOrder}
                  company={currentCompany || undefined}
                  color={activeColor}
                  template={activeTemplate}
                  showSignature={currentCompany?.showSignature !== false}
                />
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400 text-sm">
                Select an order from the left list to view its Sauda Note
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
