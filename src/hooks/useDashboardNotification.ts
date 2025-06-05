// hooks/useNotifications.ts
import {
  useAdminNotifications,
  useAdminDeleteNotification,
  useAdminMarkAllNotificationsAsRead,
  useAdminMarkAsRead,
} from "./Api/Admin/useNotifications/useAdminNotification";
import {
  useSuperAdminNotifications,
  useSuperAdminDeleteNotification,
  useSuperAdminMarkAllNotificationsAsRead,
  useSuperAdminMarkAsRead,
} from "./Api/SuperAdmin/useNotification/useSuperAdminNotification";

export function useNotifications(userType: "admin" | "superAdmin") {
  if (userType === "admin") {
    const {
      data,
      hasNextPage,
      fetchNextPage,
      isFetching,
      isLoading,
    } = useAdminNotifications();
    const { mutateAsync: deleteNotification } = useAdminDeleteNotification();
    const { mutateAsync: markAllAsRead } = useAdminMarkAllNotificationsAsRead();
    const { mutateAsync: markAsRead } = useAdminMarkAsRead();

    return {
      data,
      hasNextPage,
      fetchNextPage,
      isFetching,
      isLoading,
      deleteNotification,
      markAllAsRead,
      markAsRead,
    };
  }

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isLoading,
  } = useSuperAdminNotifications();
  const { mutateAsync: deleteNotification } = useSuperAdminDeleteNotification();
  const { mutateAsync: markAllAsRead } = useSuperAdminMarkAllNotificationsAsRead();
  const { mutateAsync: markAsRead } = useSuperAdminMarkAsRead();

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isLoading,
    deleteNotification,
    markAllAsRead,
    markAsRead,
  };
}
