import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoute/AdminRoute";
import NotFound from "../pages/AdminPages/OtherPage/NotFound";
import { EndUserRoutes } from "./EndUserRoute/EndUserRoute";
import { SuperAdminRoutes } from "./SuperAdminRoute/SuperAdminRoutes";
import { ToastContainer } from "react-toastify";

export default function AppRoutes() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        className="custom-toast-container"
      />
      <Routes>
        <Route>
          {adminRoutes}
          {EndUserRoutes}
          {SuperAdminRoutes}
          <Route path="*" element={<NotFound  />} />
        </Route>
      </Routes>
    </>
  );
}
