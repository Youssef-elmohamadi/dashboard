import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import BrandImageUpload from "./BrandImageUpload";
import {
  updateBrand,
  getBrandById,
} from "../../../api/AdminApi/brandsApi/_requests";

type Brand = {
  name: string;
  status: string;
  image: string | File;
};

const UpdateBrandPage = () => {
  const { t } = useTranslation("UpdateBrand");
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateData, setUpdateData] = useState({
    name: "",
    status: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const brandData = await getBrandById(id);
        setUpdateData({
          name: brandData.data.data.name || "",
          status: brandData.data.data.status || "active",
          image: brandData.data.data?.image,
        });
      } catch (err) {
        setError(t("load_error"));
      }
    };
    fetchBrand();
  }, [id, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setUpdateData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let hasError = false;
    let newErrors: { name?: string } = {};

    if (!updateData.name) {
      newErrors.name = t("name_required");
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("status", updateData.status);

      if (updateData.image && typeof updateData.image !== "string") {
        formData.append("image", updateData.image);
      }

      await updateBrand(formData, id);
      navigate("/admin/brands");
    } catch (err: any) {
      setError(err.message || t("submit_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("update_title")}
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="name">{t("name_label")}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder={t("name_placeholder_edit")}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>{t("status_label")}</Label>
            <Select
              options={[
                { label: t("status_active"), value: "active" },
                { label: t("status_inactive"), value: "inactive" },
              ]}
              onChange={handleSelectChange}
              placeholder={t("status_label")}
              defaultValue={updateData.status || "active"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div className="w-full">
            <Label>{t("image_label")}</Label>
            <BrandImageUpload
              file={updateData.image}
              onFileChange={handleFileChange}
            />
          </div>

          <div>
            {typeof updateData.image === "string" && updateData.image && (
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-400 font-medium mb-4 text-sm">
                  {t("current_image")}
                </p>
                <img
                  src={updateData.image}
                  alt="Brand Preview"
                  className="w-32 h-32 object-cover rounded border dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t("loading_button") : t("submit_button")}
        </button>
      </form>
    </div>
  );
};

export default UpdateBrandPage;
