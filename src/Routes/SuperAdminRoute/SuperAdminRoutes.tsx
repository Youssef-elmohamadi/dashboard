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
