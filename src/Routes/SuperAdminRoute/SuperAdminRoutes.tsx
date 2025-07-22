import { Routes, Route } from "react-router-dom";
import SuperAdminLayout from "../../pages/SuperAdminPages/Layout/SuperAdminLayout";
import ProtectedSuperAdminRoute from "./ProtectedSuperAdminRoute";
import { lazy, Suspense } from "react";
const SuperAdminSignIn = lazy(
  () => import("../../pages/SuperAdminPages/AuthPages/SuperAdminSignin")
);
const SuperAdminForgotPassword = lazy(
  () => import("../../pages/SuperAdminPages/AuthPages/UserForgotPassword")
);
import Home from "../../pages/AdminPages/Dashboard/Home";
import LazyPages from "./LazyPages";
const ScrollToTop = lazy(() => import("../../components/common/ScrollToTop"));

const SuperAdminRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          element={
            <ProtectedSuperAdminRoute>
              <SuperAdminLayout />
            </ProtectedSuperAdminRoute>
          }
        >
          <Route index element={<Home userType="super_admin" />} />
          <Route
            path="*" // Matches /super_admin/* other than index
            element={
              <Suspense fallback={null}>
                <LazyPages />
              </Suspense>
            }
          />
        </Route>

        {/* Auth Routes - Relative to the root if they don't have the layout.
          These paths will be /super_admin/signin, etc. */}
        <Route
          path="signin" // Full path will be /super_admin/signin
          element={
            <Suspense fallback={null}>
              <SuperAdminSignIn />
            </Suspense>
          }
        />
        <Route
          path="reset-password" // Full path will be /super_admin/reset-password
          element={
            <Suspense fallback={null}>
              <SuperAdminForgotPassword />
            </Suspense>
          }
        />
      </Routes>
      <ScrollToTop />
    </>
  );
};

export default SuperAdminRoutes;
