import { logout } from "../../../api/AdminApi/authApi/_requests";

export const handleLogout = () => {
  localStorage.removeItem("super_admin_token");
  localStorage.removeItem("super_admin_id");
  try {
    logout();
    window.location.href = "/super_admin/signin";
  } catch (error) {
    console.error(error);
  }
};
