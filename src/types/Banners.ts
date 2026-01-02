export type SearchValues = {
  name: string;
  category_id?: number | string;
  brand_id?: number | string;
  status: string;
};

export type ServerErrors = {
  title: string[];
  image: string[];
  link_type: string[];
  url: string[];
  link_id: string[];
  position: string[];
  is_active: string[];
  global: string;
  general: string;
};
export type ClientErrors = {
  title: string;
  image: string;
  link_type: string;
  url: string;
  link_id: string;
  position: string;
  is_active: string;
};


export type Banner = {
  id: number;
  title: string;
  image: string;
  link_type: "category" | "external";
  link_id: string;
  url: string | null;
  position: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};


export type BannersPagination = {
  current_page: number;
  data: Banner[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};


export type BannersApiResponse = {
  success: boolean;
  message: string;
  data: BannersPagination;
};


export type BannerInput = {
  title: string;
  image: File | string;
  link_type: "category" | "external"|"";
  link_id: string;
  url: string;
  position: string;
  is_active: string;
};
