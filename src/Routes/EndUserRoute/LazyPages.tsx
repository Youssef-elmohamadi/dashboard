import { lazy, Suspense } from "react"; // استورد lazy و Suspense هنا
import { Route, Routes } from "react-router-dom";
import LoadingPageEndUser from "../../components/ui/LoadingPageEndUser";


const ProductDetails = lazy(
  () => import("../../pages/UserPages/ProductDetails/ProductDetails")
);
const Cart = lazy(() => import("../../pages/UserPages/Cart/Cart"));
const UserControlLayout = lazy(
  () => import("../../pages/UserPages/EndUserLayout/UserControlLayout")
);
const UserProfile = lazy(
  () => import("../../pages/UserPages/UserProfile/UserProfile")
);
const UserOrders = lazy(
  () => import("../../pages/UserPages/UserOrders/UserOrders")
);
const OrderDetailsPage = lazy(
  () => import("../../pages/UserPages/UserOrders/OrderDetails")
);
const UserNotifications = lazy(
  () => import("../../pages/UserPages/UserNotifications/UserNotifications")
);
// const ProductsCompare = lazy(
//   () => import("../../pages/UserPages/ProductsCompare/ProductsCompare")
// );
const ProductsFavorite = lazy(
  () => import("../../pages/UserPages/ProductsFavorite/ProductsFavorite")
);
const TermsAndConditionsPage = lazy(
  () =>
    import("../../pages/UserPages/TermsAndConditions/TermsAndConditionsPage")
);
const ReturnPolicyPage = lazy(
  () => import("../../pages/UserPages/ReturnPolicy/ReturnPolicyPage")
);
const SupportPolicyPage = lazy(
  () => import("../../pages/UserPages/SupportPolicy/SupportPolicy")
);
const PrivacyPolicyPage = lazy(
  () => import("../../pages/UserPages/PrivacyPolice/PrivacyPolice")
);
const CategoriesLayout = lazy(
  () => import("../../pages/UserPages/EndUserLayout/CategoriesLayout")
);
const Shop = lazy(() => import("../../pages/UserPages/Shop/Shop"));
const AllProducts = lazy(
  () => import("../../pages/UserPages/Shop/AllProducts")
);

export default function LazyPages() {
  return (
    <Suspense fallback={<LoadingPageEndUser />}>
      <Routes>
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<UserControlLayout />}>
          <Route path="u-profile" element={<UserProfile />} />
          <Route path="u-orders" element={<UserOrders />} />
          <Route path="u-orders/details/:id" element={<OrderDetailsPage />} />
          <Route path="u-notification" element={<UserNotifications />} />
          {/* <Route path="u-compare" element={<ProductsCompare />} /> */}
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
      </Routes>
    </Suspense>
  );
}
