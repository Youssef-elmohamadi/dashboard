import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVendor,
  updateVendor,
} from "../../../../api/AdminApi/VendorSettingApi/_requests";

export const useVendorData = () => {
  return useQuery({
    queryKey: ["vendor"],
    queryFn: async () => {
      return await getVendor();
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vendorData: any) => {
      return await updateVendor(vendorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
