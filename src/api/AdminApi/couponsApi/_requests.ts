import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";
export const getCouponsWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await axiosJson.get("/api/vendor/cupons/withPaginate", {
    params,
  });
};

export const deleteCoupon = async (id: number | string) => {
  return await axiosJson.delete(`/api/vendor/cupons/${id}`);
};

export const showCoupon = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/cupons/${id}`);
};

export const createCoupon = async (couponData: any) => {
  return await axiosForm.post(`/api/vendor/cupons`, couponData);
};
export const updateCoupon = async (id, couponData: any) => {
  return await axiosForm.post(`/api/vendor/cupons/${id}`, couponData);
};
