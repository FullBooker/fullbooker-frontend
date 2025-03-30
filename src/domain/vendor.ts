import { AccountType, BalanceType, TransactionStatus } from "@/constants";

export interface Transaction {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  product: string;
  currency: string;
  product_name: string;
  product_number: string;
  user: string;
  status: TransactionStatus;
  total_cost: string;
  total_tickets_count: number;
  type: string
}

export interface Account {
    id: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    name: string;
    account_type: AccountType
    balance_type: BalanceType
    balance: string;
  }
  
  export interface HostAccount {
    id: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    host: string;
    account: Account;
  }
  