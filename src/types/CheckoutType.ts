
export interface Location {
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
}
export interface Checkout {
  items: Item[];
  payment_method: string;
  transportation_price: number;
  location: Location;
  save_info: boolean;
  newsletter: boolean;
}
export interface Item {
  product_id: number;
  quantity: number;
  varient_id?: number;
}

export interface ClientErrors {
  payment_method: string;
  transport: string;
  location: {
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
  save_info: boolean;
  newsletter: boolean;
}
