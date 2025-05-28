import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const AdminHomeData = async () => {
  return await axiosJson.get("/api/vendor/home");
};

export { AdminHomeData };
