import axiosForm from "../axiosInstanceFormData";
import axiosJson from "../axiosInstanceJson";
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
