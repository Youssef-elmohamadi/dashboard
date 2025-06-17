import { logout as logoutSuperAdmin } from "../../api/SuperAdminApi/Auth/_requests";
import { logout as logoutAdmin } from "../../api/AdminApi/authApi/_requests";
import { logout as logoutEndUser } from "../../api/EndUserApi/endUserAuth/_requests";
import { useNavigate } from "react-router-dom";
type UserType = "super_admin" | "admin" | "end_user";

export const handleLogout = async (userType: UserType) => {
  const navigate = useNavigate();
  localStorage.removeItem(`${userType}_token`);
  localStorage.removeItem(`${userType}_id`);

  try {
    switch (userType) {
      case "super_admin":
        await logoutSuperAdmin();
        break;
      case "admin":
        await logoutAdmin();
        break;
      case "end_user":
        await logoutEndUser();
        break;
      default:
        throw new Error("Unknown user type");
    }

    if (userType === "super_admin") {
      navigate("/super_admin/signin");
    } else if (userType === "admin") {
      navigate("/admin/signin");
    } else if (userType === "end_user") {
      navigate("/signin");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
