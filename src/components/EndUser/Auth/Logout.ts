import { logout } from "../../../api/EndUserApi/endUserAuth/_requests";
import { useNavigate } from "react-router-dom";
export const handleLogout = () => {
  const navigate = useNavigate();
  localStorage.removeItem("uToken");
  localStorage.removeItem("uId");
  try {
    logout();
    navigate("/signin");
  } catch (error) {
    console.log(error);
  }
};
