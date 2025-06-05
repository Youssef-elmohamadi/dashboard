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
import { AxiosError } from "axios";

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
};
interface Notification {
  id: number;
  data_id: number | string;
  created_at: string;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
}
export const useNotifications = () => {
  return useInfiniteQuery<PaginatedResponse<Notification>, Error>({
    queryKey: ["adminNotifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllNotifications(pageParam);
      return response.data.data;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
    keepPreviousData: true,
    onError: (error: AxiosError) => {
      console.error("Error fetching notifications:", error);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined;
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
