import { Brand } from "./Brands";
import { Category } from "./Categories";
import { Vendor } from "./Vendor";

export type Attribute = {
  id?: number;
  product_id?: number;
  attribute_name_ar: string;
  attribute_value_ar: string;
  attribute_name_en: string;
  attribute_value_en: string;
};

export type Variant = {
  id?: number;
  name_ar: string;
  name_en: string;
  value_ar: string;
  value_en: string;
  stock_quantity: number | null;
  price: number | null;
  discount_price: number | null;
};

export type Tag = {
  id: number;
  name_ar: string;
  name_en: string;
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
type BaseProduct = {
  id: number;
  vendor_id?: number;
  description_ar: string;
  description_en: string;
  description: string | undefined;
  category_id?: string;
  brand_id?: string;
  price: number | string;
  discount_price?: number | string | null;
  stock_quantity?: number | string;
  unit_ar?: string;
  unit_en?: string;
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
  variants?: Variant[];
  slug?: string;
  vendor?: Vendor;
  tax?: number | null;
  quantity?: number;
};

type LocalizedNames = {
  [key in `name_${"ar" | "en"}`]: string;
};

export type Product = BaseProduct & LocalizedNames;

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
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  discount_price: string;
  stock_quantity: string;
  unit_ar: string;
  unit_en: string;
  category_id: string;
  brand_id: string;
  status: string;
  is_featured: boolean;
};

export type ServerError = {
  name_ar: string[];
  name_en: string[];
  price: string[];
  description_ar: string[];
  description_en: string[];
  category_id: string[];
  brand_id: string[];
  stock_quantity: string[];
  unit_ar: string[];
  unit_en: string[];
  status: string[];
  is_featured: string[];
  discount_price: string[];
  images: string[];
  attributes: string[];
  variants: string[];
  tags: string[];
  general: string;
  global: string;
};

export type ClientErrors = Record<string, string>;
export type TagInput = {
  name_ar: string;
  name_en: string;
};
