import { Route } from "react-router-dom";
import EndUserLayout from "../../pages/UserPages/EndUserLayout/Layout"; // المسار حسب مكان الملف
import Home from "../../pages/UserPages/Home/Home"; // أنشئ صفحة Home إن ما كانتش موجودة

export const EndUserRoutes = (
  <Route element={<EndUserLayout />}>
    <Route index element={<Home />} />
    {/* ممكن تضيف صفحات تانية هنا بعدين */}
  </Route>
);
