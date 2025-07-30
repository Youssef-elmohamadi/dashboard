import axios from "axios";
import { Token } from "./_modales";

const SuperAdminAxiosInstanceJson = axios.create({
  baseURL: "https://tashtiba.com",
  headers: {
    "Content-Type": "application/json",
  },
});

SuperAdminAxiosInstanceJson.interceptors.request.use(
  (config) => {
    const token: Token = localStorage.getItem("super_admin_token");
    console.log("SuperAdmin Token:", token); // Log the token for debugging
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
