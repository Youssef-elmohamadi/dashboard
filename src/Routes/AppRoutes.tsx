import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "./AdminRoute/AdminRoute";
import NotFound from "../pages/AdminPages/OtherPage/NotFound";
import { AdminProvider } from "../context/AdminContext";
import { EndUserRoutes } from "./EndUserRoute/EndUserRoute";

export default function AppRoutes() {
  return (
      <Routes>
        {adminRoutes}
        {EndUserRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}
