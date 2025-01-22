export type AuthData = {
    user: User;
  };
  
  export interface User {
    id: string;
    phone_number: string;
    email: string;
    first_name: string;
    last_name: string;
    country: string;
    wallet_balance: number;
    bonus_wallet_balance: number;
    last_logged_in: string;
  }