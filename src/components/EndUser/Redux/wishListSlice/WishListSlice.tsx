import { createSlice } from "@reduxjs/toolkit";
const StoredWishList = localStorage.getItem("wishlist");
const initialState = StoredWishList
  ? JSON.parse(StoredWishList)
  : { items: [] };
const saveToLocalStorage = (state) => {
  localStorage.setItem("wishlist", JSON.stringify(state));
};
const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    addItemToWishList: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push(newItem);
      }
      saveToLocalStorage(state);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      saveToLocalStorage(state);
    },

    clear: (state) => {
      state.items = [];
      saveToLocalStorage(state);
    },
  },
});

export const { addItemToWishList, removeItem, clear } = wishListSlice.actions;
export default wishListSlice.reducer;
