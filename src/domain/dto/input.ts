import { MediaType } from "../constants";

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
  locations: Array<any>
};

export type UpdateProductPayload = {
  id: string;
  active: boolean;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
};

export type VendorProductsFilters = {
  page: number;
  limit: number;
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
};

export type UpdateProductLocationPayload = {
  product: string;
  lat: number;
  long: number;
};

export interface OpenDay {
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
  end: string;
  duration: number;
  open_days: OpenDay[];
  closed_dates?: ClosedDate[];
}