import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../../../../types/Redux";

const storedCart = localStorage.getItem("cart");
const initialState: CartState = storedCart
  ? JSON.parse(storedCart)
  : { items: [], totalQuantity: 0, totalPrice: 0, discount: 0 };

const saveToLocalStorage = (state: CartState): void => {
  localStorage.setItem("cart", JSON.stringify(state));
};
const generateUniqueCartKey = (item: CartItem): string => {
  const selectionsKey = item.custom_selections
    ? item.custom_selections
        .map((s: any) => `${s.question_id}-${s.id}`)
        .sort()
        .join("_")
    : "no_selections";

  return `${item.id}_${item.variant_id || "no_variant"}_${selectionsKey}`;
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) =>
      total + (Number(item.total_item_price_with_descount) * item.quantity),
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
      const newItemKey = generateUniqueCartKey(item);
      const existingItem = state.items.find(
        (i) => generateUniqueCartKey(i) === newItemKey
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
      action: PayloadAction<{ item: CartItem }> // تعديل لاستقبال الـ item بالكامل للمقارنة
    ) => {
      const targetKey = generateUniqueCartKey(action.payload.item);
      const existingItem = state.items.find((i) => generateUniqueCartKey(i) === targetKey);

      if (existingItem) {
        existingItem.quantity--;
        if (existingItem.quantity === 0) {
          state.items = state.items.filter((i) => generateUniqueCartKey(i) !== targetKey);
        }
      }

      const { totalQuantity, totalPrice } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      saveToLocalStorage(state);
    },

    deleteItem: (state, action: PayloadAction<{ item: CartItem }>) => {
      const targetKey = generateUniqueCartKey(action.payload.item);
      state.items = state.items.filter((i) => generateUniqueCartKey(i) !== targetKey);

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
      action: PayloadAction<{ item: CartItem; quantity: number }>
    ) => {
      const targetKey = generateUniqueCartKey(action.payload.item);
      const existingItem = state.items.find((i) => generateUniqueCartKey(i) === targetKey);

      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
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