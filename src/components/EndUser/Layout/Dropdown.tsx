import { useEffect, useRef } from "react";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkAsRead,
  useNotifications,
} from "../../../hooks/Api/EndUser/useNotification/useEndUserNotification";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import {
  NotificationItem,
  NotificationDropdownProps,
} from "../../../types/Notification";

export default function NotificationDropdown({
  open,
  onClose,
  notificationIconRef,
}: NotificationDropdownProps) {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { dir, lang } = useDirectionAndLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        event.target instanceof Node &&
        !dropDownRef.current.contains(event.target) &&
        notificationIconRef.current &&
        !notificationIconRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose, notificationIconRef]);

  const { data, hasNextPage, fetchNextPage } = useNotifications();

  const notificationData: NotificationItem[] =
    data?.pages.flatMap((page) => page.data) || [];

  const { mutateAsync: deleteNotificationMutate } = useDeleteNotification();
  const handleDeleteNotification = async (id: number | string) => {
    await deleteNotificationMutate(String(id));
  };
  const { mutateAsync: markAsRead } = useMarkAsRead();
  const { mutateAsync: markAllAsRead } = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleItemClick = async (id: number) => {
    onClose();
    await markAsRead(id);
  };

  return (
    <>
      {open && (
        <div
          ref={dropDownRef}
          className={`absolute ${
            dir === "ltr" ? "!-right-10" : "!-left-10"
          } top-2 mt-2 w-80 bg-white rounded-xl shadow-lg z-10 border border-gray-200`}
        >
          <div className="p-4 border-b flex items-center justify-between border-gray-200">
            <h3 className="font-semibold text-gray-800">
              {lang === "ar" ? "الإشعارات" : "Notifications"}
            </h3>
            {notificationData.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-500 hover:underline"
              >
                {lang === "ar" ? "تحديد الكل كمقروء" : "Mark All as Read"}
              </button>
            )}
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notificationData.map((notification) => (
              <li
                className="flex items-start justify-between gap-1 hover:bg-gray-50"
                key={notification.id}
              >
                <Link
                  onClick={() => handleItemClick(Number(notification.id))}
                  className="block px-4 py-3 border-b border-gray-200 transition"
                  to={`/${lang}/notification/${notification.data_id}`}
                >
                  <h4 className="font-medium text-gray-700">
                    {notification[`title_${lang}` as "title_en" | "title_ar"]}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {
                      notification[
                        `message_${lang}` as "message_en" | "message_ar"
                      ]
                    }
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </Link>
                <button
                  onClick={() =>
                    handleDeleteNotification(Number(notification.id))
                  }
                  className={`block text-gray-500 transition dark:text-gray-400 px-1 py-1 ${
                    dir === "ltr" ? "!text-left" : "!text-right"
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="block w-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-50"
            >
              {lang === "ar" ? "عرض المزيد" : "Show More"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
