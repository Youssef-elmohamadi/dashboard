import { ReactNode } from "react";

export type FeatureItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export type AdBannerProps = {
  imageUrl: string;
  linkUrl: string;
  altText?: string;
};

export interface Vendor {
  name: string;
  id: number;
  logo?: string | null;
  description: string | null;
}
export interface Banner {
  id: number;
  title: string;
  image: string;
  link_type: string;
  link_id: number;
  url: string;
  position: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryType {
  id: number;
  name: string;
  description: string;
  image: string;
  parent_id: number | null;
  status: string;
  order: number;
  commission_rate: number;
  appears_in_website: string;
  created_at: string | null;
  updated_at: string;
}

export interface BrandType {
  id: number;
  name: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductType {
  id: number;
  vendor_id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  brand_id: number;
  price: number;
  discount_price: number;
  stock_quantity: number;
  status: string;
  is_featured: number;
  rating: number | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
  is_fav: boolean;
  rate: number;
  review: any[]; // ممكن تعرّفها لاحقًا لو فيها بيانات
  category: CategoryType;
  brand: BrandType;
  attributes: any[];
  images: any[];
  tags: any[];
  variants: any[];
}

export interface VendorType {
  id: number;
  name: string;
  email: string;
  phone: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_verified: number;
}

export interface HomeDataType {
  banners: Banner[];
  leatestProducts: ProductType[];
  vendors: VendorType[];
}

export interface HomeApiResponse {
  success: boolean;
  message: string;
  data: HomeDataType;
}

export interface CategoryWithProductsType {
  id: number;
  name: string;
  description: string;
  image: string;
  parent_id: number | null;
  status: string;
  order: number;
  commission_rate: number;
  appears_in_website: string;
  created_at: string | null;
  updated_at: string | null;
  products: ProductType[];
}

export interface CategoriesWithProductsResponse {
  success: boolean;
  message: string;
  data: CategoryWithProductsType[];
}
export interface IconProps {
  className?: string;
}

export interface Feature {
  icon: React.FC<IconProps>;
  title: string;
  description: string;
}

export interface Policy {
  href: string;
  title: string;
  icon: React.FC<IconProps>;
}