import { Product } from "./Product";

export type Location = {
  full_name: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building_number: string;
  floor_number: string;
  apartment_number: string;
  landmark: string;
  notes: string;
};
export type Checkout = {
  items: Product[];
  payment_method: string;
  location: Location;
  save_info: boolean;
  newsletter: boolean;
};
export type ClientErrors = {
  payment_method: string;
  location: { [K in keyof Location]: string };
  save_info: boolean;
  newsletter: boolean;
};