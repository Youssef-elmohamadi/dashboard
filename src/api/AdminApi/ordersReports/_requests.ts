import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const ordersReport = async (params: {
  page?: number;
  status?: string;
  shipping_status?: string;
  tracking_number?: string;
  from_date?: string;
  to_date?: string;
}) => {
  return await axiosJson.get("api/vendor/reports/orders", { params });
};

export { ordersReport };
