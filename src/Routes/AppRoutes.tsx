import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const LazyToastContainer = lazy(() =>
  import("react-toastify").then((module) => ({
    default: module.ToastContainer,
  }))
);

import EndUserRoutes from "./EndUserRoute/EndUserRoute";
// const LazyEndUserRoutes = lazy(() => import("./EndUserRoute/EndUserRoute"));
const LazyAdminRoutes = lazy(() => import("./AdminRoute/AdminRoute"));
const LazySuperAdminRoutes = lazy(
  () => import("./SuperAdminRoute/SuperAdminRoutes")
);
const NotFound = lazy(() => import("../pages/AdminPages/OtherPage/NotFound"));

export default function AppRoutes() {
  return (
    <>
      <Suspense fallback={null}>
        <LazyToastContainer
          position="top-center"
          autoClose={3000}
          className="custom-toast-container"
        />
      </Suspense>
      <Routes>
        {/* End User Routes - Base path can be "/" or specific to lang */}
        <Route
          path="/*" // This will match any path not caught by admin/super_admin
          element={
            // <Suspense fallback={null}>
            //   <LazyEndUserRoutes />
            // </Suspense>
            <EndUserRoutes />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*" // All admin routes will start with /admin
          element={
            <Suspense fallback={null}>
              <LazyAdminRoutes />
            </Suspense>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/super_admin/*" // All super admin routes will start with /super_admin
          element={
            <Suspense fallback={null}>
              <LazySuperAdminRoutes />
            </Suspense>
          }
        />

        {/* 404 Not Found Route - Catches anything not matched above */}
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
