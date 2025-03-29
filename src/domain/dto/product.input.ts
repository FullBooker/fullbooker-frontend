import { County } from "../location";

export interface ComprehensiveProductFilters {
  search?: string;
  categories?: Array<string>;
  locations?: Array<County>;
  max_price?: string;
  min_price?: string;
  start_date?: string;
  end_date?: string;
}
