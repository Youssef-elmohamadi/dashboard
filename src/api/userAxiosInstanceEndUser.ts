import axios from "axios";
import { Token } from "./_modales";
import { setupCache } from "axios-cache-interceptor";
const axiosInstanceEndUser = setupCache(
  axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
      "Content-Type": "application/json",
    },
  })
);

axiosInstanceEndUser.interceptors.request.use(
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

export default axiosInstanceEndUser;
