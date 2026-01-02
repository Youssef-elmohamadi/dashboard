import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingPage from "../components/ui/loading-screen";
const LazyToastContainer = lazy(async () => {
  await import("react-toastify/dist/ReactToastify.css");
  const module = await import("react-toastify");
  return { default: module.ToastContainer };
});
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
            <Suspense fallback={<LoadingPage />}>
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
