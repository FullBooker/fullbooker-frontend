export type AuthData = {
  user: User;
};

export interface User {
  id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  wallet_balance: number;
  bonus_wallet_balance: number;
  last_logged_in: string;
}

export interface VendorDetails {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  user: string;
}

export interface Subcategory {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  name: string;
  description: string | null;
  category: string;
  children: Subcategory[];
}

export interface ProductCategory {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  name: string;
  description: string | null;
  subcategories: Array<Subcategory>;
}

export interface DayOfWeek {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  name: string;
}
