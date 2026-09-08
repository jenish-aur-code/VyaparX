import { db } from '../db/database';
import type { Party } from '../types';

export const partyService = {
  async getAll(): Promise<Party[]> {
    return await db.parties.toArray();
  },

  async getById(id: number): Promise<Party | undefined> {
    return await db.parties.get(id);
  },

  async create(party: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    const id = await db.parties.add({
      ...party,
      createdAt: now,
      updatedAt: now,
    });
    return Number(id);
  },

  async update(id: number, updates: Partial<Party>): Promise<void> {
    const now = new Date().toISOString();
    await db.parties.update(id, {
      ...updates,
      updatedAt: now,
    });
  },

  async delete(id: number): Promise<void> {
    await db.parties.delete(id);
  },

  async search(query: string): Promise<Party[]> {
    if (!query.trim()) return await this.getAll();
    const q = query.toLowerCase();
    return await db.parties
      .filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.city.toLowerCase().includes(q) || 
        p.state.toLowerCase().includes(q) ||
        p.mobileNumber.includes(q) ||
        String(p.id).includes(q)
      )
      .toArray();
  },
};
