import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
} from "../../../../api/EndUserApi/endUserAuth/_requests";
export const useProfile = () => {
  const token = localStorage.getItem("end_user_token");
  return useQuery({
    queryKey: ["endUserProfileData"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!token, 
  });
};

export const useUpdateProfile = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: any) => {
      return await updateProfile(profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endUserProfileData"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
