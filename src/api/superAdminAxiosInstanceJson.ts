import axios from "axios";
import { Token } from "./_modales";

const SuperAdminAxiosInstanceJson = axios.create({
  baseURL: "http://jht.535.mytemp.website",
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
