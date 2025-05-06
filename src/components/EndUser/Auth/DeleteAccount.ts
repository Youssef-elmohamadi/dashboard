import { deleteAccount } from "../../../api/EndUserApi/endUserAuth/_requests";
export const handleDeleteAccount = () => {
  localStorage.removeItem("uToken");
  localStorage.removeItem("uId");
  try {
    deleteAccount();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
};
