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
  remaining_tickets: number;
  sold_tickets: number;
  bulk_discount: number;
}

export interface ProductLocation {
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
  user: User;
}

interface OpenDay {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  day: string;
  day_name: string;
  opening_at: string;
  closing_at: string;
}

export interface Availability {
  id: string;
  product: string;
  product_name: string;
  start: string | null;
  end: string | null;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  open_days: Array<OpenDay>;
  closed_dates: Array<string>;
}

export interface DateSlot {
  day: string;
  month: string;
  date: number;
  time: string;
  isActive: boolean;
  fullDate: Date | string
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
  availability: Availability;
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
  pricing_type_id: string;
  pricing_type: string;
  cost: number;
}

export interface CartSummary {
  product_id?: string;
  product_title?: string;
  product_location: string;
  product_thumbnail?: string;
  currency?: string;
  base_currency?: string;
  selected_date?: Date | string;
  time?: string;
  prefill_all_items_with_primary_user_details: boolean;
  total_price: number;
}

export type TicketPricingCategory = {
  key: string;
  title: string;
  label: string;
};

export type SessionPricingCategory = {
  key: PricingType;
  title: string;
  label: string;
};
