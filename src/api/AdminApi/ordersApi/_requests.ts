import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";
export const getOrdersWithPaginate = async (params: {
  page?: number;
  status?: string;
  shipping_status?: string;
  tracking_number?: string;
  from_date?: string;
  to_date?: string;
}) => {
  return await axiosJson.get("/api/vendor/orders/withPaginate", {
    params,
  });
};
export const getOrderById = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/orders/${id}`);
};
export const shipmentOrder = async (data: any, id: number | string) => {
  return await axiosJson.post(`/api/vendor/orders/ship/${id}`, data);
};

export const cancelOrder = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/orders/cancel/${id}`);
};
