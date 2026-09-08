import React from 'react';
import type { SaudaOrder, Company, Party } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface SaudaNoteProps {
  order: Partial<SaudaOrder>;
  company?: Partial<Company>;
  seller?: Partial<Party>;
  buyer?: Partial<Party>;
  color?: string; // RED, ORANGE, BLUE, GREEN, BLACK
  template?: 1 | 2 | 3 | 4;
  showSignature?: boolean;
}

export const SaudaNoteTemplate: React.FC<SaudaNoteProps> = ({
  order,
  company,
  seller,
  buyer,
  color = 'RED',
  template = 1,
  showSignature = true,
}) => {
  // Color palette map
  const colorStyles: Record<string, { border: string; text: string; bg: string; hex: string }> = {
    RED: { border: 'border-red-600', text: 'text-red-700', bg: 'bg-red-50', hex: '#DC2626' },
    ORANGE: { border: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', hex: '#FF9800' },
    BLUE: { border: 'border-blue-600', text: 'text-blue-700', bg: 'bg-blue-50', hex: '#2563EB' },
    GREEN: { border: 'border-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50', hex: '#059669' },
    BLACK: { border: 'border-gray-900', text: 'text-gray-900', bg: 'bg-gray-100', hex: '#111827' },
  };

  const activeTheme = colorStyles[color?.toUpperCase() || 'RED'] || colorStyles.RED;

  // Fallback defaults matching screenshot 14
  const compName = company?.name || 'KRISHNA FIBERS';
  const compAddr = company?.address || 'PALIYAD ROAD BOTAD';
  const compCityState = `${company?.city || 'BOTAD'}, ${company?.state || 'GUJARAT'}${company?.pinCode ? ' - ' + company.pinCode : ''}`;
  const compPan = company?.panNumber || 'ABCDE1234F';
  const compGst = company?.gstNumber || '24ABCDE1234F1Z5';
  const compPhone = company?.contactNumber || '9574823170';
  const compEmail = company?.email || 'krishnafibers@gmail.com';

  const orderNo = order.id || order.billNo || '1';
  const orderDate = formatDate(order.date) || '08/09/2026';
  const itemName = order.itemName || 'KAPAS';
  const itemQuality = order.itemQuality || '1 GADI';
  const quantity = order.quantity || 200;
  const unit = order.unit || '100';
  const billRate = order.billRate || 5353;
  const totalAmount = order.totalBillAmount || quantity * billRate;

  const sellerName = order.sellerName || seller?.name || 'SKY';
  const sellerContact = seller?.mobileNumber || '5484618494';
  const sellerGst = seller?.gstNumber || '24AABCS1429B1Z1';

  const buyerName = order.buyerName || buyer?.name || 'RAM';
  const buyerContact = buyer?.mobileNumber || '9879879877';
  const buyerGst = buyer?.gstNumber || '24ABCDE1234F1Z5';

  const payTerms = order.paymentTerms || 'NEXT DAY';
  const delTerms = order.deliveryTerms || 'next day';
  const remark = order.remark || '10% moisture';
  const termsCond = order.termsConditions || 'Our responsibility and duty are restricted to communication and coordination only.';

  // Render Template 1: Classic Boxed (Exact layout from Screenshot 14)
  if (template === 1) {
    return (
      <div 
        id="printable-sauda-note" 
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto text-xs text-gray-800"
        style={{ color: activeTheme.hex }}
      >
        {/* Top Header */}
        <div className="text-center font-bold text-base uppercase tracking-wider mb-2" style={{ color: activeTheme.hex }}>
          {compName}
        </div>
        <div className="flex justify-between items-start text-[10px] text-gray-600 mb-2 border-b pb-2 border-gray-200">
          <div className="space-y-0.5">
            <div>{compAddr}</div>
            <div>{compCityState}</div>
            <div>Our Pan No: <span className="font-semibold text-gray-800">{compPan}</span></div>
          </div>
          <div className="text-right space-y-0.5">
            <div>Phone: <span className="font-semibold text-gray-800">{compPhone}</span></div>
            <div>Email: <span className="font-semibold text-gray-800">{compEmail}</span></div>
            <div>Our GSTIN: <span className="font-semibold text-gray-800">{compGst}</span></div>
          </div>
        </div>

        {/* Order Meta */}
        <div className="flex justify-between items-center py-1.5 font-bold text-xs border-b border-gray-200" style={{ color: activeTheme.hex }}>
          <div>SAUDA ORDER NO: #{orderNo}</div>
          <div>DATE: {orderDate}</div>
        </div>

        {/* Border Box Container */}
        <div 
          className="mt-3 p-4 rounded-md border-2" 
          style={{ borderColor: activeTheme.hex }}
        >
          <div 
            className="text-center font-bold text-sm uppercase tracking-widest pb-2 mb-3 border-b"
            style={{ borderColor: activeTheme.hex, color: activeTheme.hex }}
          >
            SAUDA ORDER CONFIRMATION
          </div>

          {/* Seller Details */}
          <div className="mb-4">
            <div className="font-bold uppercase tracking-wider text-[11px] mb-1 underline" style={{ color: activeTheme.hex }}>
              SELLER DETAIL
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] pl-2">
              <div className="text-gray-500 font-medium">NAME:</div>
              <div className="col-span-2 font-bold text-gray-900">{sellerName}</div>

              <div className="text-gray-500 font-medium">CONTACT NO:</div>
              <div className="col-span-2 font-medium text-gray-800">{sellerContact}</div>

              <div className="text-gray-500 font-medium">GST NO:</div>
              <div className="col-span-2 font-medium text-gray-800">{sellerGst}</div>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="mb-4">
            <div className="font-bold uppercase tracking-wider text-[11px] mb-1 underline" style={{ color: activeTheme.hex }}>
              BUYER DETAIL
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] pl-2">
              <div className="text-gray-500 font-medium">NAME:</div>
              <div className="col-span-2 font-bold text-gray-900">{buyerName}</div>

              <div className="text-gray-500 font-medium">CONTACT NO:</div>
              <div className="col-span-2 font-medium text-gray-800">{buyerContact}</div>

              <div className="text-gray-500 font-medium">GST NO:</div>
              <div className="col-span-2 font-medium text-gray-800">{buyerGst}</div>
            </div>
          </div>

          {/* Item Details */}
          <div className="mb-4">
            <div className="font-bold uppercase tracking-wider text-[11px] mb-1 underline" style={{ color: activeTheme.hex }}>
              ITEM DETAIL
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] pl-2">
              <div className="text-gray-500 font-medium">ITEM NAME:</div>
              <div className="col-span-2 font-bold text-gray-900">{itemName}</div>

              <div className="text-gray-500 font-medium">ITEM QUALITY:</div>
              <div className="col-span-2 font-medium text-gray-800">{itemQuality}</div>

              <div className="text-gray-500 font-medium">BILL RATE:</div>
              <div className="col-span-2 font-bold text-gray-900">{formatCurrency(billRate, 0)}</div>

              <div className="text-gray-500 font-medium">QUANTITY:</div>
              <div className="col-span-2 font-bold text-gray-900">{quantity} {unit}</div>

              <div className="text-gray-500 font-medium">TOTAL BILL AMT:</div>
              <div className="col-span-2 font-black text-gray-900">{formatCurrency(totalAmount)}</div>
            </div>
          </div>

          {/* Terms */}
          <div className="pt-2 border-t border-dashed border-gray-200">
            <div className="font-bold uppercase tracking-wider text-[11px] mb-1 underline" style={{ color: activeTheme.hex }}>
              TERMS
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] pl-2">
              <div className="text-gray-500 font-medium">PAYMENT TERMS:</div>
              <div className="col-span-2 font-semibold text-gray-800 uppercase">{payTerms}</div>

              <div className="text-gray-500 font-medium">DELIVERY TERMS:</div>
              <div className="col-span-2 font-semibold text-gray-800 uppercase">{delTerms}</div>

              <div className="text-gray-500 font-medium">REMARK:</div>
              <div className="col-span-2 font-medium text-gray-800">{remark}</div>

              <div className="text-gray-500 font-medium">TERMS & CONDITIONS:</div>
              <div className="col-span-2 text-gray-600 italic text-[9px] leading-tight">{termsCond}</div>
            </div>
          </div>
        </div>

        {/* Signature Block */}
        {showSignature && (
          <div className="mt-8 flex justify-between items-end text-[10px] pt-4">
            <div className="text-gray-400">Prepared by Sauda Book</div>
            <div className="text-center font-semibold text-gray-800">
              <div className="h-10 border-b border-gray-400 w-36 mb-1"></div>
              <div>Authorized Signatory</div>
              <div className="text-[9px] text-gray-500">For {compName}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Template 2: Modern Table / Columnar Layout
  if (template === 2) {
    return (
      <div 
        id="printable-sauda-note" 
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto text-xs text-gray-800"
      >
        <div className="p-4 rounded-xl text-white mb-4 flex justify-between items-center" style={{ backgroundColor: activeTheme.hex }}>
          <div>
            <h2 className="text-lg font-black tracking-wide">{compName}</h2>
            <p className="text-[10px] opacity-90">{compAddr}, {compCityState}</p>
          </div>
          <div className="text-right text-[10px]">
            <div className="font-bold text-sm">SAUDA #{orderNo}</div>
            <div>{orderDate}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-bold text-[11px] mb-1" style={{ color: activeTheme.hex }}>SELLER</div>
            <div className="font-bold text-gray-900">{sellerName}</div>
            <div className="text-[10px] text-gray-500">{sellerContact} • GST: {sellerGst}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-bold text-[11px] mb-1" style={{ color: activeTheme.hex }}>BUYER</div>
            <div className="font-bold text-gray-900">{buyerName}</div>
            <div className="text-[10px] text-gray-500">{buyerContact} • GST: {buyerGst}</div>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-200 text-[11px] mb-4">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-200 p-2 text-left">Commodity Item</th>
              <th className="border border-gray-200 p-2 text-left">Quality</th>
              <th className="border border-gray-200 p-2 text-right">Quantity</th>
              <th className="border border-gray-200 p-2 text-right">Rate</th>
              <th className="border border-gray-200 p-2 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2 font-bold">{itemName}</td>
              <td className="border border-gray-200 p-2">{itemQuality}</td>
              <td className="border border-gray-200 p-2 text-right font-semibold">{quantity} {unit}</td>
              <td className="border border-gray-200 p-2 text-right">{formatCurrency(billRate, 0)}</td>
              <td className="border border-gray-200 p-2 text-right font-black" style={{ color: activeTheme.hex }}>
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="p-3 bg-gray-50 rounded-lg text-[10px] space-y-1 mb-4">
          <div><span className="font-bold">Payment:</span> {payTerms}</div>
          <div><span className="font-bold">Delivery:</span> {delTerms}</div>
          <div><span className="font-bold">Remarks:</span> {remark}</div>
        </div>

        {showSignature && (
          <div className="flex justify-end pt-4">
            <div className="text-center">
              <div className="h-8 border-b border-gray-400 w-32 mb-1"></div>
              <div className="text-[10px] font-bold">Authorized Signatory</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Template 3: Clean Minimalist Layout
  if (template === 3) {
    return (
      <div 
        id="printable-sauda-note" 
        className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto text-xs"
      >
        <div className="border-b-2 pb-4 mb-4 flex justify-between" style={{ borderColor: activeTheme.hex }}>
          <div>
            <h1 className="text-xl font-black text-gray-900">{compName}</h1>
            <p className="text-[10px] text-gray-500">{compAddr}, {compCityState} • Phone: {compPhone}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-1 text-xs font-bold rounded" style={{ backgroundColor: activeTheme.bg, color: activeTheme.hex }}>
              SAUDA NOTE #{orderNo}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">{orderDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-[11px]">
          <div>
            <div className="text-gray-400 font-semibold text-[10px] uppercase">Seller (Party A)</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5">{sellerName}</div>
            <div className="text-gray-600">{sellerContact}</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold text-[10px] uppercase">Buyer (Party B)</div>
            <div className="text-sm font-bold text-gray-900 mt-0.5">{buyerName}</div>
            <div className="text-gray-600">{buyerContact}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-sm text-gray-900">{itemName} ({itemQuality})</span>
            <span className="text-base font-black" style={{ color: activeTheme.hex }}>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="text-[11px] text-gray-600 flex justify-between">
            <span>Quantity: <strong>{quantity} {unit}</strong></span>
            <span>Rate: <strong>{formatCurrency(billRate, 0)}</strong></span>
          </div>
        </div>

        <div className="text-[10px] text-gray-600 space-y-1 mb-4">
          <p><strong>Terms:</strong> {payTerms} | <strong>Delivery:</strong> {delTerms}</p>
          <p className="italic">{termsCond}</p>
        </div>

        {showSignature && (
          <div className="pt-6 flex justify-end text-[10px]">
            <div className="text-center font-medium text-gray-600">
              <div className="w-28 border-b border-gray-300 pb-8 mb-1"></div>
              <span>For {compName}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Template 4: Compact Official Voucher
  return (
    <div 
      id="printable-sauda-note" 
      className="bg-white p-6 rounded-xl border-4 shadow-sm max-w-2xl mx-auto text-xs"
      style={{ borderColor: activeTheme.hex }}
    >
      <div className="text-center border-b pb-3 mb-3" style={{ borderColor: activeTheme.hex }}>
        <h2 className="text-lg font-black uppercase tracking-wider" style={{ color: activeTheme.hex }}>
          {compName}
        </h2>
        <p className="text-[10px] text-gray-500">{compAddr} • {compCityState} • Phone: {compPhone}</p>
        <div className="mt-1 font-bold text-xs uppercase tracking-widest text-gray-800">
          Brokerage Sauda Voucher #{orderNo} • Date: {orderDate}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 text-[11px]">
        <div className="border border-gray-200 p-2.5 rounded-lg">
          <div className="font-bold text-[10px] uppercase text-emerald-700">Seller Details</div>
          <div className="font-black text-gray-900 mt-0.5">{sellerName}</div>
          <div className="text-[10px] text-gray-600">{sellerContact}</div>
        </div>
        <div className="border border-gray-200 p-2.5 rounded-lg">
          <div className="font-bold text-[10px] uppercase text-blue-700">Buyer Details</div>
          <div className="font-black text-gray-900 mt-0.5">{buyerName}</div>
          <div className="text-[10px] text-gray-600">{buyerContact}</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
          <div>
            <div className="text-gray-400">ITEM</div>
            <div className="font-bold text-gray-900 text-xs">{itemName}</div>
          </div>
          <div>
            <div className="text-gray-400">QTY</div>
            <div className="font-bold text-gray-900 text-xs">{quantity} {unit}</div>
          </div>
          <div>
            <div className="text-gray-400">RATE</div>
            <div className="font-bold text-gray-900 text-xs">{formatCurrency(billRate, 0)}</div>
          </div>
          <div>
            <div className="text-gray-400">TOTAL</div>
            <div className="font-black text-xs" style={{ color: activeTheme.hex }}>{formatCurrency(totalAmount)}</div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-gray-600 space-y-0.5">
        <div><strong>Payment:</strong> {payTerms}</div>
        <div><strong>Delivery:</strong> {delTerms}</div>
        <div><strong>Note:</strong> {remark}</div>
      </div>

      {showSignature && (
        <div className="flex justify-between items-end mt-4 pt-2 border-t border-gray-100 text-[10px]">
          <div className="text-gray-400">Sauda Book Verified</div>
          <div className="font-bold text-gray-700">Authorized Signature</div>
        </div>
      )}
    </div>
  );
};
