import axiosJson from "../../userAxiosInstanceEndUser";
import axiosFormData from "../../axiosInstanceFormData";
const login = async (email: string, password: string) => {
  return await axiosJson.post("/api/user/login", { email, password });
};
const getProfile = async () => {
  return await axiosJson.get("/api/user/profile");
};

const updateProfile = async (data) => {
  return await axiosJson.post("/api/user/profile/update", data);
};

const register = async (formData: {}) => {
  return await axiosJson.post("/api/user/register", formData);
};

const logout = async () => {
  return await axiosJson.post("/api/user/logout");
};

export { login, register, logout, getProfile, updateProfile };
