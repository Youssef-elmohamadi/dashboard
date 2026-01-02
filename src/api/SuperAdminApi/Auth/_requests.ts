import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const login = async (email: string, password: string) => {
  return await axiosJson.post("/api/superAdmin/auth/login", {
    email,
    password,
  });
};
const logout = async () => {
  return await axiosJson.post("/api/superAdmin/auth/logout");
};

export { login, logout };
