import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import {
  deleteNotification,
  getAllNotifications,
  markAllAsRead,
  markAsRead,
} from "../api/AdminApi/notifcationsApi/_requests";
import { Axios, AxiosError } from "axios";

type Notification = {
  id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: string;
  data_id: number;
  is_read: number;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
};
export const useAdminNotifications = () => {
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

export const useAdminDeleteNotification = () => {
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
export const useAdminMarkAsRead = () => {
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
