import { PaymentMethod } from "@/constants";

export type VendorTransactionsFilters = {
  page: number;
  page_size: number;
};

export type VendorSalesFilters = {
  page: number;
  page_size: number;
};

export interface BankDetails {
    bank_name: string;
    bank_code: string;
    branch: string;
    account_number: string;
  }
  
  export interface MobileMoneyDetails {
    mobile_money_type: string;
    business_number: string;
  }
  
  export interface NewPaymentMethodPayload {
    type: PaymentMethod; 
    bank_details?: BankDetails;
    mobile_money_details?: MobileMoneyDetails;
  }
  
  export type VendorAccountTransactionsFilters = {
    page: number;
    page_size: number;
    account_id: string;
  };