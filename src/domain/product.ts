import { MediaType } from "./constants";

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
  pricing: any[];
  image: string | null;
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
