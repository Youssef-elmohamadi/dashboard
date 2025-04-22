import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./cartSlice/CartSlice";
import CompareReducer from "./compareSlice/CompareSlice";
import WishListReducer from "./wishListSlice/WishListSlice";
const Store = configureStore({
  reducer: {
    cart: CartReducer,
    compare: CompareReducer,
    wishList: WishListReducer,
  },
});

export default Store;
