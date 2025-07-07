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
} from "../../../../api/AdminApi/notifcationsApi/_requests";
import {PaginationData } from "../../../../types/Notification";
export const useAdminNotifications = () => {
  return useInfiniteQuery<PaginationData>({
    queryKey: ["adminNotifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllNotifications(Number(pageParam));
      return response.data.data;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined;
    },
  });
};

export const useAdminDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number  | string) => {
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
export const useAdminMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number| string) => {
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

export const useAdminMarkAllNotificationsAsRead = () => {
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
