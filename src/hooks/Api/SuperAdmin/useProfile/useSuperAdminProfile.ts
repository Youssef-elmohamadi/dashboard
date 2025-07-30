import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuperAdminProfile,
  updateSuperAdminProfileData,
} from "../../../../api/SuperAdminApi/profileApi/_request";

export const useSuperAdminProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["superAdminProfile"],
    queryFn: getSuperAdminProfile,
    enabled,
  });
};

export const useUpdateSuperAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSuperAdminProfileData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminProfile"] });
    },
  });
};
