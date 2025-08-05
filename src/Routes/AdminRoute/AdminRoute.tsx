import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../pages/AdminPages/layout/AdminLayout";
import Home from "../../pages/AdminPages/Dashboard/Home";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { lazy, Suspense } from "react";
import LazyPages from "./LazyPages";
import "../../index.css";
const AdminSignIn = lazy(
  () => import("../../pages/AdminPages/AuthPages/AdminSignIn")
);
const AdminSignUp = lazy(
  () => import("../../pages/AdminPages/AuthPages/AdminSignUp")
);
const AdminForgotPassword = lazy(
  () => import("../../pages/AdminPages/AuthPages/AdminForgotPassword")
);
const ScrollToTop = lazy(() => import("../../components/common/ScrollToTop"));

const AdminRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Home userType="admin" />} />
          <Route
            path="*" // Matches /admin/* other than index
            element={
              <Suspense fallback={null}>
                <LazyPages />
              </Suspense>
            }
          />
        </Route>

        {/* Auth Routes - Relative to the root (not /admin) if they don't have the layout.
          However, these paths will be /admin/signin, etc., because they are nested under /admin/* in AppRoutes.
          So, here they are defined correctly. */}
        <Route
          path="signin" // Full path will be /admin/signin
          element={
            <Suspense fallback={null}>
              <AdminSignIn />
            </Suspense>
          }
        />
        <Route
          path="signup" // Full path will be /admin/signup
          element={
            <Suspense fallback={null}>
              <AdminSignUp />
            </Suspense>
          }
        />
        <Route
          path="reset-password" // Full path will be /admin/reset-password
          element={
            <Suspense fallback={null}>
              <AdminForgotPassword />
            </Suspense>
          }
        />
      </Routes>
      <ScrollToTop />
    </>
  );
};

export default AdminRoutes;
