interface TicketPayload {
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
  pricing: string;
  start?: string
}

export interface BookTicketPayload {
  product: string;
  tickets: Array<TicketPayload>
}

export interface TicketFilters {
  page: number;
  page_size: number;
}
