import { db } from '../db/database';
import type { PaymentRecord } from '../types';

export const paymentService = {
  async getBySaudaId(saudaId: number): Promise<PaymentRecord[]> {
    return await db.payments.where('saudaId').equals(saudaId).toArray();
  },

  async getAll(): Promise<PaymentRecord[]> {
    return await db.payments.toArray();
  },

  async addPayment(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<number> {
    const now = new Date().toISOString();
    const id = await db.payments.add({
      ...payment,
      createdAt: now,
    });

    // Update parent Sauda order total paid amount & status
    const sauda = await db.saudaOrders.get(payment.saudaId);
    if (sauda) {
      const allPayments = await db.payments.where('saudaId').equals(payment.saudaId).toArray();
      const totalPaid = allPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      let status: 'Pending' | 'Partial' | 'Paid' = 'Pending';
      if (totalPaid >= sauda.totalBillAmount) {
        status = 'Paid';
      } else if (totalPaid > 0) {
        status = 'Partial';
      }

      await db.saudaOrders.update(payment.saudaId, {
        paidAmount: totalPaid,
        paymentStatus: status,
        updatedAt: now,
      });
    }

    return Number(id);
  },

  async delete(id: number): Promise<void> {
    const record = await db.payments.get(id);
    if (!record) return;

    await db.payments.delete(id);

    // Recompute parent order
    const sauda = await db.saudaOrders.get(record.saudaId);
    if (sauda) {
      const remainingPayments = await db.payments.where('saudaId').equals(record.saudaId).toArray();
      const totalPaid = remainingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      let status: 'Pending' | 'Partial' | 'Paid' = 'Pending';
      if (totalPaid >= sauda.totalBillAmount) {
        status = 'Paid';
      } else if (totalPaid > 0) {
        status = 'Partial';
      }

      await db.saudaOrders.update(record.saudaId, {
        paidAmount: totalPaid,
        paymentStatus: status,
        updatedAt: new Date().toISOString(),
      });
    }
  },
};
