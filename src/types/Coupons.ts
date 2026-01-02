export interface CouponRequest {
  code: string;
  order_total: number;
}
export interface CouponResponse {
  discount: number;
  message: string;
}

export type ClientErrors = {
  code: string;
  type: string;
  value: string;
  max_discount: string;
  min_order_amount: string;
  usage_limit: string;
  active: string;
  start_at: string;
  expires_at: string;
};

export type ServerError = {
  code: string[];
  type: string[];
  value: string[];
  max_discount: string[];
  min_order_amount: string[];
  usage_limit: string[];
  active: string[];
  start_at: string[];
  expires_at: string[];
  general: string;
  global: string;
};

export interface CouponFilters {
  active?: string;
  code?: string;
  type?: string;
  from_date?: string;
  to_date?: string;
}
// Interface for a single coupon object
export interface Coupon {
  id: number;
  code: string;
  vendor_id: number;
  type: "fixed" | "percent"; // Assuming 'type' can be one of these values
  value: string;
  max_discount: string;
  min_order_amount: string;
  usage_limit: string;
  used_count: string;
  active: "1" | "0"; // Assuming active is represented by 1 (true) or 0 (false)
  start_at: string; // ISO 8601 date-time string
  expires_at: string; // ISO 8601 date-time string
  created_at: string; // ISO 8601 date-time string
  updated_at: string; // ISO 8601 date-time string
}

// Interface for the pagination links
export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

// Interface for the paginated data structure
export interface PaginatedCoupons {
  current_page: number;
  data: Coupon[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// The main interface for the entire API response
export interface ApiResponse {
  success: boolean;
  message: string;
  data: PaginatedCoupons;
}

export type CouponInput = {
  code: string;
  type: "fixed" | "percent";
  value: string;
  max_discount: string;
  min_order_amount: string;
  usage_limit: string;
  active: "1" | "0";
  start_at: string;
  expires_at: string;
};
