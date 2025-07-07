import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteNotification,
  getAllNotifications,
  markAllAsRead,
  markAsRead,
} from "../../../../api/SuperAdminApi/notifcationsApi/_requests";
import {
  PaginationData,
} from "../../../../types/Notification";

export const useSuperAdminNotifications = () => {
  return useInfiniteQuery<PaginationData>({
    queryKey: ["superAdminNotifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllNotifications(Number(pageParam));
      return response.data;
    },
    initialPageParam: 1,
    staleTime: 2000 * 60,
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined;
    },
  });
};

export const useSuperAdminDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
export const useSuperAdminMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useSuperAdminMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
