import { SidebarProvider, useSidebar } from "../../../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "../../../components/common/dashboardLayout/AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "../../../components/common/dashboardLayout/DashboardSidebar";
import { ToastContainer } from "react-toastify";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar userType="admin" />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ms-[290px]" : "lg:ms-[90px]"
        } ${isMobileOpen ? "ms-0" : ""}`}
      >
        <AppHeader userType="admin" />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        className="custom-toast-container"
      />
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
