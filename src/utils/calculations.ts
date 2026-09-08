/**
 * Business calculation utilities for Sauda Book
 * Verified against screenshot data:
 * - Quantity: 288, Rate: 6467 => Total Bill Amount: 18,62,496.00
 * - Quantity: 288, Comm Rate: 2.8 => Commission Amount: 806.40
 */

export function calculateBillAmount(
  quantity: number,
  billRate: number,
  withGST: boolean = false,
  gstPercent: number = 5
): {
  subtotal: number;
  gstAmount: number;
  totalBillAmount: number;
} {
  const qty = Number(quantity) || 0;
  const rate = Number(billRate) || 0;
  const subtotal = Math.round(qty * rate * 100) / 100;
  
  let gstAmount = 0;
  if (withGST) {
    gstAmount = Math.round((subtotal * (Number(gstPercent) || 0)) / 100 * 100) / 100;
  }
  
  const totalBillAmount = subtotal + gstAmount;

  return {
    subtotal,
    gstAmount,
    totalBillAmount,
  };
}

export function calculateCommission(
  quantity: number,
  commissionRate: number
): number {
  const qty = Number(quantity) || 0;
  const rate = Number(commissionRate) || 0;
  return Math.round(qty * rate * 100) / 100;
}
