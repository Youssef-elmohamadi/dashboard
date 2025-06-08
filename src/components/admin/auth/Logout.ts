import { logout } from "../../../api/AdminApi/authApi/_requests";

export const handleLogout = () => {
  localStorage.removeItem("aToken");
  localStorage.removeItem("aRole");
  localStorage.removeItem("userId");
  try {
    logout();
    window.location.href = "/admin/signin";
  } catch (error) {
    console.error(error);
  }
};
