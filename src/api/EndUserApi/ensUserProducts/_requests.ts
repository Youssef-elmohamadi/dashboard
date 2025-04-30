import axiosForm from "../../axiosInstanceFormData";
import axiosInstanceEndUser from "../../userAxiosInstanceEndUser";

export const getProductCategories = async () => {
  return await axiosInstanceEndUser.get("/api/user/products/productCategories");
};
export const showProduct = async (id) => {
  return await axiosInstanceEndUser.get(`/api/user/products/${id}`);
};
// الحصول على جميع المنتجات مع إمكانية تمرير باراميترز ديناميكيًا
export const getAllProducts = async (params: Record<string, any> = {}) => {
  return await axiosInstanceEndUser.get("/api/user/products", {
    params,
  });
};

// الحصول على المنتجات حسب التصنيف مع باراميترز ديناميكيًا
export const getProductCategoriesById = async (
  params: Record<string, any> = {}
) => {
  return await axiosInstanceEndUser.get(`/api/user/products`, {
    params,
  });
};

export const applyCoupon = async (data) => {
  return await axiosInstanceEndUser.post("/api/user/cupons/apply", data);
};

export const checkout = async (data: any) => {
  return await axiosInstanceEndUser.post("/api/user/orders/checkout", data);
};
