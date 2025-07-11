import { Navigate, Route } from "react-router-dom";
import EndUserLayout from "../../pages/UserPages/EndUserLayout/Layout";
import Home from "../../pages/UserPages/Home/Home";
import EndUserSignIn from "../../pages/UserPages/AuthPages/EndUserSignin";
import EndUserSignUp from "../../pages/UserPages/AuthPages/EndUserSignUp";
import Checkout from "../../pages/UserPages/Checkout/Checkout";
import EndUserWrapper from "./StoreProvider";
import Cart from "../../pages/UserPages/Cart/Cart";
import UserControlLayout from "../../pages/UserPages/EndUserLayout/UserControlLayout";
import UserOrders from "../../pages/UserPages/UserOrders/UserOrders";
import CategoriesLayout from "../../pages/UserPages/EndUserLayout/CategoriesLayout";
import Shop from "../../pages/UserPages/Shop/Shop";
import AllProducts from "../../pages/UserPages/Shop/AllProducts";
import ProductDetails from "../../pages/UserPages/ProductDetails/ProductDetails";
import OrderDetailsPage from "../../pages/UserPages/UserOrders/OrderDetails";
import UserProfile from "../../pages/UserPages/UserProfile/UserProfile";
import UserNotifications from "../../pages/UserPages/UserNotifications/UserNotifications";
import ProductsCompare from "../../pages/UserPages/ProductsCompare/ProductsCompare";
import ProductsFavorite from "../../pages/UserPages/ProductsFavorite/ProductsFavorite";
import UserForgotPassword from "../../pages/UserPages/AuthPages/UserForgotPassword";
import TermsAndConditionsPage from "../../pages/UserPages/TermsAndConditions/TermsAndConditionsPage";
import ReturnPolicyPage from "../../pages/UserPages/ReturnPolicy/ReturnPolicyPage";
import SupportPolicyPage from "../../pages/UserPages/SupportPolicy/SupportPolicy";
import PrivacyPolicyPage from "../../pages/UserPages/PrivacyPolice/PrivacyPolice";
const getBrowserLanguage = () => {
  const browserLang = navigator.language.split("-")[0]; // تأخذ الجزء الأول (مثل 'en' من 'en-US')
  const supportedLangs = ["en", "ar"]; // اللغات التي يدعمها تطبيقك

  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }
  return "en"; // default language
};
export const EndUserRoutes = (
  <>
    <Route element={<EndUserWrapper />}>
      <Route path="/" element={<Navigate to={`/en`} replace />} />

      <Route path="/:lang" element={<EndUserLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<UserControlLayout />}>
          <Route path="u-profile" element={<UserProfile />} />
          <Route path="u-orders" element={<UserOrders />} />
          <Route path="u-orders/details/:id" element={<OrderDetailsPage />} />
          <Route path="u-notification" element={<UserNotifications />} />
          <Route path="u-compare" element={<ProductsCompare />} />
          <Route path="u-favorite" element={<ProductsFavorite />} />
        </Route>
        <Route path="terms" element={<TermsAndConditionsPage />} />
        <Route path="return" element={<ReturnPolicyPage />} />
        <Route path="support" element={<SupportPolicyPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="category" element={<CategoriesLayout />}>
          <Route index element={<AllProducts />} />
          <Route path=":category_id" element={<Shop />} />
        </Route>
      </Route>

      <Route path="/:lang/reset-password" element={<UserForgotPassword />} />
      <Route path="/:lang/signin" element={<EndUserSignIn />} />
      <Route path="/:lang/signup" element={<EndUserSignUp />} />
      {/* صفحات برة لغة المستخدم */}
      <Route path="/checkout" element={<Checkout />} />
    </Route>
  </>
);
