export type TransportInputData = {
  area_ar:string;
  area_en:string;
  is_free:boolean;
  fixed_price:string;
  vehicle_type:string;
};

export type Car ={
  name:string;
  value:string
}

export type TruckTypes = Car[];
export interface Area {
  value: string;
  label: string;
}



export type TransportationPriceParams = {
  page: number | undefined;
  pageSize?: number | undefined;
};
export type Transport = {
  id: number;
  area_ar: string;
  area_en: string;
  is_free: boolean;
  vehicle_type: string;
  fixed_price: number | string;
  price_per_km:number|string;
  created_at:string;
  updated_at:string;
};
export type PaginatedTransport = {
  current_page: number;
  data: Transport[];
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

export interface Child {
  id: number;
  name: string;
  childs?: Child[]; 
}


// export type AllCategoriesOriginal = {
//   data: Category[];
// };


export interface GetCategoriesApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ServerErrors = {
  area_ar: string[];
  area_en: string[];
  is_free: string[];
  vehicle_type: string[];
  fixed_price: string[];
  global: string;
  general: string;
};

export type ClientErrors = {
  area_ar?: string;
  area_en?: string;
  is_free?: boolean;
  vehicle_type?: string;
  fixed_price?: string;
};
