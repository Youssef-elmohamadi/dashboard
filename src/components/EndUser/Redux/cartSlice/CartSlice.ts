import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../../../../types/Redux";

const storedCart = localStorage.getItem("cart");
const initialState: CartState = storedCart
  ? JSON.parse(storedCart)
  : { items: [], totalQuantity: 0, totalPrice: 0, discount: 0 };

const saveToLocalStorage = (state: CartState): void => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) =>
      total + (item.discount_price || item.price) * item.quantity,
    0
  );
  return { totalQuantity, totalPrice };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ item: CartItem; quantity: number }>
    ) => {
      const { item, quantity } = action.payload;

      const existingItem = state.items.find(
        (i) => i.id === item.id && i.variant_id === item.variant_id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }

      const { totalQuantity, totalPrice } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      saveToLocalStorage(state);
    },

    removeItem: (
      state,
      action: PayloadAction<{ id: string | number; variantId: string | number }>
    ) => {
      const { id, variantId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.variant_id === variantId
      );

      if (existingItem) {
        existingItem.quantity--;
        if (existingItem.quantity === 0) {
          // ✅ هنا عدلت الشرط
          state.items = state.items.filter(
            (item) => !(item.id === id && item.variant_id === variantId)
          );
        }
      }

      const { totalQuantity, totalPrice } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      saveToLocalStorage(state);
    },

    deleteItem: (
      state,
      action: PayloadAction<{
        id: string | number;
        variantId?: string | number;
      }>
    ) => {
      const { id, variantId } = action.payload;

      state.items = state.items.filter((item) =>
        variantId
          ? !(item.id === id && item.variant_id === variantId)
          : item.id !== id
      );

      const { totalQuantity, totalPrice } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      saveToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.discount = 0;
      saveToLocalStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string | number;
        variantId?: string | number;
        quantity: number;
      }>
    ) => {
      const { id, variantId, quantity } = action.payload;

      const existingItem = state.items.find((item) =>
        variantId
          ? item.id === id && item.variant_id === variantId
          : item.id === id
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }

      const { totalQuantity, totalPrice } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      saveToLocalStorage(state);
    },

    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
      saveToLocalStorage(state);
    },
  },
});

export const {
  addItem,
  removeItem,
  deleteItem,
  clearCart,
  updateQuantity,
  applyDiscount,
} = cartSlice.actions;
export default cartSlice.reducer;
