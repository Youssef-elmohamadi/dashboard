import { logout } from "../../../api/EndUserApi/endUserAuth/_requests";
import { useNavigate } from "react-router-dom";
export const handleLogout = () => {
  localStorage.removeItem("end_user_token");
  localStorage.removeItem("end_user_id");
  try {
    logout();
    window.location.href = "/";
  } catch (error) {
    console.error(error);
  }
};
