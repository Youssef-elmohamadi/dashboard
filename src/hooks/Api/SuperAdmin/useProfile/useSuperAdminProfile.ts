import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuperAdminProfile,
  updateSuperAdminProfileData,
} from "../../../../api/SuperAdminApi/profileApi/_request";

export const useSuperAdminProfile = (
  superAdminToken: string | null,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["superAdminProfile", superAdminToken],
    queryFn: getSuperAdminProfile,
    enabled: !!superAdminToken && options?.enabled,
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
