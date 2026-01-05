import axios from "axios";
import { setupCache } from "axios-cache-interceptor";
const axiosInstanceEndUser = setupCache(
  axios.create({
    baseURL: "https://tashtiba.com",
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
import { Token } from "../../_modales";
export const createRequestQuotation = async (data: any) => {
  return await axiosInstanceEndUser.post(`/api/user/rfq`, data);
};