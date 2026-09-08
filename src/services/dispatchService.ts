import { db } from '../db/database';
import type { DispatchRecord } from '../types';

export const dispatchService = {
  async getBySaudaId(saudaId: number): Promise<DispatchRecord[]> {
    return await db.dispatches.where('saudaId').equals(saudaId).toArray();
  },

  async getAll(): Promise<DispatchRecord[]> {
    return await db.dispatches.toArray();
  },

  async addDispatch(dispatch: Omit<DispatchRecord, 'id' | 'createdAt'>): Promise<number> {
    const now = new Date().toISOString();
    const id = await db.dispatches.add({
      ...dispatch,
      createdAt: now,
    });

    // Update parent Sauda order total dispatched quantity & status
    const sauda = await db.saudaOrders.get(dispatch.saudaId);
    if (sauda) {
      const allDispatches = await db.dispatches.where('saudaId').equals(dispatch.saudaId).toArray();
      const totalDispatched = allDispatches.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
      
      let status: 'Pending' | 'Partial' | 'Dispatched' | 'Completed' = 'Pending';
      if (totalDispatched >= sauda.quantity) {
        status = 'Completed';
      } else if (totalDispatched > 0) {
        status = 'Partial';
      }

      await db.saudaOrders.update(dispatch.saudaId, {
        dispatchedQuantity: totalDispatched,
        dispatchStatus: status,
        updatedAt: now,
      });
    }

    return Number(id);
  },

  async delete(id: number): Promise<void> {
    const record = await db.dispatches.get(id);
    if (!record) return;

    await db.dispatches.delete(id);

    // Recompute parent order
    const sauda = await db.saudaOrders.get(record.saudaId);
    if (sauda) {
      const remainingDispatches = await db.dispatches.where('saudaId').equals(record.saudaId).toArray();
      const totalDispatched = remainingDispatches.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
      
      let status: 'Pending' | 'Partial' | 'Dispatched' | 'Completed' = 'Pending';
      if (totalDispatched >= sauda.quantity) {
        status = 'Completed';
      } else if (totalDispatched > 0) {
        status = 'Partial';
      }

      await db.saudaOrders.update(record.saudaId, {
        dispatchedQuantity: totalDispatched,
        dispatchStatus: status,
        updatedAt: new Date().toISOString(),
      });
    }
  },
};
