import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../userAxiosInstanceEndUser";
export const getOrdersWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await axiosJson.get("/api/user/orders/withPaginate", {
    params,
  });
};
export const getOrderById = async (id) => {
  return await axiosJson.get(`/api/user/orders/${id}`);
};
export const cancelOrder = async (id) => {
  return await axiosJson.get(`/api/user/orders/cancel/${id}`);
};
