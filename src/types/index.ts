export interface Company {
  id?: number;
  name: string;
  contactNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  upiId?: string;
  saudaNoteColor: 'RED' | 'ORANGE' | 'BLUE' | 'GREEN' | 'BLACK';
  pdfTemplate: 1 | 2 | 3 | 4;
  showSignature: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialYear {
  id: string;
  name: string;
  isCurrent: boolean;
}

export interface Item {
  id?: number;
  name: string;
  sellerCommissionRate: number;
  buyerCommissionRate: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id?: number;
  name: string;
  mobileNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode?: string;
  licenseNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  upiId?: string;
  partyType?: 'both' | 'seller' | 'buyer';
  createdAt: string;
  updatedAt: string;
}

export interface SaudaOrder {
  id?: number;
  companyId: number;
  financialYear: string;
  date: string;
  itemId: number;
  itemName: string;
  itemQuality: string;
  quantity: number;
  unit: string;
  billRate: number;
  withGST: boolean;
  gstPercent: number;
  gstAmount: number;
  totalBillAmount: number;
  billNo?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  remark?: string;
  termsConditions?: string;
  sellerId: number;
  sellerName: string;
  sellerCommissionRate: number;
  sellerCommissionAmount: number;
  sellerContactPerson?: string;
  buyerId: number;
  buyerName: string;
  buyerCommissionRate: number;
  buyerCommissionAmount: number;
  buyerContactPerson?: string;
  dispatchStatus: 'Pending' | 'Partial' | 'Dispatched' | 'Completed';
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  dispatchedQuantity?: number;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DispatchRecord {
  id?: number;
  saudaId: number;
  dispatchDate: string;
  quantity: number;
  vehicleNumber: string;
  transporter: string;
  driverName?: string;
  driverContact?: string;
  remarks?: string;
  status: 'Pending' | 'Partial' | 'Dispatched' | 'Completed';
  createdAt: string;
}

export interface PaymentRecord {
  id?: number;
  saudaId: number;
  partyId?: number;
  partyType: 'seller' | 'buyer';
  paymentDate: string;
  amount: number;
  paymentMode: 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Other';
  referenceNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface QuickValue {
  id?: number;
  category: 'paymentTerms' | 'deliveryTerms' | 'remark' | 'quality' | 'unit';
  value: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  plan: string;
  expiryDate: string;
  referralCode: string;
  pin?: string;
  isPinEnabled: boolean;
}
