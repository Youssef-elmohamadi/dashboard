import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransportationPrice,
  deleteTransportationPrice,
  getTransportationPricesPaginate,
  getTransportationPriceById,
  updateTransportationPrice,
} from "../../../../api/SuperAdminApi/Transports/_requests";
import { PaginatedTransport, Transport } from "../../../../types/transports";

// export const useAllTransportationPrices = () => {
//   return useQuery<AllCategoriesData>({
//     queryKey: ["superAdminTransportationPrices", "all"],
//     queryFn: async () => {
//       const response = await getAllTransportationPrices();
//       return response.data.data;
//     },
//     staleTime: 1000 * 60 * 20,
//   });
// };

export const useGetTransportationPrices = (page: number) => {
  return useQuery<PaginatedTransport>({
    queryKey: ["superAdminTransportationPrices", page],
    queryFn: async () => {
      const response = await getTransportationPricesPaginate({
        page: page + 1,
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetTransportationPriceById = (id?: number | string) => {
  return useQuery<Transport>({
    queryKey: ["superAdminTransportationPrices", id],
    queryFn: async () => {
      const response = await getTransportationPriceById(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useDeleteTransportationPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await deleteTransportationPrice(id);
        console.error("deleteTransportationPrice response", res); // 👈 تحقق من هذا
      return res;
    },
    onSuccess: (_, variables) => {
      const id = variables;
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices"] });
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices", id] });
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateTransportationPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (transportData: FormData) => {
      return await createTransportationPrice(transportData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices"] });
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateransportationPrice = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      transportData,
      id,
    }: {
      transportData: FormData;
      id: string;
    }) => {
      return await updateTransportationPrice(transportData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices"] });
      queryClient.invalidateQueries({ queryKey: ["superAdminTransportationPrices", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
