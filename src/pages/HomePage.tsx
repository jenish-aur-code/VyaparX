import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  ClipboardList,
  PlusCircle,
  Package,
  Truck,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saudaService } from '../services/saudaService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCompany, currentFinancialYear } = useApp();

  const [stats, setStats] = useState({
    totalOrders: 0,
    primaryItemName: 'KAPAS',
    primaryItemQuantity: 0,
    totalAmount: 0,
  });

  const loadStats = async () => {
    try {
      const data = await saudaService.getDashboardStats(
        currentCompany?.id,
        currentFinancialYear
      );
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, [currentCompany?.id, currentFinancialYear]);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      {/* Top Banner: Total Sauda Orders (Replicating Screenshot 24) */}
      <div 
        onClick={() => navigate('/sauda')}
        className="bg-[#FF9800] rounded-2xl p-5 text-white shadow-md shadow-orange-500/10 cursor-pointer hover:bg-[#F57C00] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">Total Sauda Orders</div>
            <div className="text-4xl font-black tracking-tight">{stats.totalOrders}</div>
          </div>
        </div>
      </div>

      {/* Second Banner: Item Name & Quantity Summary (Replicating Screenshot 24) */}
      <div className="bg-[#FF9800] rounded-2xl p-5 text-white shadow-md shadow-orange-500/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">ITEM NAME</div>
            <div className="text-xl font-black tracking-wide mt-1 uppercase">
              {stats.primaryItemName || 'KAPAS'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">QUANTITY</div>
            <div className="text-xl font-black tracking-wide mt-1">
              {stats.primaryItemQuantity || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 6 Grid Action Cards (Replicating Screenshot 24) */}
      <div className="grid grid-cols-2 gap-3.5 pt-1">
        {/* 1. Party List */}
        <button
          type="button"
          onClick={() => navigate('/parties')}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Users className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            PARTY LIST
          </span>
        </button>

        {/* 2. Sauda Order List */}
        <button
          type="button"
          onClick={() => navigate('/sauda')}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] min-h-[120px]"
        >
          <ClipboardList className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            SAUDA ORDER LIST
          </span>
        </button>

        {/* 3. Create New Sauda Order */}
        <button
          type="button"
          onClick={() => navigate('/sauda/create')}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] min-h-[120px]"
        >
          <PlusCircle className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide leading-tight">
            CREATE NEW<br />SAUDA ORDER
          </span>
        </button>

        {/* 4. Item List */}
        <button
          type="button"
          onClick={() => navigate('/items')}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Package className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            ITEM LIST
          </span>
        </button>

        {/* 5. Sauda Dispatch */}
        <button
          type="button"
          onClick={() => navigate('/sauda/dispatch')}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Truck className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            SAUDA DISPATCH
          </span>
        </button>

        {/* 6. Sauda Bill */}
        <button
          type="button"
          onClick={() => navigate('/sauda/bills')}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 shadow-md shadow-orange-500/10 transition-all active:scale-[0.98] min-h-[120px]"
        >
          <Receipt className="w-7 h-7 stroke-[2.2]" />
          <span className="font-extrabold text-sm uppercase tracking-wide">
            SAUDA BILL
          </span>
        </button>
      </div>

      {/* Quick Status Bar on Desktop */}
      <div className="hidden md:flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 text-xs font-semibold text-gray-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF9800]" />
          <span>Active Company: <strong className="text-gray-900">{currentCompany?.name}</strong></span>
        </div>
        <div>
          <span>Financial Year: <strong className="text-gray-900">{currentFinancialYear}</strong></span>
        </div>
      </div>
    </div>
  );
};
