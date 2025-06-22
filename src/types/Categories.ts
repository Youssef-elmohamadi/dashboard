export type CategoryParams = {
  page: number | undefined;
  pageSize?: number | undefined;
  name?: string;
};

export type SearchValues = {
  name: string;
};

export type CategoryFilters = {
  name?: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  children: Category[] | null;
  commission_rate: number | null;
  appears_in_website: boolean;
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
  original: Category[];
}
export interface AllCategoriesData {
  header: {};
  original: Category[];
}

export interface GetCategoriesApiResponse {
  success: boolean;
  message: string;
  data: PaginatedCategoriesData;
}
