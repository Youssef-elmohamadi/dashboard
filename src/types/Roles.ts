export type FilterRole = {
  name?: string;
};
export type Permission = {
  id: number;
  name: string;
};
export type CreateRoleInput = {
  name: string;
  permissions: number[];
};
export type UpdateRoleInput = {
  name: string;
  permissions: number[];
};
export type ServerErrors = {
  name: string[];
  permissions: string[];
  global: string;
  general: string;
};
export type Role = {
  id: number;
  name: string;
  permissions: string[];
  created_at: string;
};

export type SearchValues = {
  name?: string;
};

export type RolesPaginate = {
  current_page: number;
  data: Role[];
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
