import { deleteAccount } from "../../../api/EndUserApi/endUserAuth/_requests";
export const handleDeleteAccount = () => {
  localStorage.removeItem("end_user_token");
  localStorage.removeItem("end_user_id");
  try {
    deleteAccount();
    window.location.href = "/";
  } catch (error) {
    console.error(error);
  }
};
