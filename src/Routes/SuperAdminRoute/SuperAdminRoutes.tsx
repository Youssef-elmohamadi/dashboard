import { Route } from "react-router-dom";
import SuperAdminLayout from "../../pages/SuperAdminPages/Layout/SuperAdminLayout";
import ProtectedSuperAdminRoute from "./ProtectedSuperAdminRoute";
import SuperAdminSignIn from "../../pages/SuperAdminPages/AuthPages/SuperAdminSignin";
import Vendors from "../../pages/SuperAdminPages/vendors/Vendors";
import VendorDetails from "../../components/SuperAdmin/VendorsTables/ShowMore";
import Categories from "../../pages/SuperAdminPages/Categories/Categories";
import CreateCategory from "../../components/SuperAdmin/CategoriesTable/CreateCategory";
import UpdateCategory from "../../components/SuperAdmin/CategoriesTable/UpdateCategory";
import CategoryDetails from "../../components/SuperAdmin/CategoriesTable/ShowMore";
import Brands from "../../pages/SuperAdminPages/Brands/Brands";
import BrandDetails from "../../components/SuperAdmin/Brands/ShowMore";
import Products from "../../pages/SuperAdminPages/Products/Products";
import ProductDetails from "../../components/SuperAdmin/Products/ShowMore";
import Admins from "../../pages/SuperAdminPages/Users/Admis";
import CreateAdmin from "../../components/SuperAdmin/AdminsTable/CreateAdmin";
import UpdateAdmin from "../../components/SuperAdmin/AdminsTable/UpdateAdmin";
import Roles from "../../pages/SuperAdminPages/Users/Roles";
import CreateRole from "../../components/SuperAdmin/RolesTable/CreateRole";
import UpdateRole from "../../components/SuperAdmin/RolesTable/UpdateRole";
export const SuperAdminRoutes = (
  <>
    <Route
      path="/super_admin"
      element={
        <ProtectedSuperAdminRoute>
          <SuperAdminLayout />
        </ProtectedSuperAdminRoute>
      }
    >
      <Route path="vendors" element={<Vendors />} />
      <Route path="vendors/details/:id" element={<VendorDetails />} />
      <Route path="admins" element={<Admins />} />
      <Route path="admins/create" element={<CreateAdmin />} />
      <Route path="admins/update/:id" element={<UpdateAdmin />} />
      <Route path="roles" element={<Roles />} />
      <Route path="roles/create" element={<CreateRole />} />
      <Route path="roles/update/:id" element={<UpdateRole />} />
      <Route path="categories" element={<Categories />} />
      <Route path="categories/update/:id" element={<UpdateCategory />} />
      <Route path="categories/details/:id" element={<CategoryDetails />} />
      <Route path="categories/create" element={<CreateCategory />} />
      <Route path="brands" element={<Brands />} />
      <Route path="brands/details/:id" element={<BrandDetails />} />
      <Route path="products" element={<Products />} />
      <Route path="products/details/:id" element={<ProductDetails />} />
    </Route>
    <Route path="/super_admin/signin" element={<SuperAdminSignIn />} />
  </>
);
