import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import {
  useGetCouponById,
  useUpdateCoupon,
} from "../../../hooks/Api/SuperAdmin/useCoupons/useCoupons";
import SEO from "../../common/SEO/seo";
import { ClientErrors, CouponInput, ServerError } from "../../../types/Coupons";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useCheckOnline from "../../../hooks/useCheckOnline";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";

const UpdateCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("UpdateCoupon");
  const [loading, setLoading] = useState<boolean>(false);
  const [couponData, setCouponData] = useState<CouponInput>({
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

  const [errors, setErrors] = useState<ServerError>({
    code: [],
    type: [],
    value: [],
    max_discount: [],
    min_order_amount: [],
    usage_limit: [],
    active: [],
    start_at: [],
    expires_at: [],
    general: "",
    global: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({
    code: "",
    type: "",
    value: "",
    max_discount: "",
    min_order_amount: "",
    usage_limit: "",
    active: "",
    start_at: "",
    expires_at: "",
  });

  const { data, isError, isLoading, error } = useGetCouponById(id!);
  const coupon = data;

  useEffect(() => {
    if (coupon) {
      setCouponData({
        code: coupon.code || "",
        type: coupon.type || "fixed",
        value: coupon.value || "",
        max_discount: coupon.max_discount || "",
        min_order_amount: coupon.min_order_amount || "",
        usage_limit: coupon.usage_limit || "",
        active: coupon.active || "1",
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
    const newErrors = {
      code: "",
      type: "",
      value: "",
      max_discount: "",
      min_order_amount: "",
      usage_limit: "",
      active: "",
      start_at: "",
      expires_at: "",
    };

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
    return Object.values(newErrors).every((val) => val === "");
  };

  const { mutateAsync } = useUpdateCoupon(id!);
  const isCurrentlyOnLine = useCheckOnline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      code: [],
      type: [],
      value: [],
      max_discount: [],
      min_order_amount: [],
      usage_limit: [],
      active: [],
      start_at: [],
      expires_at: [],
      general: "",
      global: "",
    });

    if (!validate()) return;
    if (!isCurrentlyOnLine()) {
      toast.error(t("coupon.errors.no_internet"));
      return;
    }
    setLoading(true);

    try {
      if (id) {
        await mutateAsync({ id: +id, couponData: couponData });
        navigate("/super_admin/coupons", {
          state: { successEdit: t("coupon.success") },
        });
      }
    } catch (error: any) {
      console.error("Error updating coupon:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: t("coupon.errors.global"),
        }));
      } else {
        const rawErrors = error?.response?.data.errors;
        if (Array.isArray(rawErrors)) {
          const formattedErrors: Record<string, string[]> = {};
          rawErrors.forEach((err: { code: string; message: string }) => {
            if (!formattedErrors[err.code]) {
              formattedErrors[err.code] = [];
            }
            formattedErrors[err.code].push(err.message);
          });
          setErrors((prev) => ({ ...prev, ...formattedErrors }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: t("coupon.errors.general"),
          }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

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
      pageError = t("coupon.errors.global");
    } else {
      pageError = t("coupon.errors.general");
    }
  } else if (!coupon) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  return (
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("coupon.loading")}
      errorMessage={pageError}
      notFoundMessage={t("coupon.notFound")}
    >
      <SEO
        title={{
          ar: `تشطيبة - تحديث كوبون ${coupon?.code || ""}`,
          en: `Tashtiba - Update Coupon ${coupon?.code || ""} (Super Admin)`,
        }}
        description={{
          ar: `صفحة تحديث الكوبون "${
            coupon?.code || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة. عدّل تفاصيل الكوبون وقيمته وحد الاستخدام.`,
          en: `Update coupon "${
            coupon?.code || "unknown"
          }" details by Super Admin on Tashtiba. Modify coupon value and usage limit.`,
        }}
        keywords={{
          ar: [
            `تحديث كوبون ${coupon?.code || ""}`,
            "تعديل خصم",
            "إدارة الكوبونات",
            "سوبر أدمن",
            "رموز الخصم",
            "تشطيبة",
          ],
          en: [
            `update coupon ${coupon?.code || ""}`,
            "edit discount",
            "coupon management",
            "super admin",
            "discount codes",
            "Tashtiba",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          {t("coupon.editCoupon")}
        </h3>
        {errors.global && (
          <p className="text-error-500 text-sm mt-4 text-center">
            {errors.global}
          </p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errors.general}
          </p>
        )}
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
            {errors.code[0] && (
              <p className="text-red-500 text-sm">
                {t("coupon.errors.code_exists")}
              </p>
            )}
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
              placeholder={t("coupon.placeholders.select_type")}
            />
            {clientSideErrors.type && (
              <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
            )}
            {errors.type[0] && (
              <p className="text-red-500 text-sm">{errors.type[0]}</p>
            )}
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
            {errors.value[0] && (
              <p className="text-red-500 text-sm">{errors.value[0]}</p>
            )}
          </div>
          {/* Max Discount */}
          <div>
            <Label htmlFor="max_discount">{t("coupon.maxDiscount")}</Label>
            <Input
              name="max_discount"
              value={couponData.max_discount}
              onChange={handleChange}
              placeholder={t("coupon.placeholders.max_discount")}
            />
            {clientSideErrors.max_discount && (
              <p className="text-red-500 text-sm">
                {clientSideErrors.max_discount}
              </p>
            )}
            {errors.max_discount[0] && (
              <p className="text-red-500 text-sm">{errors.max_discount[0]}</p>
            )}
          </div>
          {/* Min Order Amount */}
          <div>
            <Label htmlFor="min_order_amount">
              {t("coupon.minOrderAmount")}
            </Label>
            <Input
              name="min_order_amount"
              value={couponData.min_order_amount}
              onChange={handleChange}
              placeholder={t("coupon.placeholders.min_order_amount")}
            />
            {clientSideErrors.min_order_amount && (
              <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
            )}
            {errors.min_order_amount[0] && (
              <p className="text-red-500 text-sm">
                {errors.min_order_amount[0]}
              </p>
            )}
          </div>
          {/* Usage Limit */}
          <div>
            <Label htmlFor="usage_limit">{t("coupon.usageLimit")}</Label>
            <Input
              name="usage_limit"
              value={couponData.usage_limit}
              onChange={handleChange}
              placeholder={t("coupon.placeholders.usage_limit")}
            />
            {clientSideErrors.usage_limit && (
              <p className="text-red-500 text-sm">
                {clientSideErrors.usage_limit}
              </p>
            )}
            {errors.usage_limit[0] && (
              <p className="text-red-500 text-sm">{errors.usage_limit[0]}</p>
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
              placeholder={t("coupon.placeholders.select_status")}
            />
            {clientSideErrors.active && (
              <p className="text-red-500 text-sm">{clientSideErrors.active}</p>
            )}
            {errors.active[0] && (
              <p className="text-red-500 text-sm">{errors.active[0]}</p>
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
              <p className="text-red-500 text-sm">
                {clientSideErrors.start_at}
              </p>
            )}
            {errors.start_at[0] && (
              <p className="text-red-500 text-sm">{errors.start_at[0]}</p>
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
            {errors.expires_at[0] && (
              <p className="text-red-500 text-sm">{errors.expires_at[0]}</p>
            )}
          </div>
          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto text-white bg-brand-500 hover:bg-brand-600 px-5 py-2 rounded-lg"
            >
              {loading
                ? t("coupon.button.submitting")
                : t("coupon.button.submit")}
            </button>
          </div>
        </form>
      </div>
    </PageStatusHandler>
  );
};

export default UpdateCoupon;
