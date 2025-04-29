import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoute/AdminRoute";
import NotFound from "../pages/AdminPages/OtherPage/NotFound";
import { EndUserRoutes } from "./EndUserRoute/EndUserRoute";
import { SuperAdminRoutes } from "./SuperAdminRoute/SuperAdminRoutes";

export default function AppRoutes() {
  return (
      <Routes>
        {adminRoutes}
        {EndUserRoutes}
        {SuperAdminRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}
