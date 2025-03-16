import { MediaType, PricingTickerTier, PricingType } from "../constants";
import { ProductLocation, ProductMedia, ProductPricing } from "../product";

export type NewUserPayload = {
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
};

export type RequestOTPPayload = {
  identifier: string;
  otp_method: string;
};

export type VerifyOTPPayload = {
  identifier: string;
  otp: string;
};

export type VerifyPhoneOTPPayload = {
  phone: string;
  otp: string;
};

export type ResendPhoneOTPPayload = {
  phone: string;
};

export type ForgotPasswordPayload = {
  Phone: string;
};

export type ResetPasswordPayload = {
  Phone: string;
  OTP: string;
  Password: string;
  ConfirmPassword: string;
};

export type UpdatePasswordPayload = {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
};

export type UpdateUserProfilePayload = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  national_id: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
};

export type SwitchToHostPayload = {
  user: string;
};

export type NewProductPayload = {
  id?: string;
  product?: string;
  active: boolean;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  locations: Array<ProductLocation>;
  availability?: {
    id?: string;
    product: string;
    product_name: string;
    start: string | null;
    end: string | null;
    start_time: string | null;
    end_time: string | null;
    duration: number;
    open_days: Array<OpenDay>;
    closed_dates: Array<string>;
  };
  pricing: Array<ProductPricing>;
  image?: ProductMedia;
};

export type UpdateProductPayload = {
  id: string;
  active: boolean;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
};

export type ProductsFilters = {
  page: number;
  page_size: number;
  category?: string;
};

export type VendorProductsFilters = {
  page: number;
  page_size: number;
};

export type ProductMediaPayload = {
  media_type: MediaType;
  file: any;
  product_id: string;
};

export type AddProductLocationPayload = {
  product: string;
  lat: number;
  long: number;
  address: any;
};

export type UpdateProductLocationPayload = {
  id: string;
  product: string;
  lat: number;
  long: number;
};

export interface OpenDay {
  id: string;
  day: string;
  opening_at: string;
  closing_at: string;
}

interface ClosedDate {
  date: string;
}

export interface ProductAvailabilityPayload {
  product: string;
  start: string;
  start_time?: string;
  end_time?: string;
  end: string;
  duration: number;
  open_days: OpenDay[];
  closed_dates?: ClosedDate[];
}

export interface UpdateProductAvailabilityPayload {
  id: string;
  product?: string;
  start?: string;
  start_time?: string;
  end_time?: string;
  end?: string;
  duration?: number;
  open_days?: OpenDay[];
  closed_dates?: ClosedDate[];
}

export type DeleteProductMediaPayload = {
  file_id: any;
  media_type: MediaType;
  product_id: string;
};

export interface ProductPricingPayload {
  product: string;
  currency: string;
  cost: number;
  type?: PricingType | string;
  ticket_tier?: PricingTickerTier | string;
  maximum_number_of_tickets: number;
}

export interface UpdateProductPricingPayload {
  product: string;
  id: string;
  currency: string;
  cost: number;
  maximum_number_of_tickets: number;
}

export interface PauseProductPayload {
  product: string;
  active: boolean;
}

export interface ActivateProductPayload {
  product: string;
  active: boolean;
}

export type GoogleSocialSigninPayload = {
  access_token: string;
};
