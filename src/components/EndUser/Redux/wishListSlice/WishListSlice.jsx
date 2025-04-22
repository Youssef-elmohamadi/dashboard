import { createSlice } from "@reduxjs/toolkit";

const wishListSlice = createSlice({
  name: "wishList",
  initialState: {
    items: [],
  },
  reducers: {
    addItemToWishList: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push(newItem);
      }
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    clear: (state) => {
      state.items = [];
    },
  },
});

export const { addItemToWishList, removeItem, clear } = wishListSlice.actions;
export default wishListSlice.reducer;
