import { MediaType, PricingType } from "./constants";
import { User } from "./dto/output";

export interface ProductPricing {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  name: string | null;
  product: string;
  currency: string;
  cost: string;
  type: PricingType | string;
  ticket_tier: string | null;
  maximum_number_of_tickets: number;
}

interface ProductLocation {
  id: string;
  active: boolean;
  coordinates: string;
  created_at: string;
  updated_at: string;
  host: string;
  product: string;
}

export interface ProductHost {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  user: User
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: ProductHost;
  name: string;
  description: string;
  number: string;
  category: string;
  subcategory: string;
  availability: string | null;
  pricing: Array<ProductPricing>;
  image: ProductMedia;
  locations: Array<ProductLocation>;
}

export interface ProductMedia {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  media_type: MediaType;
  file: string;
  uploaded_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
  quantity: number;
  discount?: number;
  total: number;
  type: string;
  date: string;
  pricing_type: string;
  product_thumbnail: string;
  product_id: string;
}

export interface CartSummary {
  product_id: string;
  product_title: string;
  product_thumbnail: string;
  product_base_price: string;
  product_location: string;
  base_currency: string;
  total_price: number;
  total_items: number;
}

export type TicketPricingCategory = {
  key: string;
  title: string;
};

export type SessionPricingCategory = {
  key: string;
  title: string;
};

export type ComprehensiveProductFilters = {
  keyword: string;
  location: string;
  pricingRange: {
    max: number;
    min: number;
  };
  categories: Array<string>;
};
