import { MediaType, PricingType } from "./constants";

export interface ProductPricing  {
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

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  name: string;
  description: string;
  number: string;
  category: string;
  subcategory: string;
  availability: string | null;
  pricing: Array<ProductPricing>;
  image: string | null;
  locations: Array<any>;
}

export interface ProductMedia {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  media_type: MediaType
  file: string;
  uploaded_at: string;
}
