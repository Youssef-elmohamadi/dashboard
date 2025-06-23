import { ID } from "./Common";
export type role = {
  id: number;
  name: string;
};
export type Admin = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  roles: role[];
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

export type UpdateAdminInput = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password?: string;
  role: string;
};

export type AdminFilters = {
  page?: string | number;
  name?: string;
  email?: string;
  phone?: string;
};

export type UpdateAdminArguments = {
  id: string;
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

export type ServerErrors = {
  first_name?: string[];
  last_name?: string[];
  phone?: string[];
  email?: string[];
  password?: string[];
  role?: string[];
  global?: string;
  general?: string;
};

export type ClientErrors = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: string;
};
