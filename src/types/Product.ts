import { Brand } from "./Brands";
import { Category } from "./Categories";
import { Vendor } from "./Vendor";

export type Attribute = {
  id?: number;
  product_id?: number;
  attribute_name: string;
  attribute_value: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  pivot: {
    product_id: number;
    tag_id: number | string;
  };
};

export type image = {
  id?: number;
  image: string;
  product_id?: number;
  created_at?: string;
  updated_at?: string;
};
export type Product = {
  id: number;
  vendor_id?: number;
  name: string;
  description: string | undefined;
  category_id?: string;
  brand_id?: string;
  price: number | string;
  discount_price?: number | string | null;
  stock_quantity?: number | string;
  status?: string;
  rate?: number | null;
  review: any[];
  is_featured: boolean;
  is_fav?: boolean;
  rating?: number | null;
  views_count?: number | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
  attributes: Attribute[];
  images: image[];
  tags: Tag[];
  variants?: any[];
  slug?: string;
  vendor?: Vendor;
  tax?: number | null;
  quantity?: number; // For cart management
};

export type SearchValues = {
  name: string;
  category_id: string;
  brand_id: string;
  status: string;
};

export type ProductFilters = {
  category_id?: string;
  brand_id?: string;
  status?: string;
  name?: string;
};

export type ProductsPaginate = {
  data: Product[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
};

export type productInputData = {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock_quantity: string;
  category_id: string;
  brand_id: string;
  status: string;
  is_featured: boolean;
};

export type ServerError = {
  name: string[];
  price: string[];
  description: string[];
  category_id: string[];
  brand_id: string[];
  stock_quantity: string[];
  status: string[];
  is_featured: string[];
  discount_price: string[];
  images: string[];
  attributes: string[];
  tags: string[];
  general: string;
  global: string;
};

export type ClientErrors = Record<string, string>;
