import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../../../api/EndUserApi/endUserCategories/_requests";
import { getHome } from "../../../../api/EndUserApi/HomeApi/_requests";
import { getProductCategories } from "../../../../api/EndUserApi/ensUserProducts/_requests";
import { CategoryWithProductsType, HomeDataType } from "../../../../types/Home";
import { Category } from "../../../../types/Categories";
import { getAllBrands } from "../../../../api/EndUserApi/endUserBrands/requests";

export const useCategories = (parentValue?: string) => {
  return useQuery<Category[]>({
    queryKey: ["categories", parentValue], 
    
    queryFn: async () => {
      const res = await getAllCategories(parentValue);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, 
    // enabled: !!parentValue 
  });
};
export const useBrands = () => {
  return useQuery<Category[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await getAllBrands();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useHomeData = () => {
  return useQuery<HomeDataType>({
    queryKey: ["homePage"],
    queryFn: async () => {
      const res = await getHome();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useProductForEveryCategory = () => {
  return useQuery<CategoryWithProductsType[]>({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const res = await getProductCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};
