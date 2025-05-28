import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  showCoupon,
  updateCoupon,
} from "../../../api/AdminApi/couponsApi/_requests";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { useGetCouponById } from "../../../hooks/useCoupons";

const UpdateCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateCoupon"]);

  const [couponData, setCouponData] = useState({
    code: "",
    type: "fixed",
    value: "",
    max_discount: "",
    min_order_amount: "",
    usage_limit: "",
    active: "1",
    start_at: "",
    expires_at: "",
  });

  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({});

  const [errors, setErrors] = useState({
    code: [] as string[],
    type: [] as string[],
    value: [] as string[],
    max_discount: [] as string[],
    min_order_amount: [] as string[],
    usage_limit: [] as string[],
    active: [] as string[],
    start_at: [] as string[],
    expires_at: [] as string[],
  });

  const { data, isError, error } = useGetCouponById(id);

  const coupon = data?.data?.data;

  useEffect(() => {
    if (coupon) {
      setCouponData({
        code: coupon.code || "",
        type: coupon.type || "fixed",
        value: coupon.value || "",
        max_discount: coupon.max_discount || "",
        min_order_amount: coupon.min_order_amount || "",
        usage_limit: coupon.usage_limit || "",
        active: coupon.active?.toString() || "1",
        start_at: coupon.start_at || "",
        expires_at: coupon.expires_at || "",
      });
    }
  }, [coupon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!couponData.code) newErrors.code = t("coupon.errors.code");
    if (!couponData.value) newErrors.value = t("coupon.errors.value");
    if (!couponData.min_order_amount)
      newErrors.min_order_amount = t("coupon.errors.min_order_amount");
    if (!couponData.usage_limit)
      newErrors.usage_limit = t("coupon.errors.usage_limit");
    if (!couponData.start_at) newErrors.start_at = t("coupon.errors.start_at");
    if (!couponData.expires_at)
      newErrors.expires_at = t("coupon.errors.expires_at.required");
    if (
      couponData.start_at &&
      couponData.expires_at &&
      new Date(couponData.expires_at) <= new Date(couponData.start_at)
    ) {
      newErrors.expires_at = t("coupon.errors.expires_at.invalid");
    }

    setClientSideErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (id) {
        await updateCoupon(id, couponData);
        navigate("/admin/coupons", {
          state: { successEdit: t("coupon.successMessage") },
        });
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("errors.global"),
        });
        return;
      }
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};

        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setErrors(formattedErrors);
      } else {
        setErrors({ general: [t("admin.errors.general")] });
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        {t("coupon.editCoupon")}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Code */}
        <div>
          <Label htmlFor="code">{t("coupon.code")}</Label>
          <Input
            name="code"
            value={couponData.code}
            onChange={handleChange}
            placeholder={t("coupon.placeholders.code")}
          />
          {clientSideErrors.code && (
            <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
          )}
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type">{t("coupon.type")}</Label>
          <Select
            options={[
              { label: t("coupon.fixed"), value: "fixed" },
              { label: t("coupon.percent"), value: "percent" },
            ]}
            value={couponData.type}
            onChange={(value) => handleSelectChange(value, "type")}
          />
          {clientSideErrors.type && (
            <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
          )}
          {errors.type && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        {/* Value */}
        <div>
          <Label htmlFor="value">{t("coupon.value")}</Label>
          <Input
            name="value"
            value={couponData.value}
            onChange={handleChange}
            placeholder={t("coupon.placeholders.value")}
          />
          {clientSideErrors.value && (
            <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
          )}
          {errors.value && (
            <p className="text-red-500 text-sm">{errors.code}</p>
          )}
        </div>

        {/* Max Discount */}
        <div>
          <Label htmlFor="max_discount">{t("coupon.maxDiscount")}</Label>
          <Input
            name="max_discount"
            value={couponData.max_discount}
            onChange={handleChange}
            placeholder={t("coupon.placeholders.maxDiscount")}
          />
          {clientSideErrors.max_discount && (
            <p className="text-red-500 text-sm">
              {clientSideErrors.max_discount}
            </p>
          )}
          {errors.max_discount && (
            <p className="text-red-500 text-sm">{errors.max_discount}</p>
          )}
        </div>

        {/* Min Order Amount */}
        <div>
          <Label htmlFor="min_order_amount">{t("coupon.minOrderAmount")}</Label>
          <Input
            name="min_order_amount"
            value={couponData.min_order_amount}
            onChange={handleChange}
            placeholder={t("coupon.placeholders.minOrderAmount")}
          />
          {clientSideErrors.min_order_amount && (
            <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
          )}
          {errors.min_order_amount && (
            <p className="text-red-500 text-sm">{errors.code}</p>
          )}
        </div>

        {/* Usage Limit */}
        <div>
          <Label htmlFor="usage_limit">{t("coupon.usageLimit")}</Label>
          <Input
            name="usage_limit"
            value={couponData.usage_limit}
            onChange={handleChange}
            placeholder={t("coupon.placeholders.usageLimit")}
          />
          {clientSideErrors.usage_limit && (
            <p className="text-red-500 text-sm">
              {clientSideErrors.usage_limit}
            </p>
          )}
          {errors.usage_limit && (
            <p className="text-red-500 text-sm">{errors.usage_limit}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="active">{t("coupon.status")}</Label>
          <Select
            options={[
              { label: t("coupon.active"), value: "1" },
              { label: t("coupon.inactive"), value: "0" },
            ]}
            value={couponData.active}
            onChange={(value) => handleSelectChange(value, "active")}
          />
          {clientSideErrors.active && (
            <p className="text-red-500 text-sm">{clientSideErrors.active}</p>
          )}
          {errors.active && (
            <p className="text-red-500 text-sm">{errors.active}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="start_at">{t("coupon.startDate")}</Label>
          <Input
            type="datetime-local"
            name="start_at"
            value={couponData.start_at}
            onChange={handleChange}
          />
          {clientSideErrors.start_at && (
            <p className="text-red-500 text-sm">{clientSideErrors.start_at}</p>
          )}
          {errors.start_at && (
            <p className="text-red-500 text-sm">{errors.start_at}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <Label htmlFor="expires_at">{t("coupon.endDate")}</Label>
          <Input
            type="datetime-local"
            name="expires_at"
            value={couponData.expires_at}
            onChange={handleChange}
          />
          {clientSideErrors.expires_at && (
            <p className="text-red-500 text-sm">
              {clientSideErrors.expires_at}
            </p>
          )}
          {errors.expires_at && (
            <p className="text-red-500 text-sm">{errors.expires_at}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg"
          >
            {t("coupon.saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCoupon;
