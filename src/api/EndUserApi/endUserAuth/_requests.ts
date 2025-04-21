import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const login = async (email: string, password: string) => {
  return await axiosJson.post("/api/user/login", { email, password });
};

const register = async (formData: {}) => {
  return await axiosJson.post("/api/user/register", formData);
};

const logout = async () => {
  return await axiosJson.post("/api/user/logout");
};

export { login, register, logout };
