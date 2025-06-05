import axiosForm from "../../superAdminAxiosInstanceFormData";
import axiosJson from "../../superAdminAxiosInstanceJson";
export const getCouponsWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await axiosJson.get("/api/superAdmin/cupons/withPaginate", {
    params,
  });
};

export const deleteCoupon = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/cupons/${id}`);
};

export const showCoupon = async (id: number | string) => {
  return await axiosJson.get(`/api/superAdmin/cupons/${id}`);
};

export const createCoupon = async (couponData: any) => {
  return await axiosJson.post(`/api/superAdmin/cupons`, couponData);
};
export const updateCoupon = async (id: number | string, couponData: any) => {
  return await axiosJson.post(`/api/superAdmin/cupons/${id}`, couponData);
};
