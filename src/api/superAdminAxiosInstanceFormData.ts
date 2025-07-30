import axios from "axios";
import { Token } from "./_modales";

const axiosInstanceFormData = axios.create({
  baseURL: "https://tashtiba.com",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosInstanceFormData.interceptors.request.use(
  (config) => {
    const token: Token = localStorage.getItem("super_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstanceFormData;
