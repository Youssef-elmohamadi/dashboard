import { Route } from "react-router-dom";
import EndUserLayout from "../../pages/UserPages/EndUserLayout/Layout"; // المسار حسب مكان الملف
import Home from "../../pages/UserPages/Home/Home"; // أنشئ صفحة Home إن ما كانتش موجودة
import EndUserSignIn from "../../pages/UserPages/AuthPages/EndUserSignin";
import EndUserSignUp from "../../pages/UserPages/AuthPages/EndUserSignUp";
import Checkout from "../../pages/UserPages/Checkout/Checkout";
import EndUserWrapper from "./StoreProvider";
import Cart from "../../pages/UserPages/Cart/Cart";
import UserControlLayout from "../../pages/UserPages/EndUserLayout/UserControlLayout";
import UserOrders from "../../pages/UserPages/UserOrders/UserOrders";
import UserDashboard from "../../pages/UserPages/UserDashboard/UserDashboard";
import CategoriesLayout from "../../pages/UserPages/EndUserLayout/CategoriesLayout";
import UserDownloads from "../../pages/UserPages/UserDownloads/UserDownloads";
import UserConversation from "../../pages/UserPages/UserConversation/UserConversation";
import UserWallet from "../../pages/UserPages/UserWallet/UserWallet";
import UserSupportTicket from "../../pages/UserPages/SupportTicket/UserSupportTicket";
import Shop from "../../pages/UserPages/Shop/Shop";
import AllProducts from "../../pages/UserPages/Shop/AllProducts";
export const EndUserRoutes = (
  <>
    <Route element={<EndUserWrapper />}>
      <Route element={<EndUserLayout />}>
        <Route index element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<UserControlLayout />}>
          <Route path="/u-dashboard" element={<UserDashboard />} />
          <Route path="/u-orders" element={<UserOrders />} />
          <Route path="/u-downloads" element={<UserDownloads />} />
          <Route path="/u-conversation" element={<UserConversation />} />
          <Route path="/u-wallet" element={<UserWallet />} />
          <Route path="/u-Support-ticket" element={<UserSupportTicket />} />
        </Route>
        <Route path="/category" element={<CategoriesLayout />}>
          <Route index element={<AllProducts />} />
          <Route path=":category_id" element={<Shop />} />
        </Route>
      </Route>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/signin" element={<EndUserSignIn />} />
      <Route path="/signup" element={<EndUserSignUp />} />
    </Route>
  </>
);
