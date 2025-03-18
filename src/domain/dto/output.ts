import { Product } from "../product";

export type AuthData = {
  user: User;
};

export interface User {
  id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  id_number: string;
  country: string;
  wallet_balance: number;
  bonus_wallet_balance: number;
  last_logged_in: string;
  city: string;
  address: string;
  national_id: string;
  phone: string;
  image?: string;
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

export interface Currency {
  id: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  name: string;
  code: string;
}

export interface ProductTag {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  name: string;
  icon: string;
}

export interface VendorProductsAPIResponse {
  count?: number;
  next?: string;
  previous?: any;
  results: Array<Product>;
}

export interface ProductsAPIResponse {
  count: number;
  next?: string;
  previous?: any;
  results: Array<Product>;
}
