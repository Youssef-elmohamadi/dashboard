import { Brand } from "./Brands";
import { Category } from "./Categories";

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

type Vendor = {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  status?: string;
  is_verified?: number;
  created_at?: string;
  updated_at?: string;
  documents?: any[];
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
  discount_price?: number | null;
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

