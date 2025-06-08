import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { useCreateCoupon } from "../../../hooks/Api/Admin/useCoupons/useCoupons";
export default function CreateCoupon() {
  const { t } = useTranslation(["CreateCoupon"]);
  const navigate = useNavigate();
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
    general: "" as string,
    global: "" as string,
  });
  const [loading, setLoading] = useState(false);
  const [clientSideErrors, setClientSideErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "value" && couponData.type === "percent") {
      if (Number(value) > 100) return;
    }

    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    if (!couponData.type) newErrors.type = t("coupon.errors.type");
    if (!couponData.active) newErrors.active = t("coupon.errors.status");
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

  const { mutateAsync } = useCreateCoupon();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);
    try {
      await mutateAsync(couponData);
      navigate("/admin/coupons", {
        state: { successCreate: t("coupon.success") },
      });
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

        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors({ ...errors, general: t("errors.global") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("coupon.title")}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-8 flex flex-col items-center"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label>{t("coupon.fields.code")}</Label>
            <Input
              name="code"
              placeholder={t("coupon.placeholders.code")}
              onChange={handleChange}
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

          <div>
            <Label>{t("coupon.fields.type")}</Label>
            <Select
              options={[
                { value: "fixed", label: t("coupon.types.fixed") },
                { value: "percent", label: t("coupon.types.percent") },
              ]}
              value={couponData.type}
              onChange={(val) => handleSelectChange("type", val)}
              placeholder={t("coupon.placeholders.select_type")}
            />
            {clientSideErrors.type && (
              <p className="text-red-500 text-sm">{clientSideErrors.type}</p>
            )}
            {errors.type[0] && (
              <p className="text-red-500 text-sm">{errors.type[0]}</p>
            )}
          </div>

          <div>
            <Label>{t("coupon.fields.value")}</Label>
            <Input
              name="value"
              type="number"
              placeholder={t("coupon.placeholders.value")}
              value={couponData.value}
              onChange={handleChange}
            />
            {clientSideErrors.value && (
              <p className="text-red-500 text-sm">{clientSideErrors.code}</p>
            )}
            {errors.value[0] && (
              <p className="text-red-500 text-sm">{errors.value[0]}</p>
            )}
          </div>

          <div>
            <Label>{t("coupon.fields.max_discount")}</Label>
            <Input
              name="max_discount"
              type="number"
              placeholder={t("coupon.placeholders.max_discount")}
              onChange={handleChange}
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

          <div>
            <Label>{t("coupon.fields.min_order_amount")}</Label>
            <Input
              name="min_order_amount"
              type="number"
              placeholder={t("coupon.placeholders.min_order_amount")}
              onChange={handleChange}
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

          <div>
            <Label>{t("coupon.fields.usage_limit")}</Label>
            <Input
              name="usage_limit"
              type="number"
              placeholder={t("coupon.placeholders.usage_limit")}
              onChange={handleChange}
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

          <div>
            <Label>{t("coupon.fields.status")}</Label>
            <Select
              options={[
                { value: "1", label: t("coupon.statusOptions.1") },
                { value: "0", label: t("coupon.statusOptions.0") },
              ]}
              value={couponData.active}
              onChange={(val) => handleSelectChange("active", val)}
              placeholder={t("coupon.placeholders.select_status")}
            />
            {clientSideErrors.active && (
              <p className="text-red-500 text-sm">{clientSideErrors.active}</p>
            )}
            {errors.active[0] && (
              <p className="text-red-500 text-sm">{errors.active[0]}</p>
            )}
          </div>

          <div>
            <Label>{t("coupon.fields.start_at")}</Label>
            <Input
              name="start_at"
              type="datetime-local"
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

          <div>
            <Label>{t("coupon.fields.expires_at")}</Label>
            <Input
              name="expires_at"
              type="datetime-local"
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
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? t("coupon.button.submitting") : t("coupon.button.submit")}
        </button>
      </form>
    </div>
  );
}
