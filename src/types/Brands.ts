import { ID } from "./Common";

export type BrandFormErrors = {
  name: string[];
  status: string[];
  image: string[];
  global: string;
  general: string;
};

export type BrandFilters = {
  name?: string;
};

export type BrandClientSideErrors = {
  name: string;
  status: string;
  image: string;
};

export type BrandApiError = {
  code: string;
  message: string;
};

export type UpdateBrandParams = {
  id: string | undefined;
  brandData: FormData;
};

export interface Brand {
  id: number;
  name: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface SearchValues {
  name: string;
}

export interface MutateBrand {
  name: string;
  image: string | null | File;
  status: string;
}

export interface PaginatedBrandsData {
  current_page: number;
  data: Brand[];
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
}

export interface GetBrandsPaginateApiResponse {
  success: boolean;
  message: string;
  data: PaginatedBrandsData;
}

export interface BrandParams {
  page: number | undefined;
  pageSize?: number | undefined;
  name?: string;
}

export interface AllBrandsData {
  success: boolean;
  message: string;
  data: Brand[];
}
