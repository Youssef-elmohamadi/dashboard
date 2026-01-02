import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const productsReport = async ({ params }: any) => {
  return await axiosJson.get("api/vendor/reports/products", { params });
};

export { productsReport };
