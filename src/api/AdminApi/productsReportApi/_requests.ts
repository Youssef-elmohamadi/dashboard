import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const productsReport = async () => {
  return await axiosJson.get("api/vendor/reports/products");
};

export { productsReport };
