import axiosJson from "../../axiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const home = async () => {
  return await axiosJson.get("/api/vendor/home");
};

export { home };
