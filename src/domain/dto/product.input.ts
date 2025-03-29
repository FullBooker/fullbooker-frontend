import { County } from "../location";

export interface ComprehensiveProductFilters {
  search?: string;
  tag?: string | null;
  categories?: Array<string>;
  locations?: Array<County>;
  max_price?: string;
  min_price?: string;
  start_date?: string;
  end_date?: string;
}
