import { Product } from "./Product";

export type OrdersParams = {
  page?: number;
  status?: string;
  shipping_status?: string;
  tracking_number?: string;
  from_date?: string;
  to_date?: string;
};

export type OrderFilters = {
  status?: string;
  shipping_status?: string;
  tracking_number?: string;
  from_date?: string;
  to_date?: string;
};
interface OrderItem {
  id: number;
  product: Product;
  price: number;
  quantity: number;
  total: number;
}
interface Location {
  building_number: string;
  street: string;
  city: string;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface MainOrder {
  payment_method: string;
  user: User;
  location?: Location;
}

interface Vendor {
  name: string;
}

export type Order = {
  id: number | string;
  vendor_id: number;
  status: string;
  total: number;
  order_id: string;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  billing_address: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_status: string;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  estimated_delivery_date: string;
  order: MainOrder;
  items: OrderItem[];
  vendor: Vendor;
  delivered_at: string | null;
};

export type SearchValuesOrders = {
  status: string;
  shipping_status: string;
  tracking_number: string;
  from_date: string;
  to_date: string;
};

export type PaginatedOrdersData = {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export interface GetOrdersPaginateApiResponse {
  success: boolean;
  message: string;
  data: PaginatedOrdersData;
}
