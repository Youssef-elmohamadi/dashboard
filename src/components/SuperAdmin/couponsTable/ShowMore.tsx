import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetCouponById } from "../../../hooks/Api/SuperAdmin/useCoupons/useCoupons";
import { AxiosError } from "axios";
import PageMeta from "../../common/SEO/PageMeta";

const CouponDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["CouponDetails"]);
  //const [couponData, setCouponData] = useState<Coupon | null>(null);
  const [globalError, setGlobalError] = useState<string>("");
  const { data, isLoading, isError, error } = useGetCouponById(id!!);

  const couponData = data;

  // useEffect(() => {
  //   if (coupon) {
  //     setCouponData(coupon);
  //   }
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
        <PageMeta title={t("mainTitle")} description="Category Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageMeta
          title={t("coupon.mainTitle")}
          description="Category Details"
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
        <PageMeta
          title={t("coupon.mainTitle")}
          description="Category Details"
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
        <PageMeta
          title={t("coupon.mainTitle")}
          description="Category Details"
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {globalError}
        </div>
      </>
    );
  }

  return (
    <div className="coupon-details py-6 max-w-4xl mx-auto space-y-8">
      <PageMeta title={t("coupon.mainTitle")} description="Category Details" />
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
