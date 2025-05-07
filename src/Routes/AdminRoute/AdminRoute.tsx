import { Route } from "react-router-dom";
import AdminLayout from "../../pages/AdminPages/layout/AdminLayout";
import Home from "../../pages/AdminPages/Dashboard/Home";
import UserProfiles from "../../pages/AdminPages/UserProfile/UserProfiles";
import Calendar from "../../pages/AdminPages/Calendar";
import Admins from "../../pages/AdminPages/Users/Admins";
import CreateAdmin from "../../components/admin/usersTable/CreateAdmin";
import UpdateAdmin1 from "../../components/admin/usersTable/UpdateAdmin1";
import Roles from "../../pages/AdminPages/Users/Roles";
import CreateRole from "../../components/admin/RolesTable/CreateRole";
import UpdateRole from "../../components/admin/RolesTable/UpdateRole";
import Categories from "../../pages/AdminPages/Categories/Categories";
import Brands from "../../pages/AdminPages/Brands/Brands";
import CreateBrand from "../../components/admin/brandsTable/CreateBrand";
import UpdateBrand from "../../components/admin/brandsTable/UpdateBrand";
import Products from "../../pages/AdminPages/Products/Products";
import CreateProducts from "../../components/admin/Products/CreateProducts";
import UpdateProduct from "../../components/admin/Products/UpdateProduct";
import ProductDetails from "../../components/admin/Products/ShowMore";
import Blank from "../../pages/AdminPages/Blank";
import FormElements from "../../pages/AdminPages/Forms/FormElements";
import BasicTables from "../../pages/AdminPages/Tables/BasicTables";
import LineChart from "../../pages/AdminPages/Charts/LineChart";
import BarChart from "../../pages/AdminPages/Charts/BarChart";
import AdminSignIn from "../../pages/AdminPages/AuthPages/AdminSignIn";
import AdminSignUp from "../../pages/AdminPages/AuthPages/AdminSignUp";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import Orders from "../../pages/AdminPages/Orders/Orders";
import OrderDetails from "../../components/admin/ordersTable/ShowMore";
import Coupons from "../../pages/AdminPages/Coupons/Coupons";
import CreateCoupon from "../../components/admin/couponsTable/CreateCoupon";
import UpdateCoupon from "../../components/admin/couponsTable/UpdateCoupon";
import ShowMore from "../../components/admin/couponsTable/ShowMore";
import CouponDetails from "../../components/admin/couponsTable/ShowMore";
import OrdersReports from "../../pages/AdminPages/Orders Report/OrdersReports";
import ProductReports from "../../pages/AdminPages/Products Report/ProductReports";

export const adminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }
    >
      <Route index element={<Home />} />
      <Route path="profile" element={<UserProfiles />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="admins" element={<Admins />} />
      <Route path="admins/create" element={<CreateAdmin />} />
      <Route path="admins/update/:id" element={<UpdateAdmin1 />} />
      <Route path="roles" element={<Roles />} />
      <Route path="roles/create" element={<CreateRole />} />
      <Route path="roles/update/:id" element={<UpdateRole />} />
      <Route path="categories" element={<Categories />} />
      <Route path="brands" element={<Brands />} />
      <Route path="brands/create" element={<CreateBrand />} />
      <Route path="brands/update/:id" element={<UpdateBrand />} />
      <Route path="products" element={<Products />} />
      <Route path="products/create" element={<CreateProducts />} />
      <Route path="products/update/:id" element={<UpdateProduct />} />
      <Route path="products/details/:id" element={<ProductDetails />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/details/:id" element={<OrderDetails />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="coupons/create" element={<CreateCoupon />} />
      <Route path="coupons/update/:id" element={<UpdateCoupon />} />
      <Route path="coupons/details/:id" element={<CouponDetails />} />
      <Route path="orders_report" element={<OrdersReports />} />
      <Route path="products_report" element={<ProductReports />} />
      <Route path="blank" element={<Blank />} />
      <Route path="form-elements" element={<FormElements />} />
      <Route path="basic-tables" element={<BasicTables />} />
      <Route path="line-chart" element={<LineChart />} />
      <Route path="bar-chart" element={<BarChart />} />
    </Route>
    <Route path="/admin/signin" element={<AdminSignIn />} />
    <Route path="/admin/signup" element={<AdminSignUp />} />
  </>
);
