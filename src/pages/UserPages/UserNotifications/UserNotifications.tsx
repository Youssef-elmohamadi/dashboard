import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Circles } from "react-loader-spinner";
import { toast } from "react-toastify";
import {
  HiOutlineBellAlert,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineChevronDoubleDown,
} from "react-icons/hi2";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";

import SEO from "../../../components/common/SEO/seo";
import {
  useNotifications,
  useDeleteNotification,
  useMarkAsRead,
  useMarkAllNotificationsAsRead,
} from "../../../hooks/Api/EndUser/useNotification/useEndUserNotification";
const UserNotifications: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation("EndUserNotifications");

  const primaryColor = "#9810fa";
  const secondaryColor = "#542475";

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      toast.error(
        t("authRequired", {
          defaultValue: "Please login first to view notifications.",
        })
      );
      navigate(`/${lang}/signin`, { replace: true });
    }
  }, [navigate, t]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();

  const notifications = data?.pages.flatMap((page) => page.data) || [];

  const deleteNotificationMutation = useDeleteNotification();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
      toast.success(
        t("notificationDeleted", {
          defaultValue: "Notification deleted successfully!",
        })
      );
    } catch (error) {
      toast.error(
        t("deleteError", { defaultValue: "Failed to delete notification." })
      );
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      toast.error(
        t("markReadError", {
          defaultValue: "Failed to mark notification as read.",
        })
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success(
        t("allNotificationsRead", {
          defaultValue: "All notifications marked as read!",
        })
      );
    } catch (error) {
      toast.error(
        t("markAllReadError", {
          defaultValue: "Failed to mark all notifications as read.",
        })
      );
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: lang === "ar" ? ar : enUS,
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-4">
      <SEO
        title={{
          ar: `تشطيبة - إشعاراتي`,
          en: `Tashtiba - My Notifications`,
        }}
        description={{
          ar: `شاهد آخر الإشعارات والتحديثات من تشطيبة حول طلباتك، العروض الجديدة، والتنبيهات الهامة. ابقَ على اطلاع دائم بكل جديد.`,
          en: `View your latest notifications and updates from Tashtiba regarding your orders, new offers, and important alerts. Stay up-to-date with everything new.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "إشعارات",
            "تنبيهات",
            "تحديثات",
            "رسائل",
            "طلباتي",
            "عروض جديدة",
            "مصر",
            "حسابي",
          ],
          en: [
            "tashtiba",
            "notifications",
            "alerts",
            "updates",
            "messages",
            "my orders",
            "new offers",
            "Egypt",
            "my account",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/notifications" },
          { lang: "en", href: "https://tashtiba.com/en/notifications" },
          {
            lang: "x-default",
            href: "https://tashtiba.com/en/notifications",
          },
        ]}
      />

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6 border-b-2" style={{ borderColor: primaryColor }}>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: secondaryColor }}
          >
            <HiOutlineBellAlert className="h-8 w-8" />
            {t("pageTitle", { defaultValue: "إشعاراتي" })}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("pageSubtitle", {
              defaultValue:
                "هنا يمكنك مراجعة جميع التنبيهات والتحديثات الهامة.",
            })}
          </p>
        </div>

        <div className="p-6">
          {isLoading && !notifications.length ? (
            <div className="flex justify-center items-center py-10">
              <Circles
                height="80"
                width="80"
                color={secondaryColor}
                ariaLabel="loading-notifications"
              />
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              {t("fetchError", {
                defaultValue: "حدث خطأ أثناء تحميل الإشعارات.",
              })}
            </div>
          ) : !notifications.length ? (
            <div className="text-center text-gray-500 py-10">
              {t("noNotifications", {
                defaultValue: "لا توجد إشعارات حاليًا.",
              })}
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center justify-between w-[250px] px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  disabled={markAllAsReadMutation.isPending}
                >
                  {markAllAsReadMutation.isPending ? (
                    <HiOutlineArrowPath className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
                  ) : (
                    <HiOutlineCheckCircle
                      className="-ml-1 mr-2 h-5 w-5"
                      style={{ color: secondaryColor }}
                    />
                  )}
                  {t("markAllAsRead", {
                    defaultValue: "وضع علامة 'تمت القراءة' للكل",
                  })}
                </button>
              </div>

              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`relative p-5 rounded-lg flex items-start gap-4 transition-all duration-300 ${
                      notification.is_read === 1
                        ? "bg-gray-100 text-gray-600 border border-gray-200"
                        : "bg-white text-gray-800 border-l-4"
                    }`}
                    style={{
                      borderColor:
                        notification.is_read === 0 ? primaryColor : undefined,
                    }}
                  >
                    <div className="flex-shrink-0 pt-1">
                      <HiOutlineBellAlert
                        className="h-6 w-6"
                        style={{
                          color:
                            notification.is_read === 1
                              ? "#9ca3af"
                              : primaryColor,
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg mb-1">
                        {lang === "ar"
                          ? notification.title_ar
                          : notification.title_en}
                      </h3>
                      <p className="text-sm">
                        {lang === "ar"
                          ? notification.message_ar
                          : notification.message_en}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        {getTimeAgo(notification.created_at)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {notification.is_read === 0 && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-500 hover:text-green-600 transition p-1 rounded-full hover:bg-gray-200"
                          title={t("markAsRead", {
                            defaultValue: "وضع علامة 'تمت القراءة'",
                          })}
                        >
                          <HiOutlineCheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="text-gray-500 hover:text-red-600 transition p-1 rounded-full hover:bg-gray-200"
                        title={t("deleteNotification", {
                          defaultValue: "حذف الإشعار",
                        })}
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isFetchingNextPage ? (
                      <Circles
                        height="20"
                        width="20"
                        color="#fff"
                        ariaLabel="loading-more"
                      />
                    ) : (
                      <>
                        <HiOutlineChevronDoubleDown className="h-5 w-5" />
                        {t("loadMore", { defaultValue: "تحميل المزيد" })}
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserNotifications);
