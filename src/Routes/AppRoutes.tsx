import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const LazyToastContainer = lazy(() =>
  import("react-toastify").then((module) => ({
    default: module.ToastContainer,
  }))
);
const LazyEndUserRoutes = lazy(() => import("./EndUserRoute/EndUserRoute"));
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
        <Route
          path="/*"
          element={
            <Suspense fallback={null}>
              <LazyEndUserRoutes />
            </Suspense>
          }
        />
        <Route
          path="/admin/*" 
          element={
            <Suspense fallback={null}>
              <LazyAdminRoutes />
            </Suspense>
          }
        />

        <Route
          path="/super_admin/*" 
          element={
            <Suspense fallback={null}>
              <LazySuperAdminRoutes />
            </Suspense>
          }
        />
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
