import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showCoupon } from "../../../api/AdminApi/couponsApi/_requests";
import { useTranslation } from "react-i18next";
import { useGetCouponById } from "../../../hooks/Api/Admin/useCoupons/useCoupons";

interface Coupon {
  code: string;
  type: "fixed" | "percent";
  value: string;
  max_discount: string | null;
  min_order_amount: string;
  usage_limit: number;
  used_count: string;
  active: "1" | "0";
  start_at: string;
  expires_at: string;
}

const CouponDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["CouponDetails"]);
  const [couponData, setCouponData] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  const { data, isError, error, isLoading } = useGetCouponById(id);

  const coupon = data?.data?.data;

  useEffect(() => {
    if (coupon) {
      setCouponData(coupon);
    }
  }, [coupon]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-white">
        {t("coupon.no_id")}
      </div>
    );

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-white">
        {t("coupon.loading")}
      </div>
    );

  if (!couponData)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-white">
        {t("coupon.not_found")}
      </div>
    );

  return (
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
            <strong>{t("coupon.code")}:</strong> {couponData.code}
          </p>
          <p>
            <strong>{t("coupon.type")}:</strong>{" "}
            {t(`coupon.${couponData.type}`)}
          </p>
          <p>
            <strong>{t("coupon.value")}:</strong> {couponData.value}
            {couponData.type === "percent" ? "%" : " EGP"}
          </p>
          <p>
            <strong>{t("coupon.status")}:</strong>{" "}
            {t(`coupon.${couponData.active === "1" ? "active" : "inactive"}`)}
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
            {couponData.min_order_amount} EGP
          </p>
          <p>
            <strong>{t("coupon.max_discount")}:</strong>{" "}
            {couponData.max_discount || t("coupon.no_limit")}
          </p>
          <p>
            <strong>{t("coupon.usage_limit")}:</strong> {couponData.usage_limit}
          </p>
          <p>
            <strong>{t("coupon.used_count")}:</strong> {couponData.used_count}
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
            {formatDate(couponData.start_at)}
          </p>
          <p>
            <strong>{t("coupon.expires_at")}:</strong>{" "}
            {formatDate(couponData.expires_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CouponDetails;
