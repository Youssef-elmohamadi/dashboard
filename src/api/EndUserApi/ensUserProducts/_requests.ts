import axiosForm from "../../axiosInstanceFormData";
import axiosInstanceEndUser from "../../userAxiosInstanceEndUser";

export const getProductCategories = async () => {
  return await axiosInstanceEndUser.get(
    "/api/user/products/productCategories",
    {
      cache: {
        ttl: 1000 * 60 * 5,
        interpretHeader: false,
      },
    }
  );
};
export const showProduct = async (id) => {
  return await axiosInstanceEndUser.get(`/api/user/products/${id}`);
};
export const getAllProducts = async (params: Record<string, any> = {}) => {
  return await axiosInstanceEndUser.get("/api/user/products", {
    params,
  });
};
export const getFavoriteProducts = async (params: Record<string, any> = {}) => {
  return await axiosInstanceEndUser.get("/api/user/products/getFavProducts", {
    params,
  });
};

export const getProductCategoriesById = async (
  params: Record<string, any> = {}
) => {
  return await axiosInstanceEndUser.get(`/api/user/products`, {
    cache: {
      ttl: 1000 * 60 * 5,
      interpretHeader: false,
    },
    params,
  });
};

export const applyCoupon = async (data) => {
  return await axiosInstanceEndUser.post("/api/user/cupons/apply", data);
};

export const checkout = async (data: any) => {
  return await axiosInstanceEndUser.post("/api/user/orders/checkout", data);
};
export const addToFavorite = async (productId: any) => {
  return await axiosInstanceEndUser.get("/api/user/products/addToFav", {
    params: {
      product_id: productId,
    },
  });
};
export const removeFromFavorite = async (productId: any) => {
  return await axiosInstanceEndUser.get("/api/user/products/removeFromFav", {
    params: {
      product_id: productId,
    },
  });
};

export const reviewProduct = async (data: any) => {
  return await axiosForm.post("/api/user/products/rate", data);
};
