import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Articles from "../../pages/SuperAdminPages/Articles/Articles";
import CreateArticle from "../../components/SuperAdmin/ArticlesTable/CreateArticles";
import UpdateArticle from "../../components/SuperAdmin/ArticlesTable/UpdateArticle";
import ArticleDetails from "../../components/SuperAdmin/ArticlesTable/ShowDetails";
const Vendors = lazy(
  () => import("../../pages/SuperAdminPages/vendors/Vendors")
);
const VendorDetails = lazy(
  () => import("../../components/SuperAdmin/VendorsTables/ShowMore")
);
const Categories = lazy(
  () => import("../../pages/SuperAdminPages/Categories/Categories")
);
const CreateCategory = lazy(
  () => import("../../components/SuperAdmin/CategoriesTable/CreateCategory")
);
const UpdateCategory = lazy(
  () => import("../../components/SuperAdmin/CategoriesTable/UpdateCategory")
);
const CategoryDetails = lazy(
  () => import("../../components/SuperAdmin/CategoriesTable/ShowMore")
);
const Brands = lazy(() => import("../../pages/SuperAdminPages/Brands/Brands"));
const BrandDetails = lazy(
  () => import("../../components/SuperAdmin/Brands/ShowMore")
);
const Products = lazy(
  () => import("../../pages/SuperAdminPages/Products/Products")
);
const ProductDetails = lazy(
  () => import("../../components/SuperAdmin/Products/ShowMore")
);
const Admins = lazy(() => import("../../pages/SuperAdminPages/Users/Admis"));
const CreateAdmin = lazy(
  () => import("../../components/SuperAdmin/AdminsTable/CreateAdmin")
);
const UpdateAdmin = lazy(
  () => import("../../components/SuperAdmin/AdminsTable/UpdateAdmin")
);
const Roles = lazy(() => import("../../pages/SuperAdminPages/Users/Roles"));
const CreateRole = lazy(
  () => import("../../components/SuperAdmin/RolesTable/CreateRole")
);
const UpdateRole = lazy(
  () => import("../../components/SuperAdmin/RolesTable/UpdateRole")
);
const UserProfiles = lazy(
  () => import("../../pages/SuperAdminPages/UserProfile/UserProfiles")
);
const Banners = lazy(
  () => import("../../pages/SuperAdminPages/Banners/Banners")
);
const CreateBanner = lazy(
  () => import("../../components/SuperAdmin/BannersTable/CreateBanner")
);
const UpdateBanner = lazy(
  () => import("../../components/SuperAdmin/BannersTable/UpdateBanner")
);
const BannerDetails = lazy(
  () => import("../../components/SuperAdmin/BannersTable/BannerDetails")
);
const Coupons = lazy(
  () => import("../../pages/SuperAdminPages/Coupons/Coupons")
);
const CreateCoupon = lazy(
  () => import("../../components/SuperAdmin/couponsTable/CreateCoupon")
);
const UpdateCoupon = lazy(
  () => import("../../components/SuperAdmin/couponsTable/UpdateCoupon")
);
const CouponDetails = lazy(
  () => import("../../components/SuperAdmin/couponsTable/ShowMore")
);
const Orders = lazy(() => import("../../pages/SuperAdminPages/Orders/Orders"));
const OrderDetails = lazy(
  () => import("../../components/SuperAdmin/ordersTable/ShowMore")
);

export default function LazyPages() {
  return (
    <Suspense fallback={null}>
      <Routes>
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
        <Route path="coupons" element={<Coupons />} />
        <Route path="coupons/create" element={<CreateCoupon />} />
        <Route path="coupons/update/:id" element={<UpdateCoupon />} />
        <Route path="coupons/details/:id" element={<CouponDetails />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/details/:id" element={<OrderDetails />} />
        <Route path="banners" element={<Banners />} />
        <Route path="banners/create" element={<CreateBanner />} />
        <Route path="banners/update/:id" element={<UpdateBanner />} />
        <Route path="banners/details/:id" element={<BannerDetails />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/create" element={<CreateArticle />} />
        <Route path="articles/update/:id" element={<UpdateArticle />} />
        <Route path="articles/details/:id" element={<ArticleDetails />} />
        <Route path="profile" element={<UserProfiles />} />

      </Routes>
    </Suspense>
  );
}
