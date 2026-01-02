export interface CartItem {
  id: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  discount: number;
}
