import { Route } from "react-router-dom";
import SuperAdminLayout from "../../pages/SuperAdminPages/Layout/SuperAdminLayout";
export const SuperAdminRoutes = (
  <>
    <Route path="/super_admin" element={<SuperAdminLayout />}></Route>
  </>
);
