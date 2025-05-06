import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../../../api/AdminApi/couponsApi/_requests";

export default function CreateCoupon() {
  const navigate = useNavigate();
  const [couponData, setCouponData] = useState({
    code: "",
    type: "fixed",
    value: "",
    max_discount: "",
    min_order_amount: "",
    usage_limit: "",
    //used_count: "",
    active: "1",
    start_at: "",
    expires_at: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!couponData.code) newErrors.code = "Code is required";
    if (!couponData.value) newErrors.value = "Value is required";
    if (!couponData.min_order_amount)
      newErrors.min_order_amount = "Minimum order amount is required";
    if (!couponData.usage_limit)
      newErrors.usage_limit = "Usage limit is required";
    if (!couponData.start_at) newErrors.start_at = "Start date is required";
    if (!couponData.expires_at) newErrors.expires_at = "End date is required";

    // ✅ التحقق من أن نهاية الكوبون بعد بدايته
    if (
      couponData.start_at &&
      couponData.expires_at &&
      new Date(couponData.expires_at) <= new Date(couponData.start_at)
    ) {
      newErrors.expires_at = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createCoupon(couponData);
      navigate("/admin/coupons", {
        state: { successCreate: "Coupon Created Successfully" },
      });
    } catch (error: any) {
      console.error("Failed to create coupon", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Coupon
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-8 flex flex-col items-center"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label>Code</Label>
            <Input
              name="code"
              placeholder="Enter coupon code"
              onChange={handleChange}
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>

          <div>
            <Label>Type</Label>
            <Select
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "percent", label: "Percent" },
              ]}
              defaultValue={couponData.type}
              onChange={(val) => handleSelectChange("type", val)}
            />
          </div>

          <div>
            <Label>Value</Label>
            <Input
              name="value"
              type="number"
              placeholder="Enter value"
              value={couponData.value}
              onChange={handleChange}
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value}</p>
            )}
          </div>

          <div>
            <Label>Max Discount</Label>
            <Input
              name="max_discount"
              type="number"
              placeholder="Enter max discount (optional)"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Min Order Amount</Label>
            <Input
              name="min_order_amount"
              type="number"
              placeholder="Enter minimum order amount"
              onChange={handleChange}
            />
            {errors.min_order_amount && (
              <p className="text-red-500 text-sm">{errors.min_order_amount}</p>
            )}
          </div>

          <div>
            <Label>Usage Limit</Label>
            <Input
              name="usage_limit"
              type="number"
              placeholder="Enter usage limit"
              onChange={handleChange}
            />
            {errors.usage_limit && (
              <p className="text-red-500 text-sm">{errors.usage_limit}</p>
            )}
          </div>
          {/* 
          <div>
            <Label>Used Count</Label>
            <Input
              name="used_count"
              type="number"
              placeholder="Enter used count"
              onChange={handleChange}
            />
          </div> */}

          <div>
            <Label>Status</Label>
            <Select
              options={[
                { value: "1", label: "Active" },
                { value: "0", label: "Inactive" },
              ]}
              defaultValue={couponData.active}
              onChange={(val) => handleSelectChange("active", val)}
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              name="start_at"
              type="datetime-local"
              onChange={handleChange}
            />
            {errors.start_at && (
              <p className="text-red-500 text-sm">{errors.start_at}</p>
            )}
          </div>

          <div>
            <Label>Expires At</Label>
            <Input
              name="expires_at"
              type="datetime-local"
              onChange={handleChange}
            />
            {errors.expires_at && (
              <p className="text-red-500 text-sm">{errors.expires_at}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
}
