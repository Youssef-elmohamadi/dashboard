import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "ar"],
    detection: {
      order: ["localStorage", "htmlTag", "cookie", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    ns: [
      "auth",
      "BreadCrump",
      "EndUserProductModal",
      "EndUserCheckout",
      "Status",
      "EndUserCart",
      "EndUserShop",
      "AddedToCartModel",
      "EndUserProductDetails",
      "SignErrors",
      "EndUserOrderHistory",
      "EndUserFooter",
      "EndUserEndUserControlMenu",
      "ServerErrors",
      "EndUserSignUp",
      "EndUserSignUpErrors",
      "EndUserSignIn",
      "EndUserFavProducts",
      "DashboardSidebar",
      "UserDropdown",
      "Header",
      "Home",
      "MonthlySalesChart",
      "RecentOrders",
      "SearchTables",
      "AdminsTable", //✔
      "BreadCrumpTables",
      "ColmunsAdmin",
      "PaginationDashboardTables",
      "AdminsTablesActions", //✔
      "RolesTable",
      "CreateRole",
      "productsTable",
      "CreateProduct",
      "ProductDetails",
      "CategoriesTable",
      "OrdersTable",
      "OrderDetails",
      "CouponsTable",
      "CreateCoupon",
      "UpdateCoupon",
      "CouponDetails",
      "CreateCategory",
      "CategoryDetails",
      "BrandsTable",
      "BrandDetails",
      "CreateBrand",
      "UpdateBrand",
      "UpdateVendor",
      "BannersTable", //✔
      "BannerDetails", //✔
      "CreateBanner", //✔
      "UpdateBanner",
      "ImageUpload",
      "VendorsTable",
      "CreateVendor",
      "VendorDetails",
      "UsersTable",
      "CreateUser",
      "UserDetails",
      "DateFilter",
      "TopSellingTable",
      "OrdersReport",
      "ProductsReports",
      "UserProfile",
      "UpdateCategory",
      "EndUserProfile",
      "EndUserHeader",
      "EndUserBottomNav",
      "EndUserHeader",
      "EndUserProductCard",
      "Terms",
      "SupportPolicy",
      "ReturnPolicy",
      "PrivacyPolicy",
    ],

    defaultNS: "Signup",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
