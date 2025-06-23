import { ID } from "./Common";

export type Admin = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  created_at: string;
};
export type AdminsPaginate = {
  current_page: number;
  data: Admin[];
  first_page_url: string;
  from: number;
  last_page: number;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  next_page_url: string | null;
  path: string;
  last_page_url: string;
  links: any[];
};

type UpdateAdminInput = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
};

export type AdminFilters = {
  page?: string | number;
  name?: string;
  email?: string;
  phone?: string;
};

export type UpdateAdminArguments = {
  id: ID;
  adminData: UpdateAdminInput;
};

export type CreateAdminInput = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data: AdminsPaginate;
};
