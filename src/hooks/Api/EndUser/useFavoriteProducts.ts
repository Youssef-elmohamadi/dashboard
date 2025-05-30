import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToFavorite,
  removeFromFavorite,
} from "../../../api/EndUserApi/ensUserProducts/_requests";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useFavoriteProducts = (productId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["EndUserProductCard"]);

  const updateQueries = (isFav: boolean) => {
    // homePage
    queryClient.setQueryData(["homePage"], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        leatestProducts: old.leatestProducts.map((p: any) =>
          p.id === productId ? { ...p, is_fav: isFav } : p
        ),
      };
    });

    // product-categories
    queryClient.setQueryData(["product-categories"], (old: any) => {
      if (!old) return old;
      return old.map((cat: any) => ({
        ...cat,
        products: cat.products.map((p: any) =>
          p.id === productId ? { ...p, is_fav: isFav } : p
        ),
      }));
    });

    // endUserProducts
    queryClient.setQueriesData({ queryKey: ["endUserProducts"] }, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((p: any) =>
            p.id === productId ? { ...p, is_fav: isFav } : p
          ),
        })),
      };
    });

    // endUserAllProducts
    queryClient.setQueriesData({ queryKey: ["endUserAllProducts"] }, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((p: any) =>
            p.id === productId ? { ...p, is_fav: isFav } : p
          ),
        })),
      };
    });
  };

  const addMutation = useMutation({
    mutationFn: () => addToFavorite(productId),
    onSuccess: () => {
      updateQueries(true);
      toast.success(t("successAddedToFav"));
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error(t("noAuth"));
      } else {
        toast.error(t("fieldAddedToFav"));
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFromFavorite(productId),
    onSuccess: () => {
      updateQueries(false);
      toast.success(t("successRemoveFromFav"));
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error(t("noAuth"));
      } else {
        toast.error(t("fieldRemoveFromFav"));
      }
    },
  });

  return {
    addToFavorite: () => addMutation.mutate(),
    removeFromFavorite: () => removeMutation.mutate(),
    isAdding: addMutation.isLoading,
    isRemoving: removeMutation.isLoading,
  };
};
