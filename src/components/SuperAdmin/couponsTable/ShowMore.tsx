import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetCouponById } from "../../../hooks/Api/SuperAdmin/useCoupons/useCoupons";
import { AxiosError } from "axios";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component

const CouponDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["CouponDetails", "Meta"]);
  //const [couponData, setCouponData] = useState<Coupon | null>(null);
  const [globalError, setGlobalError] = useState<string>("");
  const { data, isLoading, isError, error } = useGetCouponById(id!!);

  const couponData = data;

  // useEffect(() => {
  //   if (coupon) {
  //     setCouponData(coupon);
  //   }
  // }, [coupon]);

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setGlobalError(t("coupon.global_error"));
      } else {
        setGlobalError(t("coupon.general_error"));
      }
    }
  }, [isError, error, t]);

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

  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for missing ID
          title={{
            ar: "تشطيبة - تفاصيل الكوبون - معرف مفقود (سوبر أدمن)",
            en: "Tashtiba - Coupon Details - ID Missing (Super Admin)",
          }}
          description={{
            ar: "صفحة تفاصيل الكوبون تتطلب معرف كوبون صالح. يرجى التأكد من توفير المعرف.",
            en: "The coupon details page requires a valid coupon ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تفاصيل كوبون",
              "معرف مفقود",
              "كوبون غير صالح",
              "تشطيبة",
              "إدارة الكوبونات",
              "سوبر أدمن",
            ],
            en: [
              "coupon details",
              "missing ID",
              "invalid coupon",
              "Tashtiba",
              "coupon management",
              "super admin",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تفاصيل الكوبون - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Coupon Details - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل الكوبون بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading coupon details by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تفاصيل كوبون",
              "تحميل كوبون",
              "إدارة الكوبونات",
              "سوبر أدمن",
              "خصومات",
            ],
            en: [
              "coupon details",
              "loading coupon",
              "coupon management",
              "super admin",
              "discounts",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("coupon.loading")}
        </div>
      </>
    );
  }

  if (!couponData && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تفاصيل الكوبون - غير موجود (سوبر أدمن)",
            en: "Tashtiba - Coupon Details - Not Found (Super Admin)",
          }}
          description={{
            ar: "الكوبون المطلوب غير موجود في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested coupon was not found in Tashtiba. Please check the ID.",
          }}
          keywords={{
            ar: [
              "كوبون غير موجود",
              "تفاصيل كوبون",
              "خطأ 404",
              "تشطيبة",
              "إدارة الكوبونات",
              "سوبر أدمن",
            ],
            en: [
              "coupon not found",
              "coupon details",
              "404 error",
              "Tashtiba",
              "coupon management",
              "super admin",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("coupon.not_found")}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for global error state
          title={{
            ar: "تشطيبة - تفاصيل الكوبون - خطأ عام (سوبر أدمن)",
            en: "Tashtiba - Coupon Details - Global Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل الكوبون بواسطة المشرف العام في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading coupon details by Super Admin on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ عام",
              "مشكلة تقنية",
              "تفاصيل الكوبون",
              "سوبر أدمن",
              "فشل التحميل",
            ],
            en: [
              "global error",
              "technical issue",
              "coupon details",
              "super admin",
              "loading failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {globalError}
        </div>
      </>
    );
  }

  return (
    <div className="coupon-details py-6 max-w-4xl mx-auto space-y-8">
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
      />

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
            {t(`coupon.${couponData?.active === "1" ? "active" : "inactive"}`)}
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
            <strong>{t("coupon.used_count")}:</strong> {couponData?.used_count}
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
  );
};

export default CouponDetails;
