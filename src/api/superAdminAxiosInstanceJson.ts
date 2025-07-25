import axios from "axios";
import { Token } from "./_modales";

const SuperAdminAxiosInstanceJson = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

SuperAdminAxiosInstanceJson.interceptors.request.use(
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

export default SuperAdminAxiosInstanceJson;
