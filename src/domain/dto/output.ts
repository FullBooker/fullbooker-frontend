import { GamingTransaction } from "@/app/(dashboard)/gaming-transaction/type";
import { Game } from "../games";
import { Promotion } from "../promotions";
import { Transaction } from "../billing";

export interface GamesApiResponse {
  games: Array<Game>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AuthData = {
  user: User;
};

export interface User {
  id: string;
  phone: string;
  country: string;
  wallet_balance: number;
  bonus_wallet_balance: number;
  last_logged_in: string;
}

export interface PromotionsApiResponse {
  promotions: Array<Promotion>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export interface GamesTransactionsApiResponse {
  transactions: Array<GamingTransaction>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaymentsTransactionsApiResponse {
  transactions: Array<Transaction>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}