import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  showCoupon,
  updateCoupon,
} from "../../../api/AdminApi/couponsApi/_requests";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";

const UpdateCoupon = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [couponData, setCouponData] = useState({
    code: "",
    type: "fixed",
    value: "",
    max_discount: "",
    min_order_amount: "",
    usage_limit: "",
    used_count: "",
    active: "1",
    start_at: "",
    expires_at: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        if (id) {
          const res = await showCoupon(id);
          const data = res.data.data;

          setCouponData({
            code: data.code || "",
            type: data.type || "fixed",
            value: data.value || "",
            max_discount: data.max_discount || "",
            min_order_amount: data.min_order_amount || "",
            usage_limit: data.usage_limit || "",
            used_count: data.used_count || "",
            active: data.active?.toString() || "1",
            start_at: data.start_at || "",
            expires_at: data.expires_at || "",
          });
        }
      } catch (err) {
        console.error("Error fetching coupon:", err);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCoupon(id, couponData);
        navigate("/admin/coupons", {
          state: { successEdit: "Coupon updated successfully" },
        });
      }
    } catch (err: any) {
      const rawErrors = err?.response?.data?.errors;
      const formattedErrors: Record<string, string[]> = {};
      if (Array.isArray(rawErrors)) {
        rawErrors.forEach((error: { code: string; message: string }) => {
          if (!formattedErrors[error.code]) {
            formattedErrors[error.code] = [];
          }
          formattedErrors[error.code].push(error.message);
        });
        setErrors(formattedErrors);
      }
    }
  };

  const renderError = (field: string) => {
    return errors[field]?.[0] ? (
      <p className="text-red-500 text-sm">{errors[field][0]}</p>
    ) : null;
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Edit Coupon</h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Coupon Code */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="code">Code</Label>
          </div>
          <Input
            name="code"
            value={couponData.code}
            onChange={handleChange}
            placeholder="Coupon Code"
          />
          {renderError("code")}
        </div>

        {/* Type */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="type">Type</Label>
          </div>
          <Select
            options={[
              { label: "Fixed", value: "fixed" },
              { label: "Percent", value: "percent" },
            ]}
            defaultValue={couponData.type}
            onChange={(value) => handleSelectChange(value, "type")}
          />
          {renderError("type")}
        </div>

        {/* Value */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="value">Value</Label>
          </div>
          <Input
            name="value"
            value={couponData.value}
            onChange={handleChange}
            placeholder="Value (e.g. 50 or 10%)"
          />
          {renderError("value")}
        </div>

        {/* Max Discount */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="max_discount">Max Discount</Label>
          </div>
          <Input
            name="max_discount"
            value={couponData.max_discount}
            onChange={handleChange}
            placeholder="Maximum Discount"
          />
          {renderError("max_discount")}
        </div>

        {/* Minimum Order Amount */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="min_order_amount">Min Order Amount</Label>
          </div>
          <Input
            name="min_order_amount"
            value={couponData.min_order_amount}
            onChange={handleChange}
            placeholder="Minimum Order Amount"
          />
          {renderError("min_order_amount")}
        </div>

        {/* Usage Limit */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="usage_limit">Usage Limit</Label>
          </div>
          <Input
            name="usage_limit"
            value={couponData.usage_limit}
            onChange={handleChange}
            placeholder="Usage Limit"
          />
          {renderError("usage_limit")}
        </div>

        {/* Used Count */}
        <div>
          <Label htmlFor="used_count">Used Count</Label>
          <Input
            name="used_count"
            value={couponData.used_count}
            onChange={handleChange}
            placeholder="Used Count"
            disabled
          />
        </div>

        {/* Active Status */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="active">Status</Label>
          </div>
          <Select
            options={[
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ]}
            defaultValue={couponData.active}
            onChange={(value) => handleSelectChange(value, "active")}
          />
          {renderError("active")}
        </div>

        {/* Start At */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="start_at">Start Date</Label>
          </div>
          <Input
            type="datetime-local"
            name="start_at"
            value={couponData.start_at}
            onChange={handleChange}
          />
          {renderError("start_at")}
        </div>

        {/* Expires At */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="expires_at">End Date</Label>
          </div>
          <Input
            type="datetime-local"
            name="expires_at"
            value={couponData.expires_at}
            onChange={handleChange}
          />
          {renderError("expires_at")}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCoupon;
