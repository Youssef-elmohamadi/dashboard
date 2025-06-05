import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addToFavorite,
  getFavoriteProducts,
  removeFromFavorite,
} from "../../../../api/EndUserApi/ensUserProducts/_requests";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useAllFavoriteProducts = () => {
  return useInfiniteQuery({
    queryKey: ["endUserFavoriteProducts"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getFavoriteProducts({ page: pageParam });
      return response.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,
    staleTime: 1000 * 60 * 5,
  });
};

const updateAllCaches = (
  queryClient: any,
  productId: string,
  isFav: boolean
) => {
  // homePage
  queryClient.setQueryData(["homePage"], (old: any) => {
    if (!old) return old;
    return {
      ...old,
      leatestProducts: old.leatestProducts?.map((p: any) =>
        p.id === productId ? { ...p, is_fav: isFav } : p
      ),
    };
  });

  // product-categories
  queryClient.setQueryData(["product-categories"], (old: any) => {
    if (!old) return old;
    return old.map((cat: any) => ({
      ...cat,
      products: cat.products?.map((p: any) =>
        p.id === productId ? { ...p, is_fav: isFav } : p
      ),
    }));
  });

  // endUserProducts
  queryClient.setQueriesData({ queryKey: ["endUserProducts"] }, (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages?.map((page: any) => ({
        ...page,
        data: page.data?.map((p: any) =>
          p.id === productId ? { ...p, is_fav: isFav } : p
        ),
      })),
    };
  });

  // endUserAllProducts
  queryClient.setQueriesData(
    { queryKey: ["endUserAllProducts"] },
    (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages?.map((page: any) => ({
          ...page,
          data: page.data?.map((p: any) =>
            p.id === productId ? { ...p, is_fav: isFav } : p
          ),
        })),
      };
    }
  );
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => await addToFavorite(productId),
    onSuccess: (_, productId) => {
      updateAllCaches(queryClient, productId, true);
      queryClient.invalidateQueries({ queryKey: ["endUserFavoriteProducts"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) =>
      await removeFromFavorite(productId),
    onSuccess: (_, productId) => {
      updateAllCaches(queryClient, productId, false);
      queryClient.invalidateQueries({ queryKey: ["endUserFavoriteProducts"] });
    },
  });
};

// export const useFavoriteProducts = (productId: string) => {
//   const queryClient = useQueryClient();
//   const { t } = useTranslation(["EndUserProductCard"]);

//   const updateQueries = (isFav: boolean) => {
//     // homePage
//     queryClient.setQueryData(["homePage"], (old: any) => {
//       if (!old) return old;
//       return {
//         ...old,
//         leatestProducts: old.leatestProducts.map((p: any) =>
//           p.id === productId ? { ...p, is_fav: isFav } : p
//         ),
//       };
//     });

//     // product-categories
//     queryClient.setQueryData(["product-categories"], (old: any) => {
//       if (!old) return old;
//       return old.map((cat: any) => ({
//         ...cat,
//         products: cat.products.map((p: any) =>
//           p.id === productId ? { ...p, is_fav: isFav } : p
//         ),
//       }));
//     });

//     // endUserProducts
//     queryClient.setQueriesData(
//       { queryKey: ["endUserProducts"] },
//       (old: any) => {
//         if (!old) return old;
//         return {
//           ...old,
//           pages: old.pages.map((page: any) => ({
//             ...page,
//             data: page.data.map((p: any) =>
//               p.id === productId ? { ...p, is_fav: isFav } : p
//             ),
//           })),
//         };
//       }
//     );

//     // endUserAllProducts
//     queryClient.setQueriesData(
//       { queryKey: ["endUserAllProducts"] },
//       (old: any) => {
//         if (!old) return old;
//         return {
//           ...old,
//           pages: old.pages.map((page: any) => ({
//             ...page,
//             data: page.data.map((p: any) =>
//               p.id === productId ? { ...p, is_fav: isFav } : p
//             ),
//           })),
//         };
//       }
//     );
//   };

//   const addMutation = useMutation({
//     mutationFn: () => addToFavorite(productId),
//     onSuccess: () => {
//       updateQueries(true);
//       toast.success(t("successAddedToFav"));
//     },
//     onError: (error: any) => {
//       if (error?.response?.status === 401) {
//         toast.error(t("noAuth"));
//       } else {
//         toast.error(t("fieldAddedToFav"));
//       }
//     },
//   });

//   const removeMutation = useMutation({
//     mutationFn: () => removeFromFavorite(productId),
//     onSuccess: () => {
//       updateQueries(false);
//       toast.success(t("successRemoveFromFav"));
//     },
//     onError: (error: any) => {
//       if (error?.response?.status === 401) {
//         toast.error(t("noAuth"));
//       } else {
//         toast.error(t("fieldRemoveFromFav"));
//       }
//     },
//   });

//   return {
//     addToFavorite: () => addMutation.mutate(),
//     removeFromFavorite: () => removeMutation.mutate(),
//     isAdding: addMutation.isLoading,
//     isRemoving: removeMutation.isLoading,
//   };
// };
