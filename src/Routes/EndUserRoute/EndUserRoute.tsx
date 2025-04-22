import { Route } from "react-router-dom";
import EndUserLayout from "../../pages/UserPages/EndUserLayout/Layout"; // المسار حسب مكان الملف
import Home from "../../pages/UserPages/Home/Home"; // أنشئ صفحة Home إن ما كانتش موجودة
import EndUserSignIn from "../../pages/UserPages/AuthPages/EndUserSignin";
import EndUserSignUp from "../../pages/UserPages/AuthPages/EndUserSignUp";
import StoreProvider from "./StoreProvider";
import Checkout from "../../pages/UserPages/Checkout/Checkout";
export const EndUserRoutes = (
  <>
    <Route element={<StoreProvider />}>
      <Route element={<EndUserLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Route>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/signin" element={<EndUserSignIn />} />
    <Route path="/signup" element={<EndUserSignUp />} />
  </>
);
