import { logout } from "../../../api/EndUserApi/endUserAuth/_requests";
import { useNavigate } from "react-router-dom";
export const handleLogout = () => {
  localStorage.removeItem("uToken");
  localStorage.removeItem("uId");
  try {
    logout();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
};
