import { lazy, Suspense } from "react"; // استورد lazy و Suspense
import { Route, Routes } from "react-router-dom";
const UserProfiles = lazy(
  () => import("../../pages/AdminPages/UserProfile/UserProfiles")
);
const Admins = lazy(() => import("../../pages/AdminPages/Users/Admins"));
const CreateAdmin = lazy(
  () => import("../../components/admin/usersTable/CreateAdmin")
);
const UpdateAdmin1 = lazy(
  () => import("../../components/admin/usersTable/UpdateAdmin1")
);
const Roles = lazy(() => import("../../pages/AdminPages/Roles/Roles"));
const CreateRole = lazy(
  () => import("../../components/admin/RolesTable/CreateRole")
);
const UpdateRole = lazy(
  () => import("../../components/admin/RolesTable/UpdateRole")
);
const Categories = lazy(
  () => import("../../pages/AdminPages/Categories/Categories")
);
const Brands = lazy(() => import("../../pages/AdminPages/Brands/Brands"));
const CreateBrand = lazy(
  () => import("../../components/admin/brandsTable/CreateBrand")
);
const UpdateBrand = lazy(
  () => import("../../components/admin/brandsTable/UpdateBrand")
);
const Products = lazy(() => import("../../pages/AdminPages/Products/Products"));
const CreateProducts = lazy(
  () => import("../../components/admin/Products/CreateProducts")
);
const UpdateProduct = lazy(
  () => import("../../components/admin/Products/UpdateProduct")
);
const ProductDetails = lazy(
  () => import("../../components/admin/Products/ShowMore")
);
const OrderDetails = lazy(
  () => import("../../components/admin/ordersTable/ShowMore")
);
const OrdersReports = lazy(
  () => import("../../pages/AdminPages/Orders Report/OrdersReports")
);
const ProductReports = lazy(
  () => import("../../pages/AdminPages/Products Report/ProductReports")
);
const Orders = lazy(() => import("../../pages/AdminPages/Orders/Orders"));
const VendorSettings = lazy(
  () => import("../../pages/AdminPages/VendorSettings/VendorSettings")
);
const ProductQuestions = lazy(
  () => import("../../pages/AdminPages/Questions/Question")
);
const CreateProductQuestion = lazy(
  () => import("../../components/admin/questions/createQuestion")
);
const UpdateProductQuestion = lazy(
  () => import("../../components/admin/questions/updateQuestion")
);

const QuestionDetails = lazy(
  () => import("../../components/admin/questions/questionDetails")
);

export default function LazyPages() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="admins" element={<Admins />} />
        <Route path="admins/create" element={<CreateAdmin />} />
        <Route path="admins/update/:id" element={<UpdateAdmin1 />} />
        <Route path="roles" element={<Roles />} />
        <Route path="roles/create" element={<CreateRole />} />
        <Route path="roles/update/:id" element={<UpdateRole />} />
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<CreateProducts />} />
        <Route path="products/update/:id" element={<UpdateProduct />} />
        <Route path="products/details/:id" element={<ProductDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/details/:id" element={<OrderDetails />} />
        <Route path="brands" element={<Brands />} />
        <Route path="brands/create" element={<CreateBrand />} />
        <Route path="brands/update/:id" element={<UpdateBrand />} />
        <Route path="orders_report" element={<OrdersReports />} />
        <Route path="products_report" element={<ProductReports />} />
        <Route path="settings" element={<VendorSettings />} />
        <Route path="profile" element={<UserProfiles />} />
        <Route path="product_questions" element={<ProductQuestions />} />
        <Route
          path="product_questions/create"
          element={<CreateProductQuestion />}
        />
        <Route
          path="product_questions/update/:id"
          element={<UpdateProductQuestion />}
        />
        <Route
          path="product_questions/details/:id"
          element={<QuestionDetails />}
        />
      </Routes>
    </Suspense>
  );
}
