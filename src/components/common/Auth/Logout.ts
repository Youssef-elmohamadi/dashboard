// common/Logout.ts
import { logout as logoutSuperAdmin } from "../../../api/SuperAdminApi/Auth/_requests";
import { logout as logoutAdmin } from "../../../api/AdminApi/authApi/_requests";
import { logout as logoutEndUser } from "../../../api/EndUserApi/endUserAuth/_requests";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
// Remove: import { useNavigate } from "react-router-dom"; // No longer needed here

type UserType = "super_admin" | "admin" | "end_user";

export const handleLogout = async (
  userType: UserType,
  navigate: (path: string) => void // Add navigate as a parameter
) => {
  const { lang } = useDirectionAndLanguage();
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
      navigate(`/${lang}/signin`);
    }
  } catch (error) {
    console.error("Logout error:", error);
    // It's often good practice to still redirect on client-side logout even if API call fails,
    // to ensure the UI reflects a logged-out state.
    if (userType === "super_admin") {
      navigate("/super_admin/signin");
    } else if (userType === "admin") {
      navigate("/admin/signin");
    } else if (userType === "end_user") {
      navigate(`/${lang}/signin`);
    }
  }
};
