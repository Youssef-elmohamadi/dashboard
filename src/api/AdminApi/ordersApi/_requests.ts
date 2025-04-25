import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";
export const getOrdersWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await axiosJson.get("/api/vendor/orders/withPaginate", {
    params,
  });
};
export const getOrderById = async (id) => {
  return await axiosJson.get(`/api/vendor/orders/${id}`);
};
export const shipmentOrder = async (data, id) => {
  return await axiosJson.post(`/api/vendor/orders/ship/${id}`, data);
};
