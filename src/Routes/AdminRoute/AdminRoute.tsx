import { Route } from "react-router-dom";
import AdminLayout from "../../pages/AdminPages/layout/AdminLayout";
import Home from "../../pages/AdminPages/Dashboard/Home";
import UserProfiles from "../../pages/AdminPages/UserProfiles";
import Calendar from "../../pages/AdminPages/Calendar";
import Admins from "../../pages/AdminPages/Users/Admins";
import CreateAdmin from "../../components/admin/usersTable/CreateAdmin";
import UpdateAdmin1 from "../../components/usersTable/UpdateAdmin1";
import Roles from "../../pages/AdminPages/Users/Roles";
import CreateRole from "../../components/admin/RolesTable/CreateRole";
import Categories from "../../pages/Categories/Categories";
import CreateCategories from "../../components/categories/CreateCategories";
import Brands from "../../pages/AdminPages/Brands/Brands";
import CreateBrand from "../../components/admin/brandsTable/CreateBrand";
import Products from "../../pages/AdminPages/Products/Products";
import CreateProducts from "../../components/Products/CreateProducts";
import Blank from "../../pages/AdminPages/Blank";
import FormElements from "../../pages/AdminPages/Forms/FormElements";
import BasicTables from "../../pages/AdminPages/Tables/BasicTables";
import LineChart from "../../pages/AdminPages/Charts/LineChart";
import BarChart from "../../pages/AdminPages/Charts/BarChart";
import AdminSignIn from "../../pages/AdminPages/AuthPages/AdminSignIn";
import AdminSignUp from "../../pages/AdminPages/AuthPages/AdminSignUp";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

export const adminRoutes = (
  <>
    {/* الحماية هنا */}
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
      <Route path="categories" element={<Categories />} />
      <Route path="categories/create" element={<CreateCategories />} />
      <Route path="brands" element={<Brands />} />
      <Route path="brands/create" element={<CreateBrand />} />
      <Route path="products" element={<Products />} />
      <Route path="products/create" element={<CreateProducts />} />
      <Route path="blank" element={<Blank />} />
      <Route path="form-elements" element={<FormElements />} />
      <Route path="basic-tables" element={<BasicTables />} />
      <Route path="line-chart" element={<LineChart />} />
      <Route path="bar-chart" element={<BarChart />} />
    </Route>

    {/* الصفحات المفتوحة بدون تسجيل دخول */}
    <Route path="/admin/signin" element={<AdminSignIn />} />
    <Route path="/admin/signup" element={<AdminSignUp />} />
  </>
);
