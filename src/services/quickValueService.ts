import { db } from '../db/database';
import type { QuickValue } from '../types';

export const quickValueService = {
  async getByCategory(category: QuickValue['category']): Promise<string[]> {
    const items = await db.quickValues.where('category').equals(category).toArray();
    return items.map(i => i.value);
  },

  async getAll(): Promise<QuickValue[]> {
    return await db.quickValues.toArray();
  },

  async add(category: QuickValue['category'], value: string): Promise<number> {
    const existing = await db.quickValues
      .filter(q => q.category === category && q.value.toLowerCase() === value.toLowerCase())
      .first();
    if (existing) return existing.id!;
    const id = await db.quickValues.add({ category, value: value.trim() });
    return Number(id);
  },

  async delete(id: number): Promise<void> {
    await db.quickValues.delete(id);
  },
};
