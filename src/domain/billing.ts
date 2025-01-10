export type Transaction = {
  CreatedAt: string;
  TransactionID: string;
  TransactionType: string;
  TransactionAmount: number;
  TransactionStatus: string;
  PaymentMethod: string;
  OldBalance: number;
  NewBalance: number;
  Currency: string;
};
