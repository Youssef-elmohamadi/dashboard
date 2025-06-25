import { createSlice } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../../../../types/Redux";
const storedCart = localStorage.getItem("cart");
const initialState = storedCart
  ? JSON.parse(storedCart)
  : { items: [], totalQuantity: 0, totalPrice: 0, discount: 0 };



const saveToLocalStorage = (state: CartState): void => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { item, quantity } = action.payload;
      const existingItem: CartItem | undefined = state.items.find((i: CartItem) => i.id === item.id);

      if (!existingItem) {
        state.items.push({ ...item, quantity });
      } else {
        existingItem.quantity += quantity;
      }

      state.totalQuantity += quantity;
      state.totalPrice += item.price * quantity;
      saveToLocalStorage(state);
    },

    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem: CartItem | undefined = state.items.find((item: CartItem) => item.id === id);
      if (existingItem) {
        state.totalPrice -= existingItem.price;
        existingItem.quantity--;
        state.totalQuantity--;

        if (existingItem.quantity === 0) {
            state.items = state.items.filter((item: CartItem) => item.id !== id);
        }
      }
      saveToLocalStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.discount = 0;
      saveToLocalStorage(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem: CartItem | undefined = state.items.find((item: CartItem) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
        state.totalQuantity = state.items.reduce(
          (total: number, item: CartItem) => total + item.quantity,
          0
        );

        state.totalPrice = state.items.reduce(
          (total: number, item: CartItem) => total + item.price * item.quantity,
          0
        );
      }
      saveToLocalStorage(state);
    },

    applyDiscount: (state, action) => {
      const discount = parseFloat(action.payload); // مثلاً 100 جنيه خصم
      state.discount = discount;
      saveToLocalStorage(state);
    },
  },
});

export const { addItem, removeItem, clearCart, updateQuantity, applyDiscount } =
  cartSlice.actions;
export default cartSlice.reducer;
