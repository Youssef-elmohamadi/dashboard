import { logout } from "../../../api/AdminApi/authApi/_requests";

export const handleLogout = () => {
  localStorage.removeItem("sToken");
  localStorage.removeItem("sId");
  try {
    logout();
    window.location.href = "/super_admin/signin";
  } catch (error) {
    console.error(error);
  }
};
