export interface NewTicketPayload {
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
  pricing: string;
}

export interface TicketFilters {
  page: number;
  page_size: number;
}
