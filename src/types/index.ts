export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: Date;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'inbound' | 'outbound' | 'adjustment';
  quantity: number;
  user: string;
  date: Date;
  reference: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  itemsSupplied: number;
  status: 'active' | 'inactive';
}

export interface Report {
  id: string;
  title: string;
  type: 'inventory' | 'movement' | 'financial';
  generatedAt: Date;
  period: string;
  downloadUrl: string;
}

export interface Settings {
  companyName: string;
  timezone: string;
  dateFormat: string;
  language: string;
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  movementAlerts: boolean;
  reportAlerts: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipRestrictions: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  apiAccess: boolean;
  debugMode: boolean;
}