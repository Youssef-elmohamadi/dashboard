import { applyCo } from "./_requests";
import axiosForm from "../../axiosInstanceFormData";
import axiosInstanceEndUser from "../../userAxiosInstanceEndUser";

export const getProductCategories = async () => {
  return await axiosInstanceEndUser.get("/api/user/products/productCategories");
};
export const showProduct = async (id) => {
  return await axiosInstanceEndUser.get(`/api/user/products/${id}`);
};
export const getProductCategoriesById = async (id, page = 1) => {
  return await axiosInstanceEndUser.get("/api/user/products", {
    params: {
      category_id: id,
      page,
    },
  });
};
export const getAllProducts = async (page = 1) => {
  return await axiosInstanceEndUser.get("/api/user/products", {
    params: {
      page,
    },
  });
};
export const applyCoupon = async (data) => {
  return await axiosInstanceEndUser.post("/api/user/cupons/apply", data);
};

export const checkout = async (data: any) => {
  return await axiosInstanceEndUser.post("/api/user/orders/checkout", data);
};
