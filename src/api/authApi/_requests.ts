import axiosJson from "../axiosInstanceJson";
import axiosFormData from "../axiosInstanceFormData";
const login = async (email: string, password: string) => {
  return await axiosJson.post("/api/vendor/login", { email, password });
};

const register = async (formData: {}) => {
  return await axiosFormData.post("/api/vendor/register", formData);
};

const logout = async () => {
  return await axiosJson.post("/api/vendor/logout");
};

export { login, register, logout };
