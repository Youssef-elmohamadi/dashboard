import axiosJson from "../axiosInstanceJson";
import axiosFormData from "../axiosInstanceFormData";
const login = async (email: string, password: string) => {
  return  await axiosJson.post("/api/vendor/login", { email, password });
};

const register = async (formData: {}) => {
  return await axiosFormData.post("/api/vendor/register", formData); 
};

export { login, register };
