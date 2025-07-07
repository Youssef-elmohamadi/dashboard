export type Document = {
  document_name: string;
  document_type: number;
  status: string;
  created_at: string;
  id: number;
};
export type Vendor = {
  name: string;
  id: number;
  email: string;
  phone: string;
  description: string;
  status: string;
  is_verified: number;
  created_at: string;
  updated_at: string;
  documents: Document[];
};
export type VendorsPaginate = {
  data: Vendor[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type SearchValues = {
  name?: string;
  email?: string;
  phone?: string;
};

export type VendorDocumentName = {
  1: string | File;
  2: string | File;
};
