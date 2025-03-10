export interface Ticket {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  number: string;
  url: string;
  name: string;
  id_number: string;
  phone_number: string;
  email: string;
  start: string;
  end: string;
  booking: string;
  pricing: string;
  qr_code: string | null;
}

interface Location {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  product: string;
  coordinates: string;
  address: string;
}

export interface TicketBookingOrder {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  product: string;
  user: string;
  status: string;
  total_cost: string;
  total_tickets_count: number;
  locations: Location[];
}
