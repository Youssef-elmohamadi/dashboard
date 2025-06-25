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
} from "../../../../api/EndUserApi/endUserNotifications/_requests";
import { NotificationResponse } from "../../../../types/Notification";

export const useNotifications = () => {
  return useInfiniteQuery<NotificationResponse, Error>({
    queryKey: ["adminNotifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllNotifications(Number(pageParam));
      return response.data;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
    getNextPageParam: (lastPage) => {
      return lastPage.data.length > 0 ? lastPage.data.length + 1 : undefined;
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
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

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
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

export const useMarkAllNotificationsAsRead = () => {
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
