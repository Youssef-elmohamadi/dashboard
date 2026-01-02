import { Product } from "./Product";

export type CategoryParams = {
  page: number | undefined;
  pageSize?: number | undefined;
  name?: string;
};

export interface Child {
  id: number;
  name: string;
  childs?: Child[]; // يمكن أن تحتوي على أطفال آخرين (متداخلة)
}

export type SearchValues = {
  name: string;
};

export type CategoryFilters = {
  name?: string;
};

export type Category = {
  id: number;
  name_ar: string;
  name_en: string;
  icon: string;
  description_ar: string;
  description_en: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  children: Category[] | null;
  commission_rate: number | null | string;
  appears_in_website: boolean;
  products: Product[];
  order: number;
  childs: Child[];
};

// export type AllCategoriesOriginal = {
//   data: Category[];
// };

export type PaginatedCategoryOriginal = {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  url: string | null;
  label: string;
  active: boolean;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export interface PaginatedCategoriesData {
  header: {};
  original: PaginatedCategoryOriginal;
}
export interface AllCategoriesData {
  header: {};
  original: Category[];
}

export interface GetCategoriesApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export type CategoryInputData = {
  name_ar: string;
  name_en: string;
  icon: string;
  description_ar: string;
  description_en: string;
  image: File | null | string;
  status: "active" | "inactive";
  parent_id: string | null;
  commission_rate: string | null;
  appears_in_website: boolean;
};

export type ServerErrors = {
  name_ar: string[];
  name_en: string[];
  icon: string[];
  description_ar: string[];
  description_en: string[];
  image: string[];
  status: string[];
  parent_id: string[];
  commission_rate: string[];
  appears_in_website: string[];
  global: string;
  general: string;
};

export type ClientErrors = {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  status: string;
  parent_id: string;
  commission_rate: string;
  appears_in_website: string;
};
