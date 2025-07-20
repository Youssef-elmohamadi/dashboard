import axios from "axios";
import { Token } from "./_modales";

const axiosInstanceFormData = axios.create({
  baseURL: "http://jht.535.mytemp.website",
  headers: {
    "Content-Type": "multipart/form-data", // لاستخدام FormData كـ content-type
  },
});

axiosInstanceFormData.interceptors.request.use(
  (config) => {
    const token: Token = localStorage.getItem("end_user_token");
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
