import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const ordersReport = async () => {
  return await axiosJson.get("api/vendor/reports/orders");
};

export { ordersReport };
