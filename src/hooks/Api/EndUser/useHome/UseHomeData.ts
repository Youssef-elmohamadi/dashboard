import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../../../api/EndUserApi/endUserCategories/_requests";
import { getHome } from "../../../../api/EndUserApi/HomeApi/_requests";
import { getProductCategories } from "../../../../api/EndUserApi/ensUserProducts/_requests";
import { CategoryWithProductsType, HomeDataType } from "../../../../types/Home";
import { Category } from "../../../../types/Categories";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getAllCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useHomeData = () => {
  return useQuery<HomeDataType>({
    queryKey: ["homePage"],
    queryFn: async () => {
      const res = await getHome();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductForEveryCategory = () => {
  return useQuery<CategoryWithProductsType[]>({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const res = await getProductCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
