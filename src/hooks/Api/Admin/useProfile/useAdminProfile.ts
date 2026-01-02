import {
  getAdminUser,
  updateAdminUserData,
} from "./../../../../api/AdminApi/profileApi/_requests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAdminUser = (
  id: number | string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["adminUser", id],
    queryFn: () => getAdminUser(id),
    enabled: !!id && options?.enabled,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminUserData,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUser", variables.id] });
    },
  });
};
