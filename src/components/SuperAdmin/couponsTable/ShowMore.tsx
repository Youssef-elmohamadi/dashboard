import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetCouponById } from "../../../hooks/Api/SuperAdmin/useCoupons/useCoupons";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";

const CouponDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["CouponDetails"]);
  const { data, isLoading, isError, error } = useGetCouponById(id!);

  const couponData = data;
  let pageStatus = PageStatus.SUCCESS;
  let pageError = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    if (
      axiosError?.response?.status === 401 ||
      axiosError?.response?.status === 403
    ) {
      pageError = t("coupon.global_error");
    } else {
      pageError = t("coupon.general_error");
    }
  } else if (!couponData) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : t("coupon.no_date");

  return (
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("coupon.loading")}
      errorMessage={pageError}
      notFoundMessage={t("coupon.not_found")}
    >
      <SEO
        title={{
          ar: `تشطيبة - تفاصيل الكوبون ${couponData?.code || ""}`,
          en: `Tashtiba - Coupon Details ${
            couponData?.code || ""
          } (Super Admin)`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للكوبون "${
            couponData?.code || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة، بما في ذلك النوع، القيمة، وحد الاستخدام.`,
          en: `View full details for coupon "${
            couponData?.code || "unknown"
          }" by Super Admin on Tashtiba, including type, value, and usage limit.`,
        }}
        keywords={{
          ar: [
            `كوبون ${couponData?.code || ""}`,
            "تفاصيل الكوبون",
            "عرض كوبون",
            "نوع الكوبون",
            "قيمة الكوبون",
            "إدارة الكوبونات",
            "سوبر أدمن",
          ],
          en: [
            `coupon ${couponData?.code || ""}`,
            "coupon details",
            "view coupon",
            "coupon type",
            "coupon value",
            "coupon management",
            "super admin",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="coupon-details py-6 max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white">
          {t("coupon.title")}
        </h1>
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            {t("coupon.basic_info")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("coupon.code")}:</strong> {couponData?.code}
            </p>
            <p>
              <strong>{t("coupon.type")}:</strong>{" "}
              {t(`coupon.${couponData?.type}`)}
            </p>
            <p>
              <strong>{t("coupon.value")}:</strong> {couponData?.value}
              {couponData?.type === "percent" ? "%" : " EGP"}
            </p>
            <p>
              <strong>{t("coupon.status")}:</strong>{" "}
              {t(
                `coupon.${couponData?.active === "1" ? "active" : "inactive"}`
              )}
            </p>
          </div>
        </section>
        {/* Conditions */}
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            {t("coupon.conditions")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("coupon.min_order")}:</strong>{" "}
              {couponData?.min_order_amount} EGP
            </p>
            <p>
              <strong>{t("coupon.max_discount")}:</strong>{" "}
              {couponData?.max_discount || t("coupon.no_limit")}
            </p>
            <p>
              <strong>{t("coupon.usage_limit")}:</strong>{" "}
              {couponData?.usage_limit}
            </p>
            <p>
              <strong>{t("coupon.used_count")}:</strong>{" "}
              {couponData?.used_count}
            </p>
          </div>
        </section>
        {/* Validity */}
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            {t("coupon.validity")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("coupon.start_at")}:</strong>{" "}
              {formatDate(couponData?.start_at)}
            </p>
            <p>
              <strong>{t("coupon.expires_at")}:</strong>{" "}
              {formatDate(couponData?.expires_at)}
            </p>
          </div>
        </section>
      </div>
    </PageStatusHandler>
  );
};

export default CouponDetails;
