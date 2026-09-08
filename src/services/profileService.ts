import { db } from '../db/database';
import type { UserProfile, FinancialYear } from '../types';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const profile = await db.userProfile.get(1);
    if (!profile) {
      const defaultProfile: UserProfile = {
        name: 'JENISH',
        phone: '9574823170',
        plan: 'FREE',
        expiryDate: '2026-10-08',
        referralCode: 'LHPXC3',
        isPinEnabled: false,
      };
      await db.userProfile.put({ ...defaultProfile, id: 1 });
      return defaultProfile;
    }
    return profile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const current = await this.getProfile();
    await db.userProfile.put({
      ...current,
      ...updates,
      id: 1,
    });
  },

  async getFinancialYears(): Promise<FinancialYear[]> {
    return await db.financialYears.toArray();
  },

  async addFinancialYear(year: string): Promise<void> {
    const exists = await db.financialYears.get(year);
    if (!exists) {
      await db.financialYears.add({
        id: year,
        name: year,
        isCurrent: false,
      });
    }
  },

  async setCurrentFinancialYear(yearId: string): Promise<void> {
    await db.financialYears.toCollection().modify({ isCurrent: false });
    await db.financialYears.update(yearId, { isCurrent: true });
  },
};
