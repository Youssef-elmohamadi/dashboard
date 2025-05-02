import { createSlice } from "@reduxjs/toolkit";
const storedCompare = localStorage.getItem("compare");
const initialState = storedCompare ? JSON.parse(storedCompare) : { items: [] };

const saveToLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};
const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addItemToCompare: (state, action) => {
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

export const { addItemToCompare, removeItem, clear } = compareSlice.actions;
export default compareSlice.reducer;
